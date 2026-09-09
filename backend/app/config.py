"""
App configuration, loaded from environment variables (.env).

MOCK_MODE=true lets you build/test the whole app with fake data before
you have Google Cloud credentials or access to the club Gmail account.
Flip it to false once real credentials are in place.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mock_mode: bool = True

    google_client_secret_file: str = "credentials/client_secret.json"
    google_token_file: str = "credentials/token.json"

    # The Google Sheet used as the member data source.
    # Copy the ID out of the sheet's URL:
    # https://docs.google.com/spreadsheets/d/<THIS_PART>/edit
    sheet_id: str = ""
    sheet_range: str = "Sheet1"

    sender_email: str = "mmutechcommunity@mmu.ac.ke"
    sender_name: str = "MMU Tech Community"

    database_url: str = "sqlite:///./mailer.db"

    class Config:
        env_file = ".env"


settings = Settings()
