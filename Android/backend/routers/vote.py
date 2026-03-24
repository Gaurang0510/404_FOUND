from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/vote", tags=["vote"])

# Initialize default menu items if none exist
def init_menu_items(db: Session):
    default_items = ["Paneer Butter Masala", "Chicken Biryani", "Chole Bhature", "Masala Dosa"]
    if db.query(models.VoteItem).count() == 0:
        for item in default_items:
            db.add(models.VoteItem(menu_item=item))
        db.commit()

@router.post("", response_model=models.VoteResponse)
def submit_vote(vote: models.VoteCreate, db: Session = Depends(get_db)):
    init_menu_items(db)
    item = db.query(models.VoteItem).filter(models.VoteItem.menu_item == vote.menu_item).first()
    if item:
        item.votes += 1
    else:
        item = models.VoteItem(menu_item=vote.menu_item, votes=1)
        db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/results", response_model=list[models.VoteResponse])
def get_vote_results(db: Session = Depends(get_db)):
    init_menu_items(db)
    return db.query(models.VoteItem).order_by(models.VoteItem.votes.desc()).all()
