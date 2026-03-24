from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models
from database import get_db
import hashlib

router = APIRouter()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/register/hosteler", response_model=models.AuthResponse)
def register_hosteler(data: models.RegisterHosteler, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        hostel_id=data.hostelId,
        room_no=data.roomNumber,
        roll_number=data.rollNumber,
        role="hosteler"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Hosteler registered successfully", "user_id": new_user.id, "role": new_user.role, "name": new_user.name}

@router.post("/register/warden", response_model=models.AuthResponse)
def register_warden(data: models.RegisterWarden, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        hostel_id=data.hostelId,
        role="warden"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Warden registered successfully", "user_id": new_user.id, "role": new_user.role, "name": new_user.name}

@router.post("/login", response_model=models.AuthResponse)
def login(data: models.LoginModel, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or user.password_hash != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"message": "Login successful", "user_id": user.id, "role": user.role, "name": user.name}
