import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/main_layout.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const HostelSyncApp());
}

class HostelSyncApp extends StatelessWidget {
  const HostelSyncApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HostelSync',
      theme: AppTheme.darkTheme,
      home: const MainLayout(), // Bypassing login screen for now
      debugShowCheckedModeBanner: false,
    );
  }
}
