from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/list", response_model=list[models.NotificationResponse])
def list_notifications(db: Session = Depends(get_db)):
    return db.query(models.Notification).order_by(models.Notification.id.desc()).limit(20).all()
