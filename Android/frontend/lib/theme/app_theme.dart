import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Midnight Concierge Colors
  static const Color background = Color(0xFF060E20);
  static const Color surfaceContainerLow = Color(0xFF091328);
  static const Color surfaceContainerHighest = Color(0xFF192540);
  static const Color surfaceBright = Color(0xFF1F2B49);
  
  static const Color primary = Color(0xFFA3A6FF);
  static const Color primaryDim = Color(0xFF6063EE);
  
  static const Color secondary = Color(0xFF69F6B8);
  static const Color secondaryContainer = Color(0xFF006C49);
  static const Color onSecondaryContainer = Color(0xFFE1FFEC);
  
  static const Color tertiary = Color(0xFFFFB148);
  static const Color tertiaryContainer = Color(0xFFF8A010);
  static const Color onTertiaryContainer = Color(0xFF4A2C00);
  
  static const Color error = Color(0xFFFF6E84);
  static const Color errorContainer = Color(0xFFA70138);
  static const Color onErrorContainer = Color(0xFFFFB2B9);
  
  static const Color onSurface = Color(0xFFDEE5FF);
  static const Color onSurfaceVariant = Color(0xFFA3AAC4);
  static const Color outlineVariant = Color(0xFF40485D);
  static const Color surfaceTint = Color(0xFFA3A6FF);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: primary,
      colorScheme: const ColorScheme.dark(
        primary: primary,
        secondary: secondary,
        tertiary: tertiary,
        error: error,
        surface: background,
        onSurface: onSurface,
        onSurfaceVariant: onSurfaceVariant,
      ),
      textTheme: TextTheme(
        // Headlines: Manrope
        displayLarge: GoogleFonts.manrope(
            fontSize: 57, fontWeight: FontWeight.bold, color: onSurface),
        displayMedium: GoogleFonts.manrope(
            fontSize: 45, fontWeight: FontWeight.bold, color: onSurface),
        displaySmall: GoogleFonts.manrope(
            fontSize: 36, fontWeight: FontWeight.bold, color: onSurface),
        headlineLarge: GoogleFonts.manrope(
            fontSize: 32, fontWeight: FontWeight.bold, color: onSurface),
        headlineMedium: GoogleFonts.manrope(
            fontSize: 28, fontWeight: FontWeight.bold, color: onSurface),
        headlineSmall: GoogleFonts.manrope(
            fontSize: 24, fontWeight: FontWeight.bold, color: onSurface),
        titleLarge: GoogleFonts.manrope(
            fontSize: 22, fontWeight: FontWeight.bold, color: onSurface),
        titleMedium: GoogleFonts.manrope(
            fontSize: 16, fontWeight: FontWeight.w600, color: onSurface),
        titleSmall: GoogleFonts.manrope(
            fontSize: 14, fontWeight: FontWeight.w600, color: onSurfaceVariant),
        
        // Labels & Data: Inter
        bodyLarge: GoogleFonts.inter(
            fontSize: 16, fontWeight: FontWeight.normal, color: onSurface),
        bodyMedium: GoogleFonts.inter(
            fontSize: 14, fontWeight: FontWeight.normal, color: onSurface),
        bodySmall: GoogleFonts.inter(
            fontSize: 12, fontWeight: FontWeight.normal, color: onSurfaceVariant),
        labelLarge: GoogleFonts.inter(
            fontSize: 14, fontWeight: FontWeight.w600, color: onSurface),
        labelMedium: GoogleFonts.inter(
            fontSize: 12, fontWeight: FontWeight.w600, color: onSurfaceVariant),
        labelSmall: GoogleFonts.inter(
            fontSize: 11, fontWeight: FontWeight.w600, color: onSurfaceVariant, letterSpacing: 0.5),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: primary),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: background,
        selectedItemColor: primary,
        unselectedItemColor: onSurfaceVariant,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        color: surfaceContainerHighest.withOpacity(0.6),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24), // 1.5rem
        ),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: primary,
        foregroundColor: background,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceContainerLow,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: primary.withOpacity(0.2), width: 1),
        ),
        labelStyle: GoogleFonts.inter(color: onSurfaceVariant),
        hintStyle: GoogleFonts.inter(color: onSurfaceVariant.withOpacity(0.5)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
      snackBarTheme: const SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
