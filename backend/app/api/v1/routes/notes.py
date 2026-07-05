import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models.models import Note, User

router = APIRouter(prefix="/notes", tags=["notes"])


class NoteCreate(BaseModel):
    title: str
    topic_id: Optional[uuid.UUID] = None
    tags: list[str] = []
    content_markdown: str = ""


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    topic_id: Optional[uuid.UUID] = None
    tags: Optional[list[str]] = None
    content_markdown: Optional[str] = None


def _note_to_dict(n: Note) -> dict:
    return {
        "id": str(n.id),
        "user_id": str(n.user_id),
        "title": n.title,
        "topic_id": str(n.topic_id) if n.topic_id else None,
        "tags": n.tags or [],
        "content_markdown": n.content_markdown,
        "created_at": n.created_at.isoformat(),
        "updated_at": n.updated_at.isoformat(),
    }


@router.get("")
def list_notes(
    topic_id: Optional[uuid.UUID] = Query(None),
    tag: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Note).filter(Note.user_id == current_user.id)
    if topic_id:
        q = q.filter(Note.topic_id == topic_id)
    if search:
        q = q.filter(Note.title.ilike(f"%{search}%"))
    return [_note_to_dict(n) for n in q.order_by(Note.updated_at.desc()).all()]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_note(
    payload: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = Note(user_id=current_user.id, **payload.model_dump())
    db.add(note)
    db.commit()
    db.refresh(note)
    return _note_to_dict(note)


@router.get("/{note_id}")
def get_note(
    note_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return _note_to_dict(note)


@router.patch("/{note_id}")
def update_note(
    note_id: uuid.UUID,
    payload: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    return _note_to_dict(note)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    db.delete(note)
    db.commit()
