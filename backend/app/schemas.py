from typing import Any, Optional
from pydantic import BaseModel


class Filter(BaseModel):
    column: str
    op: str = "equals"  # equals | not_equals | contains | not_empty | empty
    value: Optional[str] = None


class SegmentRequest(BaseModel):
    filters: list[Filter] = []


class TemplateIn(BaseModel):
    name: str
    subject: str
    body: str


class TemplateOut(TemplateIn):
    id: int

    class Config:
        from_attributes = True


class PreviewRequest(BaseModel):
    subject: str
    body: str
    sample_row: dict[str, Any]


class SendRequest(BaseModel):
    campaign_name: str
    template_name: Optional[str] = None
    subject: str
    body: str
    filters: list[Filter] = []
    email_column: str = "email"
