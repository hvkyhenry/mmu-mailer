from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..services import sheets_service, gmail_service
from ..services.segment import filter_rows, render

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])


@router.post("/preview")
def preview(req: schemas.PreviewRequest):
    return {
        "subject": render(req.subject, req.sample_row),
        "body": render(req.body, req.sample_row),
    }


@router.post("/send")
def send(req: schemas.SendRequest, db: Session = Depends(get_db)):
    rows = sheets_service.get_rows()
    matched = filter_rows(rows, req.filters)

    # skip anyone already sent this exact campaign, so re-running is safe
    already = {
        r.recipient_email
        for r in db.query(models.SendLog)
        .filter_by(campaign_name=req.campaign_name)
        .all()
    }

    results = []
    for row in matched:
        to = row.get(req.email_column, "").strip()
        if not to or to in already:
            continue

        subject = render(req.subject, row)
        body = render(req.body, row)

        try:
            gmail_service.send_email(to, subject, body)
            status, error = "sent", None
        except Exception as e:  # noqa: BLE001
            status, error = "failed", str(e)

        db.add(
            models.SendLog(
                campaign_name=req.campaign_name,
                template_name=req.template_name,
                recipient_email=to,
                recipient_snapshot=row,
                status=status,
                error=error,
            )
        )
        results.append({"email": to, "status": status, "error": error})

    db.commit()
    return {
        "matched": len(matched),
        "skipped_duplicates": len(matched) - len(results),
        "results": results,
    }


@router.get("/logs")
def logs(campaign_name: str | None = None, db: Session = Depends(get_db)):
    q = db.query(models.SendLog)
    if campaign_name:
        q = q.filter_by(campaign_name=campaign_name)
    rows = q.order_by(models.SendLog.sent_at.desc()).limit(500).all()
    return [
        {
            "id": r.id,
            "campaign_name": r.campaign_name,
            "template_name": r.template_name,
            "recipient_email": r.recipient_email,
            "status": r.status,
            "error": r.error,
            "sent_at": r.sent_at.isoformat() if r.sent_at else None,
        }
        for r in rows
    ]
