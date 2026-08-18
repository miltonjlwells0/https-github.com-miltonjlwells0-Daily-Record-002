package com.dailyrecord.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    object Dashboard : Screen(
        route = "dashboard",
        title = "Dashboard",
        selectedIcon = Icons.Filled.Dashboard,
        unselectedIcon = Icons.Outlined.Dashboard
    )

    object DailyJournal : Screen(
        route = "journal",
        title = "Daily Record",
        selectedIcon = Icons.Filled.AutoStories,
        unselectedIcon = Icons.Outlined.AutoStories
    )

    object Goals : Screen(
        route = "goals",
        title = "Goals",
        selectedIcon = Icons.Filled.TrackChanges,
        unselectedIcon = Icons.Outlined.TrackChanges
    )

    object ProjectsTasks : Screen(
        route = "projects",
        title = "Tasks",
        selectedIcon = Icons.Filled.Assignment,
        unselectedIcon = Icons.Outlined.Assignment
    )

    object TimeTracker : Screen(
        route = "timetracker",
        title = "Timer",
        selectedIcon = Icons.Filled.Timer,
        unselectedIcon = Icons.Outlined.Timer
    )

    object Habits : Screen(
        route = "habits",
        title = "Habits",
        selectedIcon = Icons.Filled.CheckCircle,
        unselectedIcon = Icons.Outlined.CheckCircle
    )

    object Finance : Screen(
        route = "finance",
        title = "Finance",
        selectedIcon = Icons.Filled.AccountBalanceWallet,
        unselectedIcon = Icons.Outlined.AccountBalanceWallet
    )

    object WeeklyReview : Screen(
        route = "review",
        title = "Review",
        selectedIcon = Icons.Filled.Psychology,
        unselectedIcon = Icons.Outlined.Psychology
    )

    object Scratchpad : Screen(
        route = "scratchpad",
        title = "Scratchpad",
        selectedIcon = Icons.Filled.StickyNote2,
        unselectedIcon = Icons.Outlined.StickyNote2
    )

    object Knowledge : Screen(
        route = "knowledge",
        title = "Knowledge",
        selectedIcon = Icons.Filled.MenuBook,
        unselectedIcon = Icons.Outlined.MenuBook
    )

    object Settings : Screen(
        route = "settings",
        title = "Settings",
        selectedIcon = Icons.Filled.Settings,
        unselectedIcon = Icons.Outlined.Settings
    )

    companion object {
        val bottomNavItems = listOf(
            Dashboard,
            DailyJournal,
            ProjectsTasks,
            TimeTracker,
            Habits
        )

        val drawerItems = listOf(
            Dashboard,
            DailyJournal,
            Goals,
            ProjectsTasks,
            TimeTracker,
            Habits,
            Finance,
            WeeklyReview,
            Scratchpad,
            Knowledge,
            Settings
        )
    }
}
