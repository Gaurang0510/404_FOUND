from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

def get_current_user_id():
    return 1

@router.get("/summary", response_model=models.DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    
    total_leaves = db.query(models.Leave).filter(models.Leave.user_id == user_id, models.Leave.status == "Approved").count()
    pending_leaves = db.query(models.Leave).filter(models.Leave.user_id == user_id, models.Leave.status == "Pending").count()
    active_complaints = db.query(models.Complaint).filter(models.Complaint.user_id == user_id, models.Complaint.status != "Resolved").count()
    
    total_attendance_records = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.user_id == user_id).count()
    present_records = db.query(models.AttendanceRecord).filter(models.AttendanceRecord.user_id == user_id, models.AttendanceRecord.is_present == True).count()
    
    attendance_pct = (present_records / total_attendance_records * 100) if total_attendance_records > 0 else 100.0
    
    return {
        "total_leaves": total_leaves,
        "pending_requests": pending_leaves,
        "attendance_pct": round(attendance_pct, 1),
        "active_complaints": active_complaints
    }
