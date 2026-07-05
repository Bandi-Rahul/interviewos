import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.models import Resource, User

router = APIRouter(prefix="/resources", tags=["resources"])


class ResourceCreate(BaseModel):
    title: str
    resource_type: str
    topic_id: Optional[uuid.UUID] = None
    url: str
    description: Optional[str] = None
    source: Optional[str] = None
    estimated_minutes: Optional[int] = None
    status: str = "not_started"
    rating: Optional[int] = None


class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    resource_type: Optional[str] = None
    topic_id: Optional[uuid.UUID] = None
    url: Optional[str] = None
    description: Optional[str] = None
    source: Optional[str] = None
    estimated_minutes: Optional[int] = None
    status: Optional[str] = None
    rating: Optional[int] = None


def _resource_to_dict(r: Resource) -> dict:
    return {
        "id": str(r.id),
        "user_id": str(r.user_id),
        "title": r.title,
        "resource_type": r.resource_type,
        "topic_id": str(r.topic_id) if r.topic_id else None,
        "url": r.url,
        "description": r.description,
        "source": r.source,
        "estimated_minutes": r.estimated_minutes,
        "status": r.status,
        "rating": r.rating,
        "completed_at": r.completed_at.isoformat() if r.completed_at else None,
        "created_at": r.created_at.isoformat(),
        "updated_at": r.updated_at.isoformat(),
    }


@router.get("")
def list_resources(
    topic_id: Optional[uuid.UUID] = Query(None),
    resource_type: Optional[str] = Query(None),
    resource_status: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Resource).filter(Resource.user_id == current_user.id)
    if topic_id:
        q = q.filter(Resource.topic_id == topic_id)
    if resource_type:
        q = q.filter(Resource.resource_type == resource_type)
    if resource_status:
        q = q.filter(Resource.status == resource_status)
    return [_resource_to_dict(r) for r in q.order_by(Resource.created_at.desc()).all()]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_resource(
    payload: ResourceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resource = Resource(user_id=current_user.id, **payload.model_dump())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return _resource_to_dict(resource)


@router.get("/{resource_id}")
def get_resource(
    resource_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    r = db.query(Resource).filter(Resource.id == resource_id, Resource.user_id == current_user.id).first()
    if not r:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return _resource_to_dict(r)


@router.patch("/{resource_id}")
def update_resource(
    resource_id: uuid.UUID,
    payload: ResourceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    r = db.query(Resource).filter(Resource.id == resource_id, Resource.user_id == current_user.id).first()
    if not r:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    updates = payload.model_dump(exclude_unset=True)
    if updates.get("status") == "completed" and not r.completed_at:
        from datetime import datetime, timezone
        updates["completed_at"] = datetime.now(timezone.utc)
    for field, value in updates.items():
        setattr(r, field, value)
    db.commit()
    db.refresh(r)
    return _resource_to_dict(r)


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(
    resource_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    r = db.query(Resource).filter(Resource.id == resource_id, Resource.user_id == current_user.id).first()
    if not r:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    db.delete(r)
    db.commit()
