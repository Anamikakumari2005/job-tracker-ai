from app.routes.auth import get_current_user
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.application import ApplicationCreate
from app.models.application import (
    create_application,
    get_all_applications,
    get_application_by_id,
    update_application_by_id,
    delete_application_by_id
)

router = APIRouter()

@router.get("/")
def view_application(current_user: dict = Depends(get_current_user)):
    applications = get_all_applications(str(current_user["_id"]))
    return applications


@router.get("/{application_id}")
def get_application(application_id: str, current_user: dict = Depends(get_current_user)):
    application = get_application_by_id(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found!")
    return application

@router.delete("/{application_id}")
def delete_application(application_id: str, current_user: dict = Depends(get_current_user)):
    success = delete_application_by_id( application_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found!")
    return {"message": "Application deleted successfully!"}

@router.put("/{application_id}")
def update_application(application_id: str, application: ApplicationCreate, current_user: dict = Depends(get_current_user)):
    success = update_application_by_id( application_id, application.dict())
    if not success:
        raise HTTPException(status_code=404, detail="Application not found!")
    return {"message": "Application updated successfully!"}

@router.post("/")
def add_application(application: ApplicationCreate, current_user: dict = Depends(get_current_user)):
    data = application.dict()
    data["userId"] = str(current_user["_id"])  # user ki id save karo
    application_id = create_application(data)
    return {"id": application_id}
