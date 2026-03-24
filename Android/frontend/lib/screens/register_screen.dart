import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../services/api_service.dart';
import 'main_layout.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  bool _isWarden = false;
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _hostelIdController = TextEditingController();
  final _roomNumberController = TextEditingController();
  final _rollNumberController = TextEditingController();
  bool _isLoading = false;

  Future<void> _register() async {
    if (_nameController.text.isEmpty || _emailController.text.isEmpty || _passwordController.text.isEmpty || _hostelIdController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all required fields')));
      return;
    }
    
    if (!_isWarden && (_roomNumberController.text.isEmpty || _rollNumberController.text.isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Hostelers must provide Room and Roll Numbers')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      if (_isWarden) {
        await ApiService.registerWarden({
          'name': _nameController.text,
          'email': _emailController.text,
          'password': _passwordController.text,
          'hostelId': _hostelIdController.text,
        });
      } else {
        await ApiService.registerHosteler({
          'name': _nameController.text,
          'email': _emailController.text,
          'password': _passwordController.text,
          'hostelId': _hostelIdController.text,
          'roomNumber': _roomNumberController.text,
          'rollNumber': _rollNumberController.text,
        });
      }
      
      if (mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const MainLayout()), 
          (route) => false
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Account'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('Hosteler'),
                Switch(
                  value: _isWarden,
                  onChanged: (val) => setState(() => _isWarden = val),
                  activeColor: AppTheme.primary,
                ),
                const Text('Warden'),
              ],
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Full Name'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email Address'),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _hostelIdController,
              decoration: const InputDecoration(labelText: 'Hostel ID Block (e.g. Block A)'),
            ),
            if (!_isWarden) ...[
              const SizedBox(height: 16),
              TextField(
                controller: _roomNumberController,
                decoration: const InputDecoration(labelText: 'Room Number (e.g. 101)'),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _rollNumberController,
                decoration: const InputDecoration(labelText: 'Roll Number / Student ID'),
              ),
            ],
            const SizedBox(height: 48),
            SizedBox(
              height: 56,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _register,
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Register', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
