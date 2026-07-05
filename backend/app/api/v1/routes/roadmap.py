import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.models import RoadmapTopic, User

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

SEEDED_TOPICS = [
    ("Arrays", "arrays", "easy", 6),
    ("Strings", "strings", "easy", 5),
    ("Hashing", "hashing", "easy", 4),
    ("Linked Lists", "linked-lists", "medium", 5),
    ("Stacks", "stacks", "easy", 4),
    ("Queues", "queues", "easy", 3),
    ("Trees", "trees", "medium", 8),
    ("Binary Search Trees", "bst", "medium", 6),
    ("Heap", "heap", "medium", 5),
    ("Graphs", "graphs", "hard", 12),
    ("Dynamic Programming", "dynamic-programming", "hard", 20),
    ("Greedy", "greedy", "medium", 8),
    ("Backtracking", "backtracking", "medium", 8),
    ("Bit Manipulation", "bit-manipulation", "medium", 4),
    ("Tries", "tries", "hard", 6),
    ("Segment Trees", "segment-trees", "hard", 8),
    ("Advanced Algorithms", "advanced-algorithms", "hard", 15),
]


def _ensure_topics(db: Session) -> None:
    """Seed roadmap topics if they don't exist yet."""
    if db.query(RoadmapTopic).count() == 0:
        for i, (name, slug, difficulty, hours) in enumerate(SEEDED_TOPICS):
            db.add(RoadmapTopic(
                name=name,
                slug=slug,
                difficulty_level=difficulty,
                estimated_hours=hours,
                sort_order=i,
            ))
        db.commit()


def _topic_to_dict(t: RoadmapTopic, completion: int = 0, solved: int = 0) -> dict:
    return {
        "id": str(t.id),
        "name": t.name,
        "slug": t.slug,
        "description": t.description or "",
        "sort_order": t.sort_order,
        "difficulty_level": t.difficulty_level,
        "estimated_hours": t.estimated_hours,
        "completion_percentage": completion,
        "status": "not_started" if solved == 0 else ("completed" if completion >= 100 else "in_progress"),
        "created_at": t.created_at.isoformat(),
        "updated_at": t.updated_at.isoformat(),
    }


@router.get("/topics")
def list_topics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ensure_topics(db)
    from app.models.models import Problem
    from sqlalchemy import func

    topics = db.query(RoadmapTopic).order_by(RoadmapTopic.sort_order).all()

    solved_by_topic = {
        str(row.topic_id): row.count
        for row in db.query(Problem.topic_id, func.count(Problem.id).label("count"))
        .filter(Problem.user_id == current_user.id, Problem.status.in_(["solved", "mastered"]))
        .group_by(Problem.topic_id)
        .all()
        if row.topic_id
    }

    return [_topic_to_dict(t, min(100, solved_by_topic.get(str(t.id), 0) * 10), solved_by_topic.get(str(t.id), 0)) for t in topics]


@router.get("/topics/{topic_id}")
def get_topic(
    topic_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ensure_topics(db)
    topic = db.query(RoadmapTopic).filter(RoadmapTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    return _topic_to_dict(topic)


@router.patch("/topics/{topic_id}/progress")
def update_progress(
    topic_id: uuid.UUID,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    topic = db.query(RoadmapTopic).filter(RoadmapTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    return _topic_to_dict(topic)
