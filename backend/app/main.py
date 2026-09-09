from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import sheets, templates, campaigns
from .config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MMU Tech Community Mailer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sheets.router)
app.include_router(templates.router)
app.include_router(campaigns.router)


@app.get("/api/health")
def health():
    return {"ok": True, "mock_mode": settings.mock_mode}
