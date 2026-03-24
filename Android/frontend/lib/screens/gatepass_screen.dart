import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../services/api_service.dart';
import '../models/models.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class GatePassScreen extends StatefulWidget {
  const GatePassScreen({Key? key}) : super(key: key);

  @override
  State<GatePassScreen> createState() => _GatePassScreenState();
}

class _GatePassScreenState extends State<GatePassScreen> {
  final _reasonController = TextEditingController();
  DateTime _timeOut = DateTime.now();
  DateTime _timeIn = DateTime.now().add(const Duration(hours: 4));
  bool _isLoading = false;
  
  late Future<List<GatePass>> _passesFuture;

  @override
  void initState() {
    super.initState();
    _fetchPasses();
  }

  void _fetchPasses() {
    setState(() {
      _passesFuture = ApiService.getGatePasses();
    });
  }

  Future<void> _submitPass() async {
    if (_reasonController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter a reason')));
      return;
    }
    
    if (_timeIn.isBefore(_timeOut)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Time In must be after Time Out')));
      return;
    }
    
    setState(() => _isLoading = true);
    
    try {
      final newPass = await ApiService.createGatePass({
        'time_out': _timeOut.toIso8601String(),
        'time_in': _timeIn.toIso8601String(),
        'reason': _reasonController.text,
      });
      
      _reasonController.clear();
      _fetchPasses();
      
      if (mounted) {
        _showQrBottomSheet(newPass.passToken);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Gate Pass Approved!'), backgroundColor: AppTheme.secondary),
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

  void _showQrBottomSheet(String token) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: AppTheme.surfaceContainerHighest,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 48,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 32),
            Text('Generated Pass', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppTheme.secondaryContainer,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                'AUTO-APPROVED',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: AppTheme.onSecondaryContainer,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 32),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
              ),
              child: QrImageView(
                data: token,
                version: QrVersions.auto,
                size: 200.0,
                backgroundColor: Colors.white,
              ),
            ),
            const SizedBox(height: 16),
            Text(token, style: Theme.of(context).textTheme.labelLarge?.copyWith(letterSpacing: 2)),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Gate Pass')),
      body: RefreshIndicator(
        onRefresh: () async => _fetchPasses(),
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
                    Text('New Pass', style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _reasonController,
                      decoration: const InputDecoration(
                        labelText: 'Reason for outing',
                        hintText: 'e.g., Grocery shopping',
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _buildDateTimePicker(
                            label: 'Time Out',
                            dateTime: _timeOut,
                            onTap: () => _pickDateTime(isTimeOut: true),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildDateTimePicker(
                            label: 'Time In',
                            dateTime: _timeIn,
                            onTap: () => _pickDateTime(isTimeOut: false),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppTheme.primary, AppTheme.primaryDim],
                          ),
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                          onPressed: _isLoading ? null : _submitPass,
                          child: _isLoading 
                            ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: AppTheme.background, strokeWidth: 2))
                            : const Text('Generate Pass', style: TextStyle(color: AppTheme.background, fontWeight: FontWeight.bold)),
                        ),
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
    return FutureBuilder<List<GatePass>>(
      future: _passesFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return const Text('Error loading history');
        }
        final passes = snapshot.data ?? [];
        if (passes.isEmpty) {
          return const Text('No gate passes found.');
        }
        
        return ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: passes.length,
          separatorBuilder: (context, index) => const SizedBox(height: 16),
          itemBuilder: (context, index) {
            final pass = passes[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(pass.reason, style: Theme.of(context).textTheme.bodyLarge),
                      const SizedBox(height: 4),
                      Text(
                        pass.timeOut.toString().split('.')[0],
                        style: Theme.of(context).textTheme.labelSmall,
                      ),
                    ],
                  ),
                  OutlinedButton(
                    onPressed: () => _showQrBottomSheet(pass.passToken),
                    style: OutlinedButton.styleFrom(side: const BorderSide(color: AppTheme.primary)),
                    child: const Text('QR'),
                  )
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildDateTimePicker({required String label, required DateTime dateTime, required VoidCallback onTap}) {
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
              '${dateTime.day}/${dateTime.month} ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppTheme.primary),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickDateTime({required bool isTimeOut}) async {
    final DateTime? date = await showDatePicker(
      context: context,
      initialDate: isTimeOut ? _timeOut : _timeIn,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (date == null) return;

    final TimeOfDay? time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(isTimeOut ? _timeOut : _timeIn),
    );
    if (time == null) return;

    final newDateTime = DateTime(date.year, date.month, date.day, time.hour, time.minute);
    setState(() {
      if (isTimeOut) {
        _timeOut = newDateTime;
        if (_timeIn.isBefore(_timeOut)) {
          _timeIn = _timeOut.add(const Duration(hours: 4));
        }
      } else {
        _timeIn = newDateTime;
      }
    });
  }
}
