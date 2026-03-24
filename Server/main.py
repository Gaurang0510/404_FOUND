from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

from bson import ObjectId
import secrets
import aiosmtplib
from email.message import EmailMessage

SMTP_HOST = "mail.sysnefo.com"
SMTP_PORT = 465
SMTP_USER = "hostelsync@sysnefo.com"
SMTP_PASS = "complexPassword"
FROM_EMAIL = SMTP_USER

app = FastAPI()

SECRET_KEY = "B&w1X9+)NiJaQ3Cbe&1f4x*Ey==,DFy*V=gKbaXmMvawR967&.*XpAS%cTzKmM:R%9P5i9VX2Lv7_%)6*0pN]1x/$G=ng@_!&hJWKa(?*V[Byb?cZX/$uKatyqRWWdZr"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24 * 365 * 10

client = MongoClient("mongodb://localhost:27017/")
db = client["hostel_sync"]
users = db["users"]
join_codes = db["hostel_join_codes"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)

def create_token(user_id, role):
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

class RegisterHosteler(BaseModel):
    name: str
    email: str
    password: str
    hostelId: str
    roomNumber: str
    rollNumber: str


class RegisterWarden(BaseModel):
    name: str
    email: str
    password: str
    hostelId: str

class JoinHostelRequest(BaseModel):
    userId: str
    code: str

class LoginModel(BaseModel):
    email: str
    password: str


@app.post("/register/hosteler")
def register_hosteler(data: RegisterHosteler):

    if users.find_one({"email": data.email}):
        raise HTTPException(400, "Email already registered")

    doc = data.dict()
    doc["role"] = "hosteler"
    doc["password"] = hash_password(data.password)
    doc["createdAt"] = datetime.utcnow()

    result = users.insert_one(doc)

    return {"userId": str(result.inserted_id)}

@app.post("/join-hostel")
def join_hostel(data: JoinHostelRequest):

    user = users.find_one({"_id": ObjectId(data.userId)})

    if not user or user["role"] != "hosteler":
        raise HTTPException(403, "Invalid hosteler")

    code_doc = join_codes.find_one({"_id": data.code})

    if not code_doc or not code_doc["isActive"]:
        raise HTTPException(400, "Invalid code")

    if datetime.utcnow() > code_doc["expiresAt"]:
        raise HTTPException(400, "Code expired")

    # Add hostel to user
    users.update_one(
        {"_id": ObjectId(data.userId)},
        {"$set": {"hostelId": code_doc["hostelId"]}}
    )

    # OPTIONAL: make code single-use
    join_codes.update_one(
        {"_id": data.code},
        {"$set": {"isActive": False}}
    )

    return {
        "message": "Joined hostel successfully 🎉",
        "hostelId": code_doc["hostelId"]
    }

@app.post("/warden/{warden_id}/new-join-code")
def generate_join_code(warden_id: str):

    warden = users.find_one({"_id": ObjectId(warden_id)})

    if not warden or warden["role"] != "warden":
        raise HTTPException(403, "Not a warden")

    hostel_id = warden["hostelId"]

    join_codes.update_many(
        {"hostelId": hostel_id, "isActive": True},
        {"$set": {"isActive": False}}
    )

    code = secrets.token_hex(16).upper() 

    doc = {
        "_id": code,
        "hostelId": hostel_id,
        "createdBy": warden_id,
        "createdAt": datetime.utcnow(),
        "expiresAt": datetime.utcnow() + timedelta(minutes=5),
        "isActive": True
    }

    join_codes.insert_one(doc)

    return {"joinCode": code, "expiresInMinutes": 5}

@app.post("/register/warden")
def register_warden(data: RegisterWarden):

    if users.find_one({"email": data.email}):
        raise HTTPException(400, "Email already registered")

    doc = data.dict()
    doc["role"] = "warden"
    doc["password"] = hash_password(data.password)
    doc["createdAt"] = datetime.utcnow()

    result = users.insert_one(doc)

    return {"userId": str(result.inserted_id)}



@app.post("/login")
def login(data: LoginModel):

    user = users.find_one({"email": data.email})

    if not user:
        raise HTTPException(401, "Invalid credentials")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_token(str(user["_id"]), user["role"])

    return {
        "accessToken": token,
        "userId": str(user["_id"]),
        "role": user["role"],
        "name": user["name"],
        "hostelId": user["hostelId"]
    }
