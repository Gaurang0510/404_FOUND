from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database
import models
from routers import profile, gatepass, leave, attendance, visitor, complaint, vote, notifications, dashboard, auth

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="HostelSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(gatepass.router)
app.include_router(leave.router)
app.include_router(attendance.router)
app.include_router(visitor.router)
app.include_router(complaint.router)
app.include_router(vote.router)
app.include_router(notifications.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to HostelSync API"}
