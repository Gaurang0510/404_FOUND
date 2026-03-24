from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import uuid

router = APIRouter(prefix="/gatepass", tags=["gatepass"])

def get_current_user_id():
    return 1

@router.post("/create", response_model=models.GatePassResponse)
def create_gatepass(gatepass: models.GatePassCreate, db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    
    # Auto-approve logic
    pass_token = f"HS-PASS-{str(uuid.uuid4())[:8].upper()}"
    
    db_gatepass = models.GatePass(
        **gatepass.dict(),
        user_id=user_id,
        status="Approved",
        pass_token=pass_token
    )
    db.add(db_gatepass)
    db.commit()
    db.refresh(db_gatepass)
    
    # Add activity notification
    notification = models.Notification(
        title="Gatepass Approved",
        description=f"Pass {pass_token} generated.",
        type="gatepass"
    )
    db.add(notification)
    db.commit()
    
    return db_gatepass

@router.get("/list", response_model=list[models.GatePassResponse])
def list_gatepasses(db: Session = Depends(get_db)):
    user_id = get_current_user_id()
    return db.query(models.GatePass).filter(models.GatePass.user_id == user_id).order_by(models.GatePass.id.desc()).all()
