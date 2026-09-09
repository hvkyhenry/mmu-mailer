from fastapi import APIRouter
from ..services import sheets_service
from ..services.segment import filter_rows
from ..schemas import SegmentRequest

router = APIRouter(prefix="/api/sheet", tags=["sheet"])


@router.get("/columns")
def columns():
    return {"columns": sheets_service.get_columns()}


@router.get("/rows")
def rows():
    return {"rows": sheets_service.get_rows()}


@router.post("/segment")
def segment(req: SegmentRequest):
    rows = sheets_service.get_rows()
    matched = filter_rows(rows, req.filters)
    return {"count": len(matched), "rows": matched}
