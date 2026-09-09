"""
Reads member data from a Google Sheet, live, on every call — no local copy.
Column-agnostic: whatever headers are in row 1 become the dict keys.
Falls back to mock data while MOCK_MODE=true so you can build the UI first.
"""
from ..config import settings
from .mock_data import MOCK_ROWS


def get_rows() -> list[dict]:
    if settings.mock_mode:
        return MOCK_ROWS

    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build

    creds = Credentials.from_authorized_user_file(settings.google_token_file)
    service = build("sheets", "v4", credentials=creds)

    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=settings.sheet_id, range=settings.sheet_range)
        .execute()
    )
    values = result.get("values", [])
    if not values:
        return []

    headers = [h.strip() for h in values[0]]
    rows = []
    for raw_row in values[1:]:
        # pad short rows so ragged sheets don't crash the mapping
        padded = raw_row + [""] * (len(headers) - len(raw_row))
        rows.append(dict(zip(headers, padded)))
    return rows


def get_columns() -> list[str]:
    rows = get_rows()
    return list(rows[0].keys()) if rows else []
