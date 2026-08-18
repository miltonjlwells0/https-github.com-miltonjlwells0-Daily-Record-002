package com.dailyrecord.app.ui.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

data class LuxuryColorScheme(
    val background: Color = WarmIvory,
    val surface: Color = WarmIvoryLight,
    val cardBackground: Color = WarmIvoryMuted,
    val topBarBackground: Color = DeepObsidian,
    val topBarContent: Color = WarmIvory,
    val textPrimary: Color = TextPrimaryDark,
    val textSecondary: Color = TextSecondaryDark,
    val goldAccent: Color = ChampagneGold,
    val goldAccentLight: Color = ChampagneGoldLight,
    val goldAccentDark: Color = ChampagneGoldDark,
    val border: Color = ChampagneGoldBorder,
    val obsidianSurface: Color = DeepObsidian,
    val obsidianText: Color = WarmIvory
)

val LocalLuxuryColors = staticCompositionLocalOf { LuxuryColorScheme() }

private val ObsidianEliteLightScheme = lightColorScheme(
    primary = ChampagneGoldDark,
    onPrimary = WarmIvory,
    primaryContainer = ChampagneGoldLight,
    onPrimaryContainer = DeepObsidian,
    secondary = DeepObsidian,
    onSecondary = WarmIvory,
    background = WarmIvory,
    onBackground = TextPrimaryDark,
    surface = WarmIvoryLight,
    onSurface = TextPrimaryDark,
    surfaceVariant = WarmIvoryMuted,
    onSurfaceVariant = TextSecondaryDark,
    outline = ChampagneGoldBorder
)

@Composable
fun DailyRecordTheme(
    content: @Composable () -> Unit
) {
    val luxuryColors = LuxuryColorScheme()
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = DeepObsidian.toArgb()
            window.navigationBarColor = DeepObsidian.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = false
        }
    }

    CompositionLocalProvider(LocalLuxuryColors provides luxuryColors) {
        MaterialTheme(
            colorScheme = ObsidianEliteLightScheme,
            typography = DailyRecordTypography,
            shapes = DailyRecordShapes,
            content = content
        )
    }
}
