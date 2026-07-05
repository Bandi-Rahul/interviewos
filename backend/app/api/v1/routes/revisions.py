import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.models import Revision, Problem, User

router = APIRouter(prefix="/revisions", tags=["revisions"])

SPACED_INTERVALS = [1, 3, 7, 14, 30, 90]


def _revision_to_dict(r: Revision) -> dict:
    return {
        "id": str(r.id),
        "user_id": str(r.user_id),
        "problem_id": str(r.problem_id),
        "problem_title": r.problem.title if r.problem else None,
        "problem_difficulty": r.problem.difficulty if r.problem else None,
        "due_date": r.due_date.isoformat(),
        "completed_at": r.completed_at.isoformat() if r.completed_at else None,
        "interval_days": r.interval_days,
        "revision_number": r.revision_number,
        "result": r.result,
        "notes": r.notes,
        "created_at": r.created_at.isoformat(),
        "updated_at": r.updated_at.isoformat(),
    }


def schedule_next_revision(db: Session, revision: Revision, result: str) -> None:
    """Schedule the next revision based on performance."""
    # Poor performance → repeat sooner; good → follow standard intervals
    if result in ("could_not_solve", "needed_hint"):
        next_interval = 1
    else:
        current_idx = SPACED_INTERVALS.index(revision.interval_days) if revision.interval_days in SPACED_INTERVALS else 0
        next_idx = min(current_idx + 1, len(SPACED_INTERVALS) - 1)
        next_interval = SPACED_INTERVALS[next_idx]

    # Don't create if we've reached the last interval and did well
    if revision.interval_days == SPACED_INTERVALS[-1] and result in ("solved_easily", "solved_with_effort"):
        return

    next_revision = Revision(
        user_id=revision.user_id,
        problem_id=revision.problem_id,
        due_date=datetime.now(timezone.utc) + timedelta(days=next_interval),
        interval_days=next_interval,
        revision_number=revision.revision_number + 1,
    )
    db.add(next_revision)


@router.get("")
def list_revisions(
    completed: Optional[bool] = Query(None),
    topic_id: Optional[uuid.UUID] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Revision).filter(Revision.user_id == current_user.id)
    if completed is False:
        q = q.filter(Revision.completed_at.is_(None))
    elif completed is True:
        q = q.filter(Revision.completed_at.isnot(None))

    revisions = q.order_by(Revision.due_date).all()
    return [_revision_to_dict(r) for r in revisions]


class CompleteRevisionPayload(BaseModel):
    result: str
    notes: Optional[str] = None


@router.post("/{revision_id}/complete")
def complete_revision(
    revision_id: uuid.UUID,
    payload: CompleteRevisionPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    revision = db.query(Revision).filter(
        Revision.id == revision_id, Revision.user_id == current_user.id
    ).first()
    if not revision:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Revision not found")

    revision.completed_at = datetime.now(timezone.utc)
    revision.result = payload.result
    if payload.notes:
        revision.notes = payload.notes

    schedule_next_revision(db, revision, payload.result)
    db.commit()
    db.refresh(revision)
    return _revision_to_dict(revision)


class ReschedulePayload(BaseModel):
    due_date: datetime


@router.patch("/{revision_id}/reschedule")
def reschedule_revision(
    revision_id: uuid.UUID,
    payload: ReschedulePayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    revision = db.query(Revision).filter(
        Revision.id == revision_id, Revision.user_id == current_user.id
    ).first()
    if not revision:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Revision not found")

    revision.due_date = payload.due_date
    db.commit()
    db.refresh(revision)
    return _revision_to_dict(revision)
