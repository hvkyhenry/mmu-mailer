# MMU Tech Community — Mailer

A local tool for sending segmented, templated emails to club members pulled
live from a Google Sheet, and sent through Gmail. Built for manual, reviewed
sends — you always see who matches before anything goes out.

- **Segment** members by any column in your sheet (status, year, anything)
- **Canvas**: write a subject + body once, with `{{variables}}` pulled from
  your sheet's columns, reusable for welcomes, reminders, event announcements
- **Preview** before sending, using a real row as a stand-in
- **Send log**: re-running a campaign name skips people already emailed
- Runs entirely on your machine — no hosting, no login system

Ships in **mock mode** by default: fake sample members, no real emails sent,
so you can use the whole app immediately and wire in the real sheet + Gmail
account whenever you're ready.

---

## 1. Run it locally (mock mode — works right now)

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```
Backend runs at `http://localhost:8000`.

**Frontend** (separate terminal)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`. You should see sample members, be able to
filter, write a message, preview, and "send" (logged, nothing real goes out).

---

## 2. Connect a real Google Sheet + Gmail account

### a) Create a Google Cloud project (use your own personal Google account)
1. Go to https://console.cloud.google.com/ and create a new project.
2. Under **APIs & Services → Library**, enable:
   - **Google Sheets API**
   - **Gmail API**
3. Under **APIs & Services → OAuth consent screen**:
   - User type: External (unless you have a Workspace org to restrict to)
   - Fill in app name (e.g. "MMU Tech Community Mailer"), your email
   - Scopes: add `https://www.googleapis.com/auth/spreadsheets.readonly`
     and `https://www.googleapis.com/auth/gmail.send`
   - Leave it in **Testing** mode — fine for a handful of users
4. Under **APIs & Services → Credentials**:
   - Create **OAuth client ID** → Application type: **Desktop app**
   - Download the JSON, save it as `backend/credentials/client_secret.json`

### b) Get a one-time authorization token
Run this once (a browser window will open asking you to log in — do this
step logged into the **club's** `mmutechcommunity@mmu.ac.ke` account, not
your personal one, since that's who you want sending mail):

```bash
cd backend
python scripts/authorize_gmail.py
```
This saves `credentials/token.json`, which the app then uses to send as
that account. You never store or type a password anywhere.

> If MMU's Workspace has third-party app restrictions turned on, an admin
> may need to approve the app before this step succeeds. If you hit a
> blocked-app screen, that's what's happening — ask IT/your Workspace admin.

### c) Point the app at your real sheet
In `backend/.env`:
```
MOCK_MODE=false
SHEET_ID=<the long id from your sheet's URL>
SHEET_RANGE=Sheet1
SENDER_EMAIL=mmutechcommunity@mmu.ac.ke
SENDER_NAME=MMU Tech Community
```
Your sheet just needs a header row (e.g. `first_name, last_name, email,
status, year`) — whatever columns you have automatically become available
as `{{variables}}` in the app, no code changes needed.

Restart the backend. You're now sending real email.

---

## Project layout
```
backend/
  app/
    main.py            FastAPI app + routes
    config.py           settings (.env)
    models.py            templates + send log (SQLite)
    services/
      sheets_service.py  reads Google Sheet (or mock data)
      gmail_service.py   sends via Gmail API (or mock)
      segment.py         generic filter + {{variable}} rendering
    routers/              API endpoints
frontend/
  src/
    App.jsx               main page
    components/            segment picker, canvas, templates, log
    api.js                 backend client
```

## Notes
- **Duplicate protection**: sends are logged per `campaign_name`. Re-running
  the same campaign name skips anyone already emailed under it — safe to
  re-run after adding late sign-ups.
- **No login**: this is intentionally single-user/local. If you later want
  other execs to use it from their own laptops, each just runs their own
  copy against the same sheet — the Gmail token is the only part tied to
  the sending account.
- **Templates** are saved locally in `backend/mailer.db` (SQLite) — back
  this file up occasionally if your saved templates matter to you.
