from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime
from pydantic import BaseModel
from typing import List, Optional

# --- SQLAlchemy Models ---

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    room_no = Column(String)
    hostel_block = Column(String)
    course = Column(String)
    year = Column(String)
    phone = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="hosteler") # 'hosteler' or 'warden'
    hostel_id = Column(String)
    roll_number = Column(String)
    
    gatepasses = relationship("GatePass", back_populates="user")
    leaves = relationship("Leave", back_populates="user")
    visitors = relationship("Visitor", back_populates="user")
    complaints = relationship("Complaint", back_populates="user")

class GatePass(Base):
    __tablename__ = "gatepasses"
    id = Column(Integer, primary_key=True, index=True)
    time_out = Column(DateTime)
    time_in = Column(DateTime)
    reason = Column(String)
    status = Column(String, default="Approved")
    pass_token = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="gatepasses")

class Leave(Base):
    __tablename__ = "leaves"
    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    reason = Column(String)
    status = Column(String, default="Pending")
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="leaves")

class Visitor(Base):
    __tablename__ = "visitors"
    id = Column(Integer, primary_key=True, index=True)
    visitor_name = Column(String)
    relation = Column(String)
    entry_time = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="visitors")

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="complaints")

class VoteItem(Base):
    __tablename__ = "vote_items"
    id = Column(Integer, primary_key=True, index=True)
    menu_item = Column(String, unique=True)
    votes = Column(Integer, default=0)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    type = Column(String) # 'gatepass', 'leave', 'complaint', 'visitor'
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class AttendanceRecord(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    is_present = Column(Boolean, default=True)
    user_id = Column(Integer, ForeignKey("users.id"))

# --- Pydantic Schemas ---

class ProfileBase(BaseModel):
    name: str
    room_no: str
    hostel_block: str
    course: str
    year: str
    phone: str
    email: str

class RegisterHosteler(BaseModel):
    name: str
    email: str
    password: str
    hostelId: str
    roomNumber: str
    rollNumber: str

class RegisterWarden(BaseModel):
    name: str
    email: str
    password: str
    hostelId: str

class LoginModel(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    message: str
    user_id: int
    role: str
    name: str

class ProfileResponse(ProfileBase):
    id: int
    class Config:
        from_attributes = True

class GatePassCreate(BaseModel):
    time_out: datetime.datetime
    time_in: datetime.datetime
    reason: str

class GatePassResponse(GatePassCreate):
    id: int
    status: str
    pass_token: str
    class Config:
        from_attributes = True

class LeaveCreate(BaseModel):
    start_date: datetime.datetime
    end_date: datetime.datetime
    reason: str

class LeaveResponse(LeaveCreate):
    id: int
    status: str
    class Config:
        from_attributes = True

class VisitorCreate(BaseModel):
    visitor_name: str
    relation: str

class VisitorResponse(VisitorCreate):
    id: int
    entry_time: datetime.datetime
    class Config:
        from_attributes = True

class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str

class ComplaintResponse(ComplaintCreate):
    id: int
    status: str
    created_at: datetime.datetime
    class Config:
        from_attributes = True

class VoteCreate(BaseModel):
    menu_item: str

class VoteResponse(BaseModel):
    menu_item: str
    votes: int
    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: int
    title: str
    description: str
    type: str
    timestamp: datetime.datetime
    class Config:
        from_attributes = True

class DashboardSummaryResponse(BaseModel):
    total_leaves: int
    pending_requests: int
    attendance_pct: float
    active_complaints: int

class AttendanceStatusResponse(BaseModel):
    percentage: float
    present: int
    total: int
