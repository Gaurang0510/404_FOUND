import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/api_service.dart';
import '../models/models.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_card.dart';

class VoteScreen extends StatefulWidget {
  const VoteScreen({Key? key}) : super(key: key);

  @override
  State<VoteScreen> createState() => _VoteScreenState();
}

class _VoteScreenState extends State<VoteScreen> {
  late Future<List<VoteItem>> _votesFuture;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchVotes();
  }

  void _fetchVotes() {
    setState(() {
      _votesFuture = ApiService.getVoteResults();
    });
  }

  Future<void> _submitVote(String item) async {
    setState(() => _isLoading = true);
    try {
      await ApiService.submitVote(item);
      _fetchVotes();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Vote submitted!'), backgroundColor: AppTheme.secondary),
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
      appBar: AppBar(title: const Text('Mess Menu Voting')),
      body: RefreshIndicator(
        onRefresh: () async => _fetchVotes(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Vote for Tomorrow\'s Dinner', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 24),
              _buildChartSection(),
              const SizedBox(height: 32),
              Text('Options', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 16),
              _buildOptionsList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChartSection() {
    return FutureBuilder<List<VoteItem>>(
      future: _votesFuture,
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
        
        final items = snapshot.data!;
        if (items.isEmpty) return const Text('No voting data available yet.');
        
        final maxVotes = items.map((e) => e.votes).reduce((a, b) => a > b ? a : b).toDouble();
        final chartY = maxVotes == 0 ? 10.0 : maxVotes + (maxVotes * 0.2);

        return GlassCard(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 32),
          child: SizedBox(
            height: 250,
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceAround,
                maxY: chartY,
                barTouchData: BarTouchData(enabled: false),
                titlesData: FlTitlesData(
                  show: true,
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        if (value.toInt() >= items.length) return const SizedBox.shrink();
                        final title = items[value.toInt()].menuItem.split(' ')[0];
                        return Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: Text(title, style: const TextStyle(color: AppTheme.onSurfaceVariant, fontSize: 10)),
                        );
                      },
                    ),
                  ),
                  leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                ),
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  getDrawingHorizontalLine: (value) => FlLine(
                    color: Colors.white.withOpacity(0.05),
                    strokeWidth: 1,
                  ),
                ),
                borderData: FlBorderData(show: false),
                barGroups: items.asMap().entries.map((e) {
                  final index = e.key;
                  final item = e.value;
                  return BarChartGroupData(
                    x: index,
                    barRods: [
                      BarChartRodData(
                        toY: item.votes.toDouble(),
                        gradient: const LinearGradient(
                          colors: [AppTheme.primary, AppTheme.primaryDim],
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                        ),
                        width: 22,
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
                      )
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildOptionsList() {
    return FutureBuilder<List<VoteItem>>(
      future: _votesFuture,
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const SizedBox.shrink();
        final items = snapshot.data!;
        
        return ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: items.length,
          separatorBuilder: (context, index) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final item = items[index];
            return Container(
              decoration: BoxDecoration(
                color: AppTheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.02)),
              ),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                title: Text(item.menuItem, style: Theme.of(context).textTheme.titleMedium),
                subtitle: Text('${item.votes} votes', style: Theme.of(context).textTheme.labelMedium),
                trailing: _isLoading
                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2))
                    : OutlinedButton(
                        onPressed: () => _submitVote(item.menuItem),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.primary),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        ),
                        child: const Text('VOTE', style: TextStyle(color: AppTheme.primary)),
                      ),
              ),
            );
          },
        );
      },
    );
  }
}
