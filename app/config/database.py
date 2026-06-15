from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

client = MongoClient(
    os.getenv("MONGODB_URL"),
    tlsCAFile=certifi.where()
)

db = client[os.getenv("DATABASE_NAME")]

users_collection = db["users"]
applications_collection = db["applications"]