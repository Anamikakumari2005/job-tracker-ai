from app.config.database import users_collection
from bson import ObjectId

def create_user(user_data: dict):
    result = users_collection.insert_one(user_data)
    return str(result.inserted_id)

def get_user_by_email(email: str):
    user = users_collection.find_one({"email": email})
    return user

def get_user_by_id(user_id: str):
    user_id = user_id.strip('"')
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    return user

def get_all_users():
    users = users_collection.find()
    return list(users)