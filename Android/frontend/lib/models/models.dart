class Profile {
  final int id;
  final String name;
  final String roomNo;
  final String hostelBlock;
  final String course;
  final String year;
  final String phone;
  final String email;

  Profile({
    required this.id,
    required this.name,
    required this.roomNo,
    required this.hostelBlock,
    required this.course,
    required this.year,
    required this.phone,
    required this.email,
  });

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      id: json['id'],
      name: json['name'],
      roomNo: json['room_no'],
      hostelBlock: json['hostel_block'],
      course: json['course'],
      year: json['year'],
      phone: json['phone'],
      email: json['email'],
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'room_no': roomNo,
        'hostel_block': hostelBlock,
        'course': course,
        'year': year,
        'phone': phone,
        'email': email,
      };
}

class AuthResponse {
  final String message;
  final int userId;
  final String role;
  final String name;

  AuthResponse({
    required this.message,
    required this.userId,
    required this.role,
    required this.name,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      message: json['message'],
      userId: json['user_id'],
      role: json['role'],
      name: json['name'],
    );
  }
}


class GatePass {
  final int id;
  final DateTime timeOut;
  final DateTime timeIn;
  final String reason;
  final String status;
  final String passToken;

  GatePass({
    required this.id,
    required this.timeOut,
    required this.timeIn,
    required this.reason,
    required this.status,
    required this.passToken,
  });

  factory GatePass.fromJson(Map<String, dynamic> json) {
    return GatePass(
      id: json['id'],
      timeOut: DateTime.parse(json['time_out']),
      timeIn: DateTime.parse(json['time_in']),
      reason: json['reason'],
      status: json['status'],
      passToken: json['pass_token'],
    );
  }
}

class Leave {
  final int id;
  final DateTime startDate;
  final DateTime endDate;
  final String reason;
  final String status;

  Leave({
    required this.id,
    required this.startDate,
    required this.endDate,
    required this.reason,
    required this.status,
  });

  factory Leave.fromJson(Map<String, dynamic> json) {
    return Leave(
      id: json['id'],
      startDate: DateTime.parse(json['start_date']),
      endDate: DateTime.parse(json['end_date']),
      reason: json['reason'],
      status: json['status'],
    );
  }
}

class Visitor {
  final int id;
  final String visitorName;
  final String relation;
  final DateTime entryTime;

  Visitor({
    required this.id,
    required this.visitorName,
    required this.relation,
    required this.entryTime,
  });

  factory Visitor.fromJson(Map<String, dynamic> json) {
    return Visitor(
      id: json['id'],
      visitorName: json['visitor_name'],
      relation: json['relation'],
      entryTime: DateTime.parse(json['entry_time']),
    );
  }
}

class Complaint {
  final int id;
  final String title;
  final String description;
  final String category;
  final String status;
  final DateTime createdAt;

  Complaint({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.status,
    required this.createdAt,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      category: json['category'],
      status: json['status'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}

class VoteItem {
  final String menuItem;
  final int votes;

  VoteItem({
    required this.menuItem,
    required this.votes,
  });

  factory VoteItem.fromJson(Map<String, dynamic> json) {
    return VoteItem(
      menuItem: json['menu_item'],
      votes: json['votes'],
    );
  }
}

class NotificationItem {
  final int id;
  final String title;
  final String description;
  final String type;
  final DateTime timestamp;

  NotificationItem({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.timestamp,
  });

  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    return NotificationItem(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      type: json['type'],
      timestamp: DateTime.parse(json['timestamp']),
    );
  }
}

class DashboardSummary {
  final int totalLeaves;
  final int pendingRequests;
  final double attendancePct;
  final int activeComplaints;

  DashboardSummary({
    required this.totalLeaves,
    required this.pendingRequests,
    required this.attendancePct,
    required this.activeComplaints,
  });

  factory DashboardSummary.fromJson(Map<String, dynamic> json) {
    return DashboardSummary(
      totalLeaves: json['total_leaves'] ?? 0,
      pendingRequests: json['pending_requests'] ?? 0,
      attendancePct: (json['attendance_pct'] ?? 0.0).toDouble(),
      activeComplaints: json['active_complaints'] ?? 0,
    );
  }
}

class AttendanceStatus {
  final double percentage;
  final int present;
  final int total;

  AttendanceStatus({
    required this.percentage,
    required this.present,
    required this.total,
  });

  factory AttendanceStatus.fromJson(Map<String, dynamic> json) {
    return AttendanceStatus(
      percentage: (json['percentage'] ?? 0.0).toDouble(),
      present: json['present'] ?? 0,
      total: json['total'] ?? 0,
    );
  }
}
