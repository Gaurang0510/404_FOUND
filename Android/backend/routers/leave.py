from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/leave", tags=["leave"])

def get_current_user_id():
    return 1

@router.post("/create", response_model=models.LeaveResponse)
def create_leave(leave: models.LeaveCreate, db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    
    db_leave = models.Leave(
        **leave.dict(),
        user_id=user_id,
        status="Pending" # Default to pending, API-controlled only
    )
    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    
    notification = models.Notification(
        title="Leave Request Submitted",
        description=f"Awaiting warden approval for {leave.start_date.strftime('%b %d')}.",
        type="leave"
    )
    db.add(notification)
    db.commit()
    
    return db_leave

@router.get("/list", response_model=list[models.LeaveResponse])
def list_leaves(db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    return db.query(models.Leave).filter(models.Leave.user_id == user_id).order_by(models.Leave.id.desc()).all()
