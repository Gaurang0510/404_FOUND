# HostelSync Warden Dashboard

A production-ready Warden Dashboard website for the HostelSync hostel management system. This is a fully functional web application built with HTML, CSS, and vanilla JavaScript following clean architecture principles.

## 🎯 Features

- **Dashboard Overview**: Real-time statistics and quick insights
- **Gate Pass Management**: Create, approve, and track gate pass requests
- **Leave Requests**: Manage student leave applications
- **Complaints Management**: Track and resolve student complaints
- **Visitor Management**: Register and manage hostel visitors
- **Attendance Tracking**: Monitor hostel attendance records
- **Mess Voting**: Manage mess vendor voting system
- **Students Directory**: Access all hostel students information
- **Notifications**: System notifications and alerts
- **Profile Management**: Edit warden profile and preferences

## 📁 Project Structure

```
Web/
├── index.html                 # Login page
├── dashboard.html             # Main dashboard
├── requests.html              # Gate pass requests
├── leave.html                 # Leave requests
├── complaints.html            # Complaints management
├── visitors.html              # Visitor management
├── attendance.html            # Attendance tracking
├── voting.html                # Mess voting
├── students.html              # Students directory
├── notifications.html         # Notifications
├── profile.html               # Warden profile
│
├── assets/
│   ├── css/
│   │   └── style.css          # All CSS styling
│   └── js/
│       ├── api_service.js     # Centralized API client
│       ├── dashboard.js       # Dashboard functionality
│       ├── requests.js        # Gate pass requests
│       ├── complaints.js      # Complaints management
│       ├── attendance.js      # Attendance tracking
│       ├── visitors.js        # Visitor management
│       └── voting.js          # Mess voting
│
└── components/
    ├── sidebar.html           # Navigation sidebar
    └── navbar.html            # Top navbar
```

## 🎨 Design System

### Color Palette (Dark Theme)
- **Background**: #0b1325
- **Primary**: #adc6ff (Light Blue)
- **Secondary**: #bac6e9
- **Error**: #ffb4ab (Red)
- **Success**: #2dd882 (Green)
- **Warning**: #e3c193 (Amber)

### Typography
- **Headline Font**: Manrope (Bold, Authoritative)
- **Body Font**: Inter (Clean, Readable)
- **Material Icons**: Material Symbols Outlined

### Design Features
- Glassmorphism effects
- Soft shadows and glows
- Rounded cards (1rem border-radius)
- Gradient buttons
- Backdrop blur effects
- Responsive layout

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API server running on `http://localhost:8000` (configurable)

### Installation

1. **Extract/Setup Files**
   - The project is ready to use from the `/Web` folder
   - No npm installation needed (vanilla JavaScript)

2. **Update API Base URL** (Optional)
   - Open `assets/js/api_service.js`
   - Change `API_BASE_URL` if your backend is on a different server
   ```javascript
   const API_BASE_URL = 'http://localhost:8000'; // Change this line
   ```

3. **Open in Browser**
   - For development: Use a local server
   ```bash
   python -m http.server 8080
   # or
   npx http-server
   # or
   php -S localhost:8080
   ```
   - Open `http://localhost:8080/index.html`

### Demo Login
- **Email**: Any email address
- **Password**: Any password
- The demo uses mock data for testing

## 📡 API Integration

### API Service Module

The `APIService` class provides a centralized way to make all API calls:

```javascript
// Import
<script src="assets/js/api_service.js"></script>

// Use
const data = await APIService.getGatePassList();
```

### Available API Methods

#### Authentication
- `login(credentials)` - Login user
- `logoutAPI()` - Logout
- `refreshToken()` - Refresh auth token

#### Gate Pass Requests
- `createGatePass(data)` - Create new request
- `getGatePassList(params)` - Get all requests
- `getGatePass(id)` - Get specific request
- `approveGatePass(id, data)` - Approve request
- `rejectGatePass(id, data)` - Reject request

#### Leave Requests
- `createLeave(data)` - Create leave request
- `getLeaves(params)` - Get all leaves
- `getLeave(id)` - Get specific leave
- `approveLeave(id, data)` - Approve leave
- `rejectLeave(id, data)` - Reject leave

#### Complaints
- `createComplaint(data)` - Create complaint
- `getComplaints(params)` - Get all complaints
- `getComplaint(id)` - Get specific complaint
- `updateComplainStatus(id, data)` - Update status
- `closeComplaint(id, data)` - Close complaint

#### Attendance
- `markAttendance(data)` - Mark attendance
- `getAttendanceStatus(params)` - Get attendance
- `getAttendanceReport(params)` - Get report

#### Visitors
- `createVisitor(data)` - Register visitor
- `getVisitors(params)` - Get all visitors
- `getVisitor(id)` - Get specific visitor
- `checkoutVisitor(id, data)` - Check out visitor

#### Mess Voting
- `vote(data)` - Cast a vote
- `getVotingResults(params)` - Get voting results
- `getVotingStatus(studentId)` - Get voting status

#### Dashboard
- `getDashboardSummary()` - Get dashboard stats
- `getHostelStats(params)` - Get hostel statistics

#### Notifications
- `getNotifications(params)` - Get notifications
- `markNotificationRead(id)` - Mark as read
- `markAllNotificationsRead()` - Mark all as read

### Authentication

The API service automatically manages authentication tokens:

```javascript
// Token is automatically saved after login
const response = await APIService.login({
  email: 'warden@hostel.edu',
  password: 'password123'
});

// Token is automatically sent in all requests
// Stored in localStorage as 'authToken'
```

## 🔧 Configuration

### API Base URL
Edit `assets/js/api_service.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

### Storage
- Authentication tokens are stored in `localStorage`
- User data stored as `userData` in localStorage

### Responsive Design
The dashboard is responsive and works on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (320px+)

## 💻 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📋 Component Documentation

### Sidebar Navigation
- Sticky left sidebar
- 8 main navigation items
- Logout button
- Active item highlighting

### Top Navbar
- Breadcrumb navigation
- Quick action buttons
- Warden profile info
- Notification icons

### Cards
- Glassmorphic design
- Hover effects
- Status badges
- Action buttons

## 🎯 Customization

### Adding New Pages

1. Create HTML file in `/Web` directory
2. Include sidebar and navbar:
```html
<div id="sidebar-container"></div>
<div id="navbar-container"></div>

<script>
  document.addEventListener('DOMContentLoaded', async () => {
    const sidebarRes = await fetch('components/sidebar.html');
    document.getElementById('sidebar-container').innerHTML = await sidebarRes.text();
    
    const navbarRes = await fetch('components/navbar.html');
    document.getElementById('navbar-container').innerHTML = await navbarRes.text();
  });
</script>
```

3. Add navigation menu item in `components/sidebar.html`
4. Create JavaScript module in `assets/js/`

### Modifying Colors

Edit CSS variables in `assets/css/style.css`:
```css
:root {
  --color-primary: #adc6ff;
  --color-secondary: #bac6e9;
  --color-error: #ffb4ab;
  /* ... other colors */
}
```

### Custom Styling

Add custom styles at the end of `assets/css/style.css` or create new stylesheet:
```css
.custom-class {
  background: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

## ⚙️ Backend API Requirements

### Expected API Endpoints

Your backend should implement these endpoints:

#### Gate Pass Requests
- `GET /api/gate-pass` - List all gate passes
- `POST /api/gate-pass` - Create new gate pass
- `PUT /api/gate-pass/:id/approve` - Approve
- `PUT /api/gate-pass/:id/reject` - Reject

#### Leave Requests
- `GET /api/leave` - List leaves
- `POST /api/leave` - Create leave
- `PUT /api/leave/:id/approve` - Approve
- `PUT /api/leave/:id/reject` - Reject

#### Other Endpoints
Similarly implement for:
- `/api/complaint`
- `/api/visitor`
- `/api/attendance`
- `/api/vote`
- `/api/notification`
- `/api/student`
- `/api/dashboard/summary`
- `/api/auth/login`
- `/api/profile`

### Response Format

Expected response format:
```json
{
  "status": "success",
  "data": [ /* or {} */ ],
  "message": "Optional message"
}
```

### Authentication

Send token in header:
```
Authorization: Bearer <token>
```

## 🐛 Debugging

### Console Logs
All API calls log to browser console. Open DevTools (F12) to see:
- API request details
- Error messages
- Response data

### Local Storage
View stored data:
```javascript
console.log(localStorage.getItem('authToken'));
console.log(JSON.parse(localStorage.getItem('userData')));
```

## 📝 Best Practices

1. **Always load components before initializing page**
   - Load sidebar and navbar first
   - Then initialize page-specific JavaScript

2. **Use APIService for all requests**
   - Don't make fetch calls directly
   - Centralized error handling

3. **Handle errors gracefully**
   - Show user-friendly error messages
   - Log errors to console for debugging

4. **Respect authentication**
   - Check token before loading page
   - Redirect to login if unauthorized

## 🚦 Demo Data

The application uses mock data for demonstration. To use real data:

1. Ensure backend API is running
2. Update `API_BASE_URL` in `api_service.js`
3. Remove mock data code from JavaScript modules
4. Implement actual API calls

## 📄 License

This project is part of the HostelSync hostel management system.

## 👥 Support

For issues or questions:
1. Check browser console for error messages
2. Verify backend API is running
3. Check API endpoint URLs
4. Review API response format

---

**Version**: 1.0.0  
**Last Updated**: March 2024  
**Built with**: HTML5, CSS3, Vanilla JavaScript
