import 'package:flutter/material.dart';
import 'dart:ui';
import 'dashboard_screen.dart';
import 'gatepass_screen.dart';
import 'leave_screen.dart';
import 'vote_screen.dart';
import 'profile_screen.dart';
import '../theme/app_theme.dart';

class MainLayout extends StatefulWidget {
  const MainLayout({Key? key}) : super(key: key);

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const GatePassScreen(),
    const LeaveScreen(),
    const VoteScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      extendBody: true,
      bottomNavigationBar: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (index) => setState(() => _currentIndex = index),
            backgroundColor: AppTheme.background.withOpacity(0.8),
            selectedItemColor: AppTheme.primary,
            unselectedItemColor: AppTheme.onSurfaceVariant,
            type: BottomNavigationBarType.fixed,
            elevation: 0,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.home_outlined),
                activeIcon: Icon(Icons.home),
                label: 'Home',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.door_front_door_outlined),
                activeIcon: Icon(Icons.door_front_door),
                label: 'Passes',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.flight_takeoff_outlined),
                activeIcon: Icon(Icons.flight_takeoff),
                label: 'Leaves',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.how_to_vote_outlined),
                activeIcon: Icon(Icons.how_to_vote),
                label: 'Voting',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_outline),
                activeIcon: Icon(Icons.person),
                label: 'Profile',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
