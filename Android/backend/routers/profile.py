from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/profile", tags=["profile"])

# Helper to get the current user. For simplicity, we assume user ID 1 exists.
def get_current_user_id():
    return 1

@router.get("/", response_model=models.ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        # Create a mock user if not exists for demo purposes
        user = models.User(
            id=1,
            name="Alex Student",
            room_no="B-402",
            hostel_block="Block B",
            course="B.Tech Computer Science",
            year="3rd Year",
            phone="+1 234 567 8900",
            email="alex@hostelsync.edu"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.put("/update", response_model=models.ProfileResponse)
def update_profile(profile_data: models.ProfileBase, db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in profile_data.dict().items():
        setattr(user, key, value)
        
    db.commit()
    db.refresh(user)
    return user
