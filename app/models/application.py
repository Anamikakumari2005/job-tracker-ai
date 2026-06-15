from app.config.database import applications_collection
from bson import ObjectId

def application_helper(application) -> dict:
    application["_id"] = str(application["_id"])
    return application

def create_application(application_data: dict):
    result = applications_collection.insert_one(application_data)
    return str(result.inserted_id)

def get_application_by_id(application_id: str):
    application = applications_collection.find_one({"_id": ObjectId(application_id)})
    if application:
        return application_helper(application)
    return None

def delete_application_by_id(application_id: str):
    result = applications_collection.delete_one({"_id": ObjectId(application_id)})
    return result.deleted_count > 0

def update_application_by_id(application_id: str, update_data: dict):
    result = applications_collection.update_one({"_id": ObjectId(application_id)}, {"$set": update_data})
    return result.modified_count > 0

def get_all_applications(user_id: str):
    applications = applications_collection.find({"userId": user_id})
    return [application_helper(app) for app in applications]