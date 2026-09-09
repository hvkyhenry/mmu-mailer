"""
Fake member rows so the whole app (segments, canvas, preview, send-simulation)
can be built and tested before Google Sheets/Gmail are connected.

Shape mirrors what a real sheet row looks like: a flat dict per person.
Once MOCK_MODE=false, real rows come from Google Sheets instead and will
have whatever columns your actual sheet has — the app doesn't assume any
fixed column set.
"""

MOCK_ROWS = [
    {"first_name": "Amina", "last_name": "Yusuf", "email": "amina@example.com", "status": "paid", "year": "1"},
    {"first_name": "Brian", "last_name": "Otieno", "email": "brian@example.com", "status": "pending", "year": "1"},
    {"first_name": "Cynthia", "last_name": "Mwangi", "email": "cynthia@example.com", "status": "paid", "year": "2"},
    {"first_name": "David", "last_name": "Kiptoo", "email": "david@example.com", "status": "pending", "year": "1"},
    {"first_name": "Esther", "last_name": "Wanjiru", "email": "esther@example.com", "status": "paid", "year": "1"},
    {"first_name": "Felix", "last_name": "Njoroge", "email": "felix@example.com", "status": "pending", "year": "3"},
]
