import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late Future<Profile> _profileFuture;
  late Future<DashboardSummary> _summaryFuture;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  void _fetchData() {
    setState(() {
      _profileFuture = ApiService.getStudentProfile();
      _summaryFuture = ApiService.getDashboardSummary();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async => _fetchData(),
          color: AppTheme.primary,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.only(left: 24, right: 24, top: 24, bottom: 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(),
                const SizedBox(height: 32),
                _buildSummaryGrid(),
                const SizedBox(height: 32),
                _buildGatePassCard(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return FutureBuilder<Profile>(
      future: _profileFuture,
      builder: (context, snapshot) {
        if (snapshot.hasError) return Text('Error loading profile');
        
        final name = snapshot.data?.name.split(' ')[0] ?? '...';
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hello, $name',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 4),
            Text(
              'Hostel Dashboard',
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    letterSpacing: 2.0,
                    textBaseline: TextBaseline.alphabetic,
                  ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildSummaryGrid() {
    return FutureBuilder<DashboardSummary>(
      future: _summaryFuture,
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Center(child: CircularProgressIndicator());
        }
        
        final summary = snapshot.data!;
        return GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: 1.5,
          children: [
            _buildStatCard('Total Leaves', summary.totalLeaves.toString(), Icons.event_busy, AppTheme.primary),
            _buildStatCard('Pending', summary.pendingRequests.toString(), Icons.pending_actions, AppTheme.tertiary),
            _buildStatCard('Attendance', '${summary.attendancePct}%', Icons.check_circle_outline, AppTheme.secondary),
            _buildStatCard('Complaints', summary.activeComplaints.toString(), Icons.report_problem_outlined, AppTheme.error),
          ],
        );
      },
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title.toUpperCase(),
                style: Theme.of(context).textTheme.labelSmall?.copyWith(fontSize: 10),
              ),
              Text(
                value,
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildGatePassCard() {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryContainer.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.door_front_door, color: AppTheme.secondary),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryContainer,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'ACTIVE',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: AppTheme.onSecondaryContainer,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text('Gate Pass', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 4),
          const Text('Instant approval for outings.'),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: AppTheme.primary.withOpacity(0.3)),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              onPressed: () {
                // Navigate to Gate Pass
              },
              child: const Text('View Pass', style: TextStyle(color: AppTheme.primary)),
            ),
          )
        ],
      ),
    );
  }
}
