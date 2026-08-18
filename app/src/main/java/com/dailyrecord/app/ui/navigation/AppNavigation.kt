package com.dailyrecord.app.ui.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.dailyrecord.app.ui.components.LuxuryTopBar
import com.dailyrecord.app.ui.screens.dashboard.DashboardScreen
import com.dailyrecord.app.ui.screens.finance.FinanceScreen
import com.dailyrecord.app.ui.screens.goals.GoalsScreen
import com.dailyrecord.app.ui.screens.habits.HabitsScreen
import com.dailyrecord.app.ui.screens.journal.DailyJournalScreen
import com.dailyrecord.app.ui.screens.knowledge.KnowledgeBaseScreen
import com.dailyrecord.app.ui.screens.projects.ProjectsTasksScreen
import com.dailyrecord.app.ui.screens.review.WeeklyReviewScreen
import com.dailyrecord.app.ui.screens.scratchpad.ScratchpadScreen
import com.dailyrecord.app.ui.screens.settings.SettingsScreen
import com.dailyrecord.app.ui.screens.timetracker.TimeTrackerScreen
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import kotlinx.coroutines.launch

@Composable
fun AppNavigation(
    viewModel: DailyRecordViewModel
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: Screen.Dashboard.route

    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    val userMessage by viewModel.userMessage.collectAsState()

    LaunchedEffect(userMessage) {
        userMessage?.let { msg ->
            snackbarHostState.showSnackbar(msg)
            viewModel.clearUserMessage()
        }
    }

    val currentScreen = remember(currentRoute) {
        Screen.drawerItems.find { it.route == currentRoute } ?: Screen.Dashboard
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet(
                drawerContainerColor = DeepObsidian,
                drawerContentColor = WarmIvory,
                modifier = Modifier.width(300.dp)
            ) {
                // Drawer Header
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DeepObsidian)
                        .padding(24.dp)
                ) {
                    Text(
                        text = "DAILY RECORD",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = ChampagneGold,
                            letterSpacing = 2.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Obsidian Élite",
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontFamily = FontFamily.Serif,
                            color = WarmIvory,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Native Offline Suite",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            color = TextMutedLight,
                            fontSize = 12.sp
                        )
                    )
                }

                Divider(color = ChampagneGoldBorder, thickness = 0.5.dp)
                Spacer(modifier = Modifier.height(8.dp))

                // Drawer Navigation Items
                Screen.drawerItems.forEach { screen ->
                    val isSelected = currentRoute == screen.route
                    NavigationDrawerItem(
                        icon = {
                            Icon(
                                imageVector = if (isSelected) screen.selectedIcon else screen.unselectedIcon,
                                contentDescription = screen.title,
                                tint = if (isSelected) ChampagneGold else TextMutedLight
                            )
                        },
                        label = {
                            Text(
                                text = screen.title,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSelected) WarmIvory else TextMutedLight
                                )
                            )
                        },
                        selected = isSelected,
                        onClick = {
                            scope.launch { drawerState.close() }
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        colors = NavigationDrawerItemDefaults.colors(
                            selectedContainerColor = ObsidianCard,
                            unselectedContainerColor = DeepObsidian
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 2.dp)
                    )
                }
            }
        }
    ) {
        Scaffold(
            topBar = {
                LuxuryTopBar(
                    title = currentScreen.title,
                    subtitle = "DAILY RECORD",
                    navigationIcon = {
                        IconButton(onClick = { scope.launch { drawerState.open() } }) {
                            Icon(
                                imageVector = Icons.Default.Menu,
                                contentDescription = "Open Navigation Menu",
                                tint = ChampagneGold
                            )
                        }
                    },
                    actions = {
                        if (currentRoute != Screen.Settings.route) {
                            IconButton(onClick = { navController.navigate(Screen.Settings.route) }) {
                                Icon(
                                    imageVector = Icons.Default.Settings,
                                    contentDescription = "Settings",
                                    tint = ChampagneGoldLight
                                )
                            }
                        }
                    }
                )
            },
            bottomBar = {
                NavigationBar(
                    containerColor = DeepObsidian,
                    tonalElevation = 8.dp
                ) {
                    Screen.bottomNavItems.forEach { screen ->
                        val isSelected = currentRoute == screen.route
                        NavigationBarItem(
                            icon = {
                                Icon(
                                    imageVector = if (isSelected) screen.selectedIcon else screen.unselectedIcon,
                                    contentDescription = screen.title
                                )
                            },
                            label = {
                                Text(
                                    text = screen.title,
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontSize = 10.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                    )
                                )
                            },
                            selected = isSelected,
                            onClick = {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = ChampagneGoldDark,
                                selectedTextColor = ChampagneGold,
                                unselectedIconColor = TextMutedLight,
                                unselectedTextColor = TextMutedLight,
                                indicatorColor = ObsidianCard
                            )
                        )
                    }
                }
            },
            snackbarHost = {
                SnackbarHost(hostState = snackbarHostState) { data ->
                    Snackbar(
                        snackbarData = data,
                        containerColor = DeepObsidian,
                        contentColor = WarmIvory,
                        actionColor = ChampagneGold
                    )
                }
            },
            containerColor = WarmIvory
        ) { innerPadding ->
            NavHost(
                navController = navController,
                startDestination = Screen.Dashboard.route,
                modifier = Modifier.padding(innerPadding)
            ) {
                composable(Screen.Dashboard.route) {
                    DashboardScreen(
                        viewModel = viewModel,
                        onNavigateToRoute = { route ->
                            navController.navigate(route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
                composable(Screen.DailyJournal.route) {
                    DailyJournalScreen(viewModel = viewModel)
                }
                composable(Screen.Goals.route) {
                    GoalsScreen(viewModel = viewModel)
                }
                composable(Screen.ProjectsTasks.route) {
                    ProjectsTasksScreen(viewModel = viewModel)
                }
                composable(Screen.TimeTracker.route) {
                    TimeTrackerScreen(viewModel = viewModel)
                }
                composable(Screen.Habits.route) {
                    HabitsScreen(viewModel = viewModel)
                }
                composable(Screen.Finance.route) {
                    FinanceScreen(viewModel = viewModel)
                }
                composable(Screen.WeeklyReview.route) {
                    WeeklyReviewScreen(viewModel = viewModel)
                }
                composable(Screen.Scratchpad.route) {
                    ScratchpadScreen(viewModel = viewModel)
                }
                composable(Screen.Knowledge.route) {
                    KnowledgeBaseScreen(viewModel = viewModel)
                }
                composable(Screen.Settings.route) {
                    SettingsScreen(viewModel = viewModel)
                }
            }
        }
    }
}
