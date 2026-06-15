from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routes import auth, application, ai
from app.routes import auth, application, ai, user

load_dotenv()

app = FastAPI(title="Job Tracker API-MIKA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(application.router, prefix="/applications", tags=["Applications"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(user.router, prefix="/users", tags=["Users"])

@app.get("/")
def root():
    return {"message": "Job Tracker API Running!"}