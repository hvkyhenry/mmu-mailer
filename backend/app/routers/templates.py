from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/templates", tags=["templates"])


@router.get("", response_model=list[schemas.TemplateOut])
def list_templates(db: Session = Depends(get_db)):
    return db.query(models.Template).order_by(models.Template.name).all()


@router.post("", response_model=schemas.TemplateOut)
def upsert_template(payload: schemas.TemplateIn, db: Session = Depends(get_db)):
    existing = db.query(models.Template).filter_by(name=payload.name).first()
    if existing:
        existing.subject = payload.subject
        existing.body = payload.body
        db.commit()
        db.refresh(existing)
        return existing

    tmpl = models.Template(**payload.model_dump())
    db.add(tmpl)
    db.commit()
    db.refresh(tmpl)
    return tmpl


@router.delete("/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db)):
    tmpl = db.query(models.Template).get(template_id)
    if not tmpl:
        raise HTTPException(404, "Template not found")
    db.delete(tmpl)
    db.commit()
    return {"ok": True}
