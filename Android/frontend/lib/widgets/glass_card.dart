import 'dart:ui';
import 'package:flutter/material.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;

  const GlassCard({
    Key? key,
    required this.child,
    this.padding = const EdgeInsets.all(24),
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 16.0, sigmaY: 16.0),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              color: const Color(0xFF192540).withOpacity(0.6),
              border: Border.all(
                color: Colors.white.withOpacity(0.05),
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}
