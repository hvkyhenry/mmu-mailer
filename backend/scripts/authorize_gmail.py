"""
Run this ONCE to authorize the app to send as a Gmail account.

Log into the account you want to send FROM (e.g. mmutechcommunity@mmu.ac.ke)
when the browser window opens. Saves credentials/token.json, which the app
then uses to send — your password is never stored.

Usage:
    python scripts/authorize_gmail.py
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from google_auth_oauthlib.flow import InstalledAppFlow

from app.config import settings

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/gmail.send",
]


def main():
    if not os.path.exists(settings.google_client_secret_file):
        print(
            f"Missing {settings.google_client_secret_file}.\n"
            "Download it from Google Cloud Console → Credentials → your "
            "OAuth client → Download JSON, and save it at that path."
        )
        return

    flow = InstalledAppFlow.from_client_secrets_file(
        settings.google_client_secret_file, SCOPES
    )
    creds = flow.run_local_server(port=0)

    os.makedirs(os.path.dirname(settings.google_token_file), exist_ok=True)
    with open(settings.google_token_file, "w") as f:
        f.write(creds.to_json())

    print(f"Saved {settings.google_token_file}. You're ready to send for real.")


if __name__ == "__main__":
    main()
