import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class LeaveScreen extends StatefulWidget {
  const LeaveScreen({Key? key}) : super(key: key);

  @override
  State<LeaveScreen> createState() => _LeaveScreenState();
}

class _LeaveScreenState extends State<LeaveScreen> {
  final _reasonController = TextEditingController();
  DateTime _startDate = DateTime.now();
  DateTime _endDate = DateTime.now().add(const Duration(days: 1));
  bool _isLoading = false;
  late Future<List<Leave>> _leavesFuture;

  @override
  void initState() {
    super.initState();
    _fetchLeaves();
  }

  void _fetchLeaves() {
    setState(() {
      _leavesFuture = ApiService.getLeaves();
    });
  }

  Future<void> _submitLeave() async {
    if (_reasonController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter a reason')));
      return;
    }
    
    if (_endDate.isBefore(_startDate)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('End Date must be after Start Date')));
      return;
    }

    setState(() => _isLoading = true);
    
    try {
      await ApiService.createLeave({
        'start_date': _startDate.toIso8601String(),
        'end_date': _endDate.toIso8601String(),
        'reason': _reasonController.text,
      });
      _reasonController.clear();
      _fetchLeaves();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Leave Request Submitted'), backgroundColor: AppTheme.secondary),
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

  Color _getStatusColor(String status) {
    if (status == 'Approved') return AppTheme.secondary;
    if (status == 'Rejected') return AppTheme.error;
    return AppTheme.tertiary; // Pending
  }
  
  Color _getStatusContainerColor(String status) {
    if (status == 'Approved') return AppTheme.secondaryContainer;
    if (status == 'Rejected') return AppTheme.errorContainer;
    return AppTheme.tertiaryContainer; // Pending
  }
  
  Color _getOnStatusContainerColor(String status) {
    if (status == 'Approved') return AppTheme.onSecondaryContainer;
    if (status == 'Rejected') return AppTheme.onErrorContainer;
    return AppTheme.onTertiaryContainer; // Pending
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Leave Requests')),
      body: RefreshIndicator(
        onRefresh: () async => _fetchLeaves(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('New Request', style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _reasonController,
                      decoration: const InputDecoration(
                        labelText: 'Reason for leave',
                      ),
                      maxLines: 3,
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _buildDatePicker(
                            label: 'Start Date',
                            dateTime: _startDate,
                            onTap: () => _pickDate(isStart: true),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildDatePicker(
                            label: 'End Date',
                            dateTime: _endDate,
                            onTap: () => _pickDate(isStart: false),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primary,
                          foregroundColor: AppTheme.background,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
                        ),
                        onPressed: _isLoading ? null : _submitLeave,
                        child: _isLoading 
                          ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: AppTheme.background, strokeWidth: 2))
                          : const Text('Submit Request', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              Text('History', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 16),
              _buildHistorySection(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHistorySection() {
    return FutureBuilder<List<Leave>>(
      future: _leavesFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) return const Text('Error loading history');
        final leaves = snapshot.data ?? [];
        if (leaves.isEmpty) return const Text('No leave requests found.');
        
        return ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: leaves.length,
          separatorBuilder: (context, index) => const SizedBox(height: 16),
          itemBuilder: (context, index) {
            final leave = leaves[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.02)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          leave.reason, 
                          style: Theme.of(context).textTheme.bodyLarge,
                          maxLines: 1, 
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getStatusContainerColor(leave.status),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          leave.status.toUpperCase(),
                          style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: _getOnStatusContainerColor(leave.status),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${leave.startDate.toString().split(' ')[0]} to ${leave.endDate.toString().split(' ')[0]}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildDatePicker({required String label, required DateTime dateTime, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          color: AppTheme.surfaceContainerLow,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: Theme.of(context).textTheme.labelSmall),
            const SizedBox(height: 4),
            Text(
              '${dateTime.day}/${dateTime.month}/${dateTime.year}',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppTheme.primary),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickDate({required bool isStart}) async {
    final DateTime? date = await showDatePicker(
      context: context,
      initialDate: isStart ? _startDate : _endDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date == null) return;

    setState(() {
      if (isStart) {
        _startDate = date;
        if (_endDate.isBefore(_startDate)) {
          _endDate = _startDate.add(const Duration(days: 1));
        }
      } else {
        _endDate = date;
      }
    });
  }
}
