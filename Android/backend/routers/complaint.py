from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/complaint", tags=["complaint"])

def get_current_user_id():
    return 1

@router.post("/create", response_model=models.ComplaintResponse)
def create_complaint(complaint: models.ComplaintCreate, db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    db_complaint = models.Complaint(**complaint.dict(), user_id=user_id, status="Open")
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    
    notification = models.Notification(
        title="Complaint Logged",
        description=f"Ticket created for {complaint.category}.",
        type="complaint"
    )
    db.add(notification)
    db.commit()
    
    return db_complaint

@router.get("/list", response_model=list[models.ComplaintResponse])
def list_complaints(db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    return db.query(models.Complaint).filter(models.Complaint.user_id == user_id).order_by(models.Complaint.id.desc()).all()
