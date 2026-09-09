from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from .database import Base


class Template(Base):
    """A reusable message 'canvas' — subject + body with {{variable}} placeholders."""

    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    subject = Column(String, nullable=False, default="")
    body = Column(Text, nullable=False, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SendLog(Base):
    """One row per email actually sent. Used for history + duplicate avoidance."""

    __tablename__ = "send_logs"

    id = Column(Integer, primary_key=True, index=True)
    campaign_name = Column(String, nullable=False)
    template_name = Column(String, nullable=True)
    recipient_email = Column(String, index=True, nullable=False)
    recipient_snapshot = Column(JSON, nullable=True)  # the row data at send time
    status = Column(String, default="sent")  # sent | failed
    error = Column(Text, nullable=True)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
