import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Future<Profile> _profileFuture;
  bool _isEditing = false;
  bool _isLoading = false;
  
  // Controllers
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _roomController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  void _fetchProfile() {
    setState(() {
      _profileFuture = ApiService.getStudentProfile().then((profile) {
        _phoneController.text = profile.phone;
        _emailController.text = profile.email;
        _roomController.text = profile.roomNo;
        return profile;
      });
    });
  }

  Future<void> _saveProfile(Profile profile) async {
    setState(() => _isLoading = true);
    try {
      final updatedData = profile.toJson();
      updatedData['phone'] = _phoneController.text;
      updatedData['email'] = _emailController.text;
      updatedData['room_no'] = _roomController.text;
      
      await ApiService.updateProfile(updatedData);
      
      setState(() {
        _isEditing = false;
      });
      _fetchProfile();
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully'), backgroundColor: AppTheme.secondary),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppTheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: Icon(_isEditing ? Icons.close : Icons.edit),
            onPressed: () {
              setState(() => _isEditing = !_isEditing);
              if (!_isEditing) _fetchProfile(); // Reset fields
            },
          )
        ],
      ),
      body: FutureBuilder<Profile>(
        future: _profileFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) return const Center(child: Text('Error loading profile'));
          
          final profile = snapshot.data!;
          return SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                const CircleAvatar(
                  radius: 50,
                  backgroundColor: AppTheme.primary,
                  child: Icon(Icons.person, size: 50, color: AppTheme.background),
                ),
                const SizedBox(height: 16),
                Text(profile.name, style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 4),
                Text('${profile.course} - ${profile.year}', style: Theme.of(context).textTheme.bodyMedium),
                const SizedBox(height: 32),
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Contact Information', style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 24),
                      _buildField('Phone Number', _phoneController, profile.phone, Icons.phone),
                      const SizedBox(height: 16),
                      _buildField('Email Address', _emailController, profile.email, Icons.email),
                      const SizedBox(height: 16),
                      _buildField('Room No', _roomController, profile.roomNo, Icons.door_front_door),
                      const SizedBox(height: 16),
                      // Non-editable fields
                      _buildReadOnlyField('Hostel Block', profile.hostelBlock, Icons.business),
                      
                      if (_isEditing) ...[
                        const SizedBox(height: 32),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primary,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
                            ),
                            onPressed: _isLoading ? null : () => _saveProfile(profile),
                            child: _isLoading
                              ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: AppTheme.background, strokeWidth: 2))
                              : const Text('Save Changes', style: TextStyle(color: AppTheme.background, fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ]
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller, String value, IconData icon) {
    if (!_isEditing) {
      return _buildReadOnlyField(label, value, icon);
    }
    
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: AppTheme.primary),
      ),
    );
  }

  Widget _buildReadOnlyField(String label, String value, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppTheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppTheme.primary, size: 20),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: Theme.of(context).textTheme.labelSmall),
            const SizedBox(height: 4),
            Text(value, style: Theme.of(context).textTheme.bodyLarge),
          ],
        )
      ],
    );
  }
}
