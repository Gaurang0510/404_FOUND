from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import datetime

router = APIRouter(prefix="/attendance", tags=["attendance"])

def get_current_user_id():
    return 1

@router.post("/mark", response_model=models.AttendanceStatusResponse)
def mark_attendance(db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    
    # Check if already marked today
    today = datetime.datetime.utcnow().date()
    existing = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.user_id == user_id,
        models.AttendanceRecord.date >= today
    ).first()
    
    if not existing:
        record = models.AttendanceRecord(user_id=user_id, is_present=True)
        db.add(record)
        db.commit()
    
    return get_attendance_status(db)

@router.get("/status", response_model=models.AttendanceStatusResponse)
def get_attendance_status(db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    total = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.user_id == user_id).count()
    present = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.user_id == user_id, models.AttendanceRecord.is_present == True).count()
    pct = (present / total * 100) if total > 0 else 100.0
    return {
        "percentage": round(pct, 1),
        "present": present,
        "total": total
    }
