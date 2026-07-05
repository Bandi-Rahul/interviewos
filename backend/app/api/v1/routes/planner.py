import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.models import StudyPlan, StudyTask, User

router = APIRouter(tags=["planner"])


class StudyPlanCreate(BaseModel):
    plan_type: str
    title: str
    start_date: datetime
    end_date: datetime


class StudyTaskStatusUpdate(BaseModel):
    status: str


def _plan_to_dict(p: StudyPlan) -> dict:
    return {
        "id": str(p.id),
        "user_id": str(p.user_id),
        "plan_type": p.plan_type,
        "title": p.title,
        "start_date": p.start_date.isoformat(),
        "end_date": p.end_date.isoformat(),
        "status": p.status,
        "generated_by": p.generated_by,
        "tasks": [_task_to_dict(t) for t in p.tasks],
        "created_at": p.created_at.isoformat(),
        "updated_at": p.updated_at.isoformat(),
    }


def _task_to_dict(t: StudyTask) -> dict:
    return {
        "id": str(t.id),
        "study_plan_id": str(t.study_plan_id),
        "user_id": str(t.user_id),
        "task_type": t.task_type,
        "title": t.title,
        "description": t.description,
        "due_date": t.due_date.isoformat(),
        "estimated_minutes": t.estimated_minutes,
        "priority": t.priority,
        "status": t.status,
        "completed_at": t.completed_at.isoformat() if t.completed_at else None,
        "created_at": t.created_at.isoformat(),
        "updated_at": t.updated_at.isoformat(),
    }


# ── Study Plans ──────────────────────────────────────────────────────────────

@router.get("/study-plans")
def list_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plans = db.query(StudyPlan).filter(StudyPlan.user_id == current_user.id).order_by(StudyPlan.created_at.desc()).all()
    return [_plan_to_dict(p) for p in plans]


@router.post("/study-plans", status_code=status.HTTP_201_CREATED)
def create_plan(
    payload: StudyPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = StudyPlan(user_id=current_user.id, **payload.model_dump())
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return _plan_to_dict(plan)


@router.get("/study-plans/{plan_id}")
def get_plan(
    plan_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = db.query(StudyPlan).filter(StudyPlan.id == plan_id, StudyPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
    return _plan_to_dict(plan)


@router.delete("/study-plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plan(
    plan_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = db.query(StudyPlan).filter(StudyPlan.id == plan_id, StudyPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
    db.delete(plan)
    db.commit()


@router.post("/study-plans/generate", status_code=status.HTTP_201_CREATED)
def generate_plan(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a basic daily study plan from pending revisions and weak topics."""
    from app.models.models import Revision, Problem
    from sqlalchemy import func

    plan_type = payload.get("plan_type", "daily")
    today = datetime.now(timezone.utc).date()
    days = int(payload.get("days", 1 if plan_type == "daily" else 7))

    plan = StudyPlan(
        user_id=current_user.id,
        plan_type=plan_type,
        title=f"Auto-generated {plan_type.capitalize()} Plan",
        start_date=datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc),
        end_date=datetime.combine(today + timedelta(days=days - 1), datetime.max.time()).replace(tzinfo=timezone.utc),
        generated_by="system",
    )
    db.add(plan)
    db.flush()

    # Add due revisions as tasks
    due_revisions = (
        db.query(Revision)
        .filter(
            Revision.user_id == current_user.id,
            Revision.completed_at.is_(None),
            Revision.due_date <= datetime.now(timezone.utc) + timedelta(days=days),
        )
        .limit(10)
        .all()
    )
    for rev in due_revisions:
        db.add(StudyTask(
            study_plan_id=plan.id,
            user_id=current_user.id,
            task_type="revise_problem",
            title=f"Revise: {rev.problem.title if rev.problem else 'Problem'}",
            problem_id=rev.problem_id,
            due_date=rev.due_date,
            estimated_minutes=30,
            priority="high",
        ))

    db.commit()
    db.refresh(plan)
    return _plan_to_dict(plan)


# ── Study Tasks ──────────────────────────────────────────────────────────────

@router.patch("/study-tasks/{task_id}")
def update_task(
    task_id: uuid.UUID,
    payload: StudyTaskStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    task = db.query(StudyTask).filter(StudyTask.id == task_id, StudyTask.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    task.status = payload.status
    if payload.status == "completed" and not task.completed_at:
        task.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return _task_to_dict(task)
