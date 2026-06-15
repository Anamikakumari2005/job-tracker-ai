from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import UserSignup, UserLogin, UserResponse
from app.models.user import create_user, get_user_by_email
from datetime import datetime, timedelta
from jose import jwt
import bcrypt
import os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.models.user import get_user_by_id

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

def hash_password(password: str):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
def signup(user: UserSignup):
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered!")
    
    hashed_pw = hash_password(user.password)
    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pw,
        "resumeSummary": "",
        "skills": [],
        "createdAt": datetime.utcnow()
    }
    user_id = create_user(user_data)
    token = create_token({"sub": user_id})
    return {"token": token, "message": "Signup successful!"}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    existing_user = get_user_by_email(form_data.username)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found!")
    
    if not verify_password(form_data.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Wrong password!")
    
    token = create_token({"sub": str(existing_user["_id"])})
    return {"access_token": token, "token_type": "bearer"}


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        return user_id
    except:
        raise HTTPException(status_code=401, detail="Invalid token!")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    user_id = verify_token(token)
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found!")
    return user    

def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required!")
    return current_user