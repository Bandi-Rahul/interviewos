from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.models import Problem, User

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview")
def get_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    solved_filter = Problem.status.in_(["solved", "mastered"])

    total = db.query(func.count(Problem.id)).filter(
        Problem.user_id == current_user.id, solved_filter
    ).scalar() or 0

    difficulty_rows = (
        db.query(Problem.difficulty, func.count(Problem.id).label("count"))
        .filter(Problem.user_id == current_user.id, solved_filter)
        .group_by(Problem.difficulty)
        .all()
    )
    counts = {row.difficulty: row.count for row in difficulty_rows}

    avg_time = db.query(func.avg(Problem.time_taken_minutes)).filter(
        Problem.user_id == current_user.id,
        Problem.time_taken_minutes.isnot(None),
        solved_filter,
    ).scalar()

    hint_count = db.query(func.count(Problem.id)).filter(
        Problem.user_id == current_user.id,
        Problem.hint_used.is_(True),
        solved_filter,
    ).scalar() or 0

    return {
        "total_problems_solved": total,
        "easy_solved": counts.get("easy", 0),
        "medium_solved": counts.get("medium", 0),
        "hard_solved": counts.get("hard", 0),
        "avg_solve_time_minutes": round(avg_time, 1) if avg_time else None,
        "hint_usage_rate": round(hint_count / total, 2) if total else 0,
        "revision_success_rate": 0,
        "consistency_score": 0,
        "topics_completed": 0,
        "total_topics": 0,
    }
