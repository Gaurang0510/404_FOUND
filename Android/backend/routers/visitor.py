from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/visitor", tags=["visitor"])

def get_current_user_id():
    return 1

@router.post("/create", response_model=models.VisitorResponse)
def create_visitor(visitor: models.VisitorCreate, db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    db_visitor = models.Visitor(**visitor.dict(), user_id=user_id)
    db.add(db_visitor)
    db.commit()
    db.refresh(db_visitor)
    
    notification = models.Notification(
        title="Visitor Logged",
        description=f"{visitor.visitor_name} ({visitor.relation}) at the gate.",
        type="visitor"
    )
    db.add(notification)
    db.commit()
    
    return db_visitor

@router.get("/list", response_model=list[models.VisitorResponse])
def list_visitors(db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    return db.query(models.Visitor).filter(models.Visitor.user_id == user_id).order_by(models.Visitor.id.desc()).all()
