from fastapi import APIRouter, Depends, HTTPException
from app.routes.auth import get_current_user, get_admin_user
from app.models.user import get_all_users, get_user_by_id
from bson import ObjectId

router = APIRouter()

# User apna profile dekhe
@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])
    current_user.pop("password", None)
    return current_user

# User apna profile update kare
@router.put("/profile")
def update_profile(data: dict, current_user: dict = Depends(get_current_user)):
    from app.config.database import users_collection
    users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {
            "name": data.get("name", current_user["name"]),
            "resumeSummary": data.get("resumeSummary", ""),
            "skills": data.get("skills", [])
        }}
    )
    return {"message": "Profile updated!"}

# Admin — sab users dekhe
@router.get("/all")
def get_users(admin: dict = Depends(get_admin_user)):
    users = get_all_users()
    for user in users:
        user["_id"] = str(user["_id"])
        user.pop("password", None)
    return users