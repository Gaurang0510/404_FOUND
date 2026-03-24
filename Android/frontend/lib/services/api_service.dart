import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/models.dart';

import 'package:flutter/foundation.dart'; // For kIsWeb

class ApiService {
  static const String baseUrl = kIsWeb ? 'http://localhost:8000' : 'http://10.197.192.17:8000'; // IP required for Emulator / Web
  static int? currentUserId = 1; // Default mock user ID since login is bypassed
  static String? currentUserRole = 'hosteler'; // Default mock role

  // --- Auth ---
  static Future<AuthResponse> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password}),
    );
    if (response.statusCode == 200) {
      final res = AuthResponse.fromJson(json.decode(response.body));
      currentUserId = res.userId;
      currentUserRole = res.role;
      return res;
    } else {
      throw Exception('Login failed: ${json.decode(response.body)['detail']}');
    }
  }

  static Future<AuthResponse> registerHosteler(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register/hosteler'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      final res = AuthResponse.fromJson(json.decode(response.body));
      currentUserId = res.userId;
      currentUserRole = res.role;
      return res;
    } else {
      throw Exception('Registration failed: ${json.decode(response.body)['detail']}');
    }
  }

  static Future<AuthResponse> registerWarden(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register/warden'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      final res = AuthResponse.fromJson(json.decode(response.body));
      currentUserId = res.userId;
      currentUserRole = res.role;
      return res;
    } else {
      throw Exception('Registration failed: ${json.decode(response.body)['detail']}');
    }
  }

  // --- Profile ---
  static Future<Profile> getStudentProfile() async {
    final response = await http.get(Uri.parse('$baseUrl/profile'));
    if (response.statusCode == 200) {
      return Profile.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load profile');
    }
  }

  static Future<Profile> updateProfile(Map<String, dynamic> data) async {
    final response = await http.put(
      Uri.parse('$baseUrl/profile/update'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return Profile.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to update profile');
    }
  }

  // --- Dashboard ---
  static Future<DashboardSummary> getDashboardSummary() async {
    final response = await http.get(Uri.parse('$baseUrl/dashboard/summary'));
    if (response.statusCode == 200) {
      return DashboardSummary.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load dashboard summary');
    }
  }

  // --- Gate Pass ---
  static Future<GatePass> createGatePass(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/gatepass/create'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return GatePass.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to create gate pass');
    }
  }

  static Future<List<GatePass>> getGatePasses() async {
    final response = await http.get(Uri.parse('$baseUrl/gatepass/list'));
    if (response.statusCode == 200) {
      Iterable l = json.decode(response.body);
      return List<GatePass>.from(l.map((model) => GatePass.fromJson(model)));
    } else {
      throw Exception('Failed to load gate passes');
    }
  }

  // --- Leave ---
  static Future<Leave> createLeave(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/leave/create'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return Leave.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to create leave request');
    }
  }

  static Future<List<Leave>> getLeaves() async {
    final response = await http.get(Uri.parse('$baseUrl/leave/list'));
    if (response.statusCode == 200) {
      Iterable l = json.decode(response.body);
      return List<Leave>.from(l.map((model) => Leave.fromJson(model)));
    } else {
      throw Exception('Failed to load leaves');
    }
  }

  // --- Attendance ---
  static Future<AttendanceStatus> markAttendance() async {
    final response = await http.post(Uri.parse('$baseUrl/attendance/mark'));
    if (response.statusCode == 200) {
      return AttendanceStatus.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to mark attendance');
    }
  }

  static Future<AttendanceStatus> getAttendanceStatus() async {
    final response = await http.get(Uri.parse('$baseUrl/attendance/status'));
    if (response.statusCode == 200) {
      return AttendanceStatus.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load attendance status');
    }
  }

  // --- Visitor ---
  static Future<Visitor> createVisitor(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/visitor/create'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return Visitor.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to register visitor');
    }
  }

  static Future<List<Visitor>> getVisitors() async {
    final response = await http.get(Uri.parse('$baseUrl/visitor/list'));
    if (response.statusCode == 200) {
      Iterable l = json.decode(response.body);
      return List<Visitor>.from(l.map((model) => Visitor.fromJson(model)));
    } else {
      throw Exception('Failed to load visitors');
    }
  }

  // --- Complaint ---
  static Future<Complaint> createComplaint(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/complaint/create'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return Complaint.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to log complaint');
    }
  }

  static Future<List<Complaint>> getComplaints() async {
    final response = await http.get(Uri.parse('$baseUrl/complaint/list'));
    if (response.statusCode == 200) {
      Iterable l = json.decode(response.body);
      return List<Complaint>.from(l.map((model) => Complaint.fromJson(model)));
    } else {
      throw Exception('Failed to load complaints');
    }
  }

  // --- Vote ---
  static Future<VoteItem> submitVote(String menuItem) async {
    final response = await http.post(
      Uri.parse('$baseUrl/vote'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'menu_item': menuItem}),
    );
    if (response.statusCode == 200) {
      return VoteItem.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to submit vote');
    }
  }

  static Future<List<VoteItem>> getVoteResults() async {
    final response = await http.get(Uri.parse('$baseUrl/vote/results'));
    if (response.statusCode == 200) {
      Iterable l = json.decode(response.body);
      return List<VoteItem>.from(l.map((model) => VoteItem.fromJson(model)));
    } else {
      throw Exception('Failed to load vote results');
    }
  }

  // --- Notifications ---
  static Future<List<NotificationItem>> getNotifications() async {
    final response = await http.get(Uri.parse('$baseUrl/notifications/list'));
    if (response.statusCode == 200) {
      Iterable l = json.decode(response.body);
      return List<NotificationItem>.from(l.map((model) => NotificationItem.fromJson(model)));
    } else {
      throw Exception('Failed to load notifications');
    }
  }
}
