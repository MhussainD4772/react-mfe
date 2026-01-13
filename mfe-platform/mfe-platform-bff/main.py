from fastapi import FastAPI, Header
from typing import Optional, List

app = FastAPI(title="User Activity BFF")

@app.get("/health")
def health():
    return {"status": "ok", "service": "user-activity-bff"}

@app.get("/mfe/activity")
def get_activity(
    x_user_id: Optional[str] = Header(default=None),
    x_roles: Optional[str] = Header(default=None),  
):
    roles: List[str] = []
    if x_roles:
        roles = [r.strip() for r in x_roles.split(",") if r.strip()]

    # Mock response shaped for the MFE UI
    return {
        "userId": x_user_id,
        "roles": roles,
        "items": [
            {"id": "1", "type": "login", "message": "User logged in"},
            {"id": "2", "type": "action", "message": "User clicked a button"},
        ],
    }

