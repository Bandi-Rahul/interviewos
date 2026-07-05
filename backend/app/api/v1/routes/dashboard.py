from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.models import Problem, Revision, UserProfile, User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    total_solved = db.query(func.count(Problem.id)).filter(
        Problem.user_id == current_user.id,
        Problem.status.in_(["solved", "mastered"]),
    ).scalar() or 0

    difficulty_counts = {
        row.difficulty: row.count
        for row in db.query(Problem.difficulty, func.count(Problem.id).label("count"))
        .filter(Problem.user_id == current_user.id, Problem.status.in_(["solved", "mastered"]))
        .group_by(Problem.difficulty)
        .all()
    }

    from datetime import datetime, timezone
    upcoming_revisions = db.query(func.count(Revision.id)).filter(
        Revision.user_id == current_user.id,
        Revision.completed_at.is_(None),
        Revision.due_date <= datetime.now(timezone.utc),
    ).scalar() or 0

    return {
        "problems_solved": total_solved,
        "easy_solved": difficulty_counts.get("easy", 0),
        "medium_solved": difficulty_counts.get("medium", 0),
        "hard_solved": difficulty_counts.get("hard", 0),
        "current_streak": profile.current_streak if profile else 0,
        "longest_streak": profile.longest_streak if profile else 0,
        "current_xp": profile.current_xp if profile else 0,
        "current_level": profile.current_level if profile else 1,
        "upcoming_revisions_count": upcoming_revisions,
        "weekly_goal_progress": 0,
        "monthly_goal_progress": 0,
        "interview_readiness_score": 0,
        "daily_study_minutes": 0,
        "weak_topics": [],
    }


@router.get("/today")
def get_today_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from datetime import datetime, timezone
    from app.models.models import Revision

    due_revisions = db.query(Revision).filter(
        Revision.user_id == current_user.id,
        Revision.completed_at.is_(None),
        Revision.due_date <= datetime.now(timezone.utc),
    ).limit(5).all()

    tasks = [
        {
            "id": str(r.id),
            "type": "revision",
            "title": f"Revise: {r.problem.title if r.problem else 'Unknown'}",
            "due_date": r.due_date.isoformat(),
            "status": "pending",
        }
        for r in due_revisions
    ]

    return {"tasks": tasks}
