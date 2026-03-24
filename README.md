# 404_FOUND
# 🏨 HostelSync – Unified Hostel Operations Platform

A production-ready hostel management system designed to digitize and streamline hostel operations through a centralized platform.

HostelSync connects **students**, **wardens**, and **administrators** using a shared backend API to manage gate passes, leave requests, attendance, complaints, visitor logs, and mess voting in real time.

---

## 📌 Project Structure

The repository follows a **monorepo architecture**, where each major component lives in its own folder.

```
HostelSync/
│
├── Android/      # Flutter mobile application (Student side)
├── Web/          # Warden dashboard web application
├── Server/       # FastAPI backend and database logic
│
└── README.md
```

---

## 🎯 Problem Statement

Most hostels still rely on:

* Paper registers
* Manual approvals
* WhatsApp communication
* Excel tracking

This leads to:

* Lost records
* Delayed approvals
* Poor communication
* Lack of transparency
* Inefficient complaint handling

HostelSync solves these problems by providing a **real-time digital management system**.

---

## 🚀 Core Features

### Student Mobile App (Android / Flutter)

* Profile management
* Gate pass creation
* Leave request submission
* Attendance tracking
* Visitor log management
* Complaint system
* Mess voting system
* Notifications and activity feed

---

### Warden Web Dashboard

* Approve / monitor gate passes
* Track leave requests
* Manage complaints
* Monitor attendance
* View visitor logs
* Analyze mess voting results
* View system activity

---

### Backend (FastAPI)

* REST API services
* Authentication and authorization
* Data validation
* Status management
* Business logic processing
* Database communication

---

## 🧱 System Architecture

```
Student (Flutter App)
        |
        v
      API Server (FastAPI)
        |
        v
       Database
        ^
        |
 Warden (Web Dashboard)
```

All applications communicate through a shared API.

No direct database access from frontend.

---

## 🔗 API Communication Rules

STRICT SYSTEM RULES:

* No hardcoded data
* No mock data
* No frontend approval logic
* All data must come from API
* All status updates handled by backend
* UI updates after API response

HTTP Methods Used:

GET
POST
PUT

---

## 📱 Student Modules

### Profile

* Fetch student information
* Update profile details

API:

GET /profile
PUT /profile/update

---

### Gate Pass

Create gate pass request.

API:

POST /gatepass/create
GET /gatepass/list

Status:

Auto-approved by backend.

---

### Leave Request

Submit leave request.

API:

POST /leave/create
GET /leave/list

Status:

Pending
Approved
Rejected

Status controlled only by backend.

---

### Attendance

Mark attendance and view percentage.

API:

POST /attendance/mark
GET /attendance/status

---

### Visitor Log

Add visitor details.

API:

POST /visitor/create
GET /visitor/list

---

### Complaint System

Submit complaint.

API:

POST /complaint/create
GET /complaint/list

Status:

Open
In Progress
Resolved

---

### Mess Voting

Submit vote for meal selection.

API:

POST /vote
GET /vote/results

---

### Notifications

Display system activity.

API:

GET /notifications

---

## 🖥 Warden Dashboard Modules

Dashboard
Gate Pass Management
Leave Requests
Complaints
Visitor Log
Attendance Monitoring
Mess Voting Results
Notifications

---

## 🧩 Technology Stack

### Frontend – Web

HTML
CSS
JavaScript
Bootstrap / Tailwind

---

### Mobile App – Android

Flutter
Dart

---

### Backend – Server

FastAPI
Python

---

### Database

MySQL
or
PostgreSQL

---

## 📂 Web Folder Structure

```
Web/
│
├── index.html
├── dashboard.html
├── requests.html
├── complaints.html
├── visitors.html
├── attendance.html
│
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
│
└── components/
```

---

## 📂 Server Folder Structure

```
Server/
│
├── app/
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── database/
│   └── main.py
│
├── requirements.txt
└── .env
```

---

## ⚙️ Installation Guide

### Clone Repository

```
git clone https://github.com/your-username/HostelSync.git
```

---

### Run Backend (FastAPI)

```
cd Server
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Server runs at:

```
http://localhost:8000
```

---

### Run Web Dashboard

```
cd Web
open index.html
```

or

```
live-server
```

---

### Run Android App

```
cd Android
flutter pub get
flutter run
```

---

## 🔐 Security Principles

* Backend handles validation
* API-based authentication
* Secure data transmission
* Role-based access control
* No direct database exposure

---

## 📈 Future Enhancements

* Face recognition attendance
* Biometric entry system
* Push notifications
* Payment integration
* AI-based analytics
* Cloud deployment
* CCTV integration

---

## 👨‍💻 Team Roles

Android Developer
Responsible for student mobile application.

Web Developer
Responsible for warden dashboard interface.

Backend Developer
Responsible for FastAPI server and database.

---

## 📜 License

This project is developed for academic, hackathon, and educational purposes.

---

## 🏁 Project Goal

To build a scalable, API-driven hostel management system where:

User Action → API Request → Backend Processing → Database Update → UI Refresh

A complete digital solution for modern hostel management.
