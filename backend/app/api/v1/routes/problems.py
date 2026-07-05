import uuid
from typing import Optional
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.models import Problem, Revision, User

router = APIRouter(prefix="/problems", tags=["problems"])


class ProblemCreate(BaseModel):
    title: str
    difficulty: str
    topic_id: Optional[uuid.UUID] = None
    pattern: Optional[str] = None
    company_tags: list[str] = []
    platform: str = "leetcode"
    url: Optional[str] = None
    status: str = "not_started"
    date_attempted: Optional[datetime] = None
    date_solved: Optional[datetime] = None
    time_taken_minutes: Optional[int] = None
    attempts_count: int = 1
    hint_used: bool = False
    confidence_score: int = 3
    notes: Optional[str] = None


class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    difficulty: Optional[str] = None
    topic_id: Optional[uuid.UUID] = None
    pattern: Optional[str] = None
    company_tags: Optional[list[str]] = None
    platform: Optional[str] = None
    url: Optional[str] = None
    status: Optional[str] = None
    date_attempted: Optional[datetime] = None
    date_solved: Optional[datetime] = None
    time_taken_minutes: Optional[int] = None
    attempts_count: Optional[int] = None
    hint_used: Optional[bool] = None
    confidence_score: Optional[int] = None
    notes: Optional[str] = None


def _problem_to_dict(p: Problem) -> dict:
    return {
        "id": str(p.id),
        "user_id": str(p.user_id),
        "title": p.title,
        "difficulty": p.difficulty,
        "topic_id": str(p.topic_id) if p.topic_id else None,
        "pattern": p.pattern,
        "company_tags": p.company_tags or [],
        "platform": p.platform,
        "url": p.url,
        "status": p.status,
        "date_attempted": p.date_attempted.isoformat() if p.date_attempted else None,
        "date_solved": p.date_solved.isoformat() if p.date_solved else None,
        "time_taken_minutes": p.time_taken_minutes,
        "attempts_count": p.attempts_count,
        "hint_used": p.hint_used,
        "confidence_score": p.confidence_score,
        "notes": p.notes,
        "created_at": p.created_at.isoformat(),
        "updated_at": p.updated_at.isoformat(),
    }


@router.get("")
def list_problems(
    topic_id: Optional[uuid.UUID] = Query(None),
    difficulty: Optional[str] = Query(None),
    platform: Optional[str] = Query(None),
    problem_status: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Problem).filter(Problem.user_id == current_user.id)
    if topic_id:
        q = q.filter(Problem.topic_id == topic_id)
    if difficulty:
        q = q.filter(Problem.difficulty == difficulty)
    if platform:
        q = q.filter(Problem.platform == platform)
    if problem_status:
        q = q.filter(Problem.status == problem_status)
    if search:
        q = q.filter(Problem.title.ilike(f"%{search}%"))

    total = q.count()
    items = q.order_by(Problem.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": [_problem_to_dict(p) for p in items],
        "total": total,
        "page": page,
        "page_size": page_size,
        "has_more": (page * page_size) < total,
    }


@router.post("", status_code=status.HTTP_201_CREATED)
def create_problem(
    payload: ProblemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    problem = Problem(user_id=current_user.id, **payload.model_dump())
    db.add(problem)
    db.commit()
    db.refresh(problem)

    # Auto-schedule first revision if problem is solved
    if problem.status in ("solved", "mastered"):
        first_revision = Revision(
            user_id=current_user.id,
            problem_id=problem.id,
            due_date=datetime.now(timezone.utc) + timedelta(days=1),
            interval_days=1,
            revision_number=1,
        )
        db.add(first_revision)
        db.commit()

    return _problem_to_dict(problem)


@router.get("/{problem_id}")
def get_problem(
    problem_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    problem = db.query(Problem).filter(
        Problem.id == problem_id, Problem.user_id == current_user.id
    ).first()
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    return _problem_to_dict(problem)


@router.patch("/{problem_id}")
def update_problem(
    problem_id: uuid.UUID,
    payload: ProblemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    problem = db.query(Problem).filter(
        Problem.id == problem_id, Problem.user_id == current_user.id
    ).first()
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    old_status = problem.status
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(problem, field, value)

    # Auto-schedule first revision when status changes to solved/mastered
    newly_solved = problem.status in ("solved", "mastered") and old_status not in ("solved", "mastered")
    if newly_solved:
        existing = db.query(Revision).filter(
            Revision.problem_id == problem.id,
            Revision.completed_at.is_(None),
        ).first()
        if not existing:
            db.add(Revision(
                user_id=current_user.id,
                problem_id=problem.id,
                due_date=datetime.now(timezone.utc) + timedelta(days=1),
                interval_days=1,
                revision_number=1,
            ))

    db.commit()
    db.refresh(problem)
    return _problem_to_dict(problem)


@router.delete("/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_problem(
    problem_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    problem = db.query(Problem).filter(
        Problem.id == problem_id, Problem.user_id == current_user.id
    ).first()
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    db.delete(problem)
    db.commit()
