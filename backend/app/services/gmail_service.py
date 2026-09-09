"""
Sends email through the Gmail API, authenticated as whichever account
completed the OAuth consent flow (see routers/auth.py).

MOCK_MODE=true: nothing is actually sent — calls are logged and returned
as if they succeeded, so you can test the whole send flow safely.
"""
import base64
from email.mime.text import MIMEText

from ..config import settings
import html


def send_email(to: str, subject: str, html_body: str) -> dict:
    if settings.mock_mode:
        print(f"[MOCK SEND] to={to} subject={subject!r}")
        return {"status": "sent", "mock": True}

    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build

    creds = Credentials.from_authorized_user_file(settings.google_token_file)
    service = build("gmail", "v1", credentials=creds)

    escaped = html.escape(html_body)
    formatted_body = f'<div style="white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 14px;">{escaped}</div>'
    message = MIMEText(formatted_body, "html")
    message["to"] = to
    message["from"] = f"{settings.sender_name} <{settings.sender_email}>"
    message["subject"] = subject

    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    sent = service.users().messages().send(userId="me", body={"raw": raw}).execute()
    return {"status": "sent", "id": sent.get("id")}
