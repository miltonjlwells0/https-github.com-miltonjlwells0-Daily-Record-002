package com.dailyrecord.app.ui.screens.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dailyrecord.app.data.local.entity.TaskEntity
import com.dailyrecord.app.data.model.GoalStatus
import com.dailyrecord.app.data.model.TaskStatus
import com.dailyrecord.app.data.model.TransactionType
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun DashboardScreen(
    viewModel: DailyRecordViewModel,
    onNavigateToRoute: (String) -> Unit
) {
    val goals by viewModel.goals.collectAsState()
    val tasks by viewModel.tasks.collectAsState()
    val timeLogs by viewModel.timeLogs.collectAsState()
    val habitDefs by viewModel.habitDefs.collectAsState()
    val habitDays by viewModel.habitDays.collectAsState()
    val transactions by viewModel.transactions.collectAsState()
    val currentJournal by viewModel.currentJournal.collectAsState()
    val currentDate by viewModel.currentDate.collectAsState()

    val todayDateFormatted = remember {
        SimpleDateFormat("EEEE, MMMM d, yyyy", Locale.getDefault()).format(Date())
    }

    // Calculations
    val todaysTasks = tasks.filter { it.dueDate == currentDate }
    val completedTasksCount = tasks.count { it.status == TaskStatus.Done }
    val totalTasksCount = tasks.size

    val todaysTimeLogs = timeLogs.filter { it.date == currentDate }
    val totalTimeSecondsToday = todaysTimeLogs.sumOf { it.durationSeconds }
    val timeFormatted = remember(totalTimeSecondsToday) {
        val hrs = totalTimeSecondsToday / 3600
        val mins = (totalTimeSecondsToday % 3600) / 60
        if (hrs > 0) "${hrs}h ${mins}m" else "${mins}m"
    }

    val todayHabitDay = habitDays.find { it.date == currentDate }
    val completedHabitsTodayCount = todayHabitDay?.completedHabitIds?.size ?: 0
    val totalHabitsCount = habitDefs.size

    val totalIncome = transactions.filter { it.type == TransactionType.Income }.sumOf { it.amount }
    val totalExpenses = transactions.filter { it.type == TransactionType.Expense || it.type == TransactionType.Subscription }.sumOf { it.amount }
    val netBalance = totalIncome - totalExpenses

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmIvory),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Header
        item {
            ObsidianCard(
                contentPadding = PaddingValues(20.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
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
                            text = "Welcome, Commander",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontFamily = FontFamily.Serif,
                                color = WarmIvory,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = todayDateFormatted,
                            style = MaterialTheme.typography.bodyMedium.copy(
                                color = TextMutedLight,
                                fontSize = 12.sp
                            )
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape)
                            .background(ChampagneGold.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "👑", fontSize = 22.sp)
                    }
                }

                // Daily Morning Intention preview
                if (!currentJournal?.morningIntention.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(14.dp))
                    Divider(color = ChampagneGoldBorder, thickness = 0.5.dp)
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.FormatQuote,
                            contentDescription = null,
                            tint = ChampagneGold,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = currentJournal?.morningIntention ?: "",
                            style = MaterialTheme.typography.bodyMedium.copy(
                                color = WarmIvoryLight,
                                fontFamily = FontFamily.Serif,
                                fontSize = 13.sp
                            ),
                            maxLines = 2
                        )
                    }
                }
            }
        }

        // 4-Block Metric Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                LuxuryStatCard(
                    title = "Focus Time",
                    value = timeFormatted,
                    subtitle = "${todaysTimeLogs.size} sessions",
                    icon = Icons.Default.Timer,
                    modifier = Modifier.weight(1f)
                )
                LuxuryStatCard(
                    title = "Habits",
                    value = "$completedHabitsTodayCount/$totalHabitsCount",
                    subtitle = "Done today",
                    icon = Icons.Default.CheckCircle,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                LuxuryStatCard(
                    title = "Tasks",
                    value = "$completedTasksCount/$totalTasksCount",
                    subtitle = "${tasks.count { it.status == TaskStatus.ToDo }} remaining",
                    icon = Icons.Default.Assignment,
                    modifier = Modifier.weight(1f)
                )
                LuxuryStatCard(
                    title = "Net Balance",
                    value = "$${String.format(Locale.US, "%,.0f", netBalance)}",
                    subtitle = "Local Ledger",
                    icon = Icons.Default.AccountBalanceWallet,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Quick Actions Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                GoldButton(
                    text = "Timer",
                    icon = Icons.Default.PlayArrow,
                    onClick = { onNavigateToRoute("timetracker") },
                    modifier = Modifier.weight(1f)
                )
                SecondaryButton(
                    text = "Journal",
                    icon = Icons.Default.AutoStories,
                    onClick = { onNavigateToRoute("journal") },
                    modifier = Modifier.weight(1f)
                )
                SecondaryButton(
                    text = "Capture",
                    icon = Icons.Default.StickyNote2,
                    onClick = { onNavigateToRoute("scratchpad") },
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Today's Priority Tasks Section
        item {
            LuxurySectionHeader(
                title = "Today's Agenda",
                actionText = "View All (${tasks.size})",
                onActionClick = { onNavigateToRoute("projects") }
            )
        }

        if (todaysTasks.isEmpty()) {
            item {
                LuxuryEmptyState(
                    title = "No tasks for today",
                    description = "Capture an action item or link a goal to start building momentum.",
                    icon = Icons.Default.Checklist,
                    actionText = "+ Add Task",
                    onActionClick = { onNavigateToRoute("projects") }
                )
            }
        } else {
            items(todaysTasks.take(5)) { task ->
                LuxuryCard(
                    contentPadding = PaddingValues(12.dp),
                    onClick = {
                        val newStatus = if (task.status == TaskStatus.Done) TaskStatus.ToDo else TaskStatus.Done
                        viewModel.updateTask(task.copy(status = newStatus))
                    }
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            Checkbox(
                                checked = task.status == TaskStatus.Done,
                                onCheckedChange = { checked ->
                                    viewModel.updateTask(task.copy(status = if (checked) TaskStatus.Done else TaskStatus.ToDo))
                                },
                                colors = CheckboxDefaults.colors(
                                    checkedColor = ChampagneGoldDark,
                                    uncheckedColor = ChampagneGoldBorder,
                                    checkmarkColor = WarmIvory
                                )
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = task.name,
                                    style = MaterialTheme.typography.bodyLarge.copy(
                                        fontWeight = FontWeight.Medium,
                                        color = if (task.status == TaskStatus.Done) TextMutedDark else TextPrimaryDark
                                    )
                                )
                                Text(
                                    text = "Priority: ${task.priority.name} • ${task.dueDate}",
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        fontSize = 11.sp,
                                        color = TextSecondaryDark
                                    )
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(
                                    if (task.status == TaskStatus.Done) StatusCompleted.copy(alpha = 0.15f)
                                    else ChampagneGold.copy(alpha = 0.15f)
                                )
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = task.status.displayName,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = if (task.status == TaskStatus.Done) StatusCompleted else ChampagneGoldDark,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }
                    }
                }
            }
        }

        // Active Goals Section
        item {
            LuxurySectionHeader(
                title = "Active Goals",
                actionText = "Manage Goals",
                onActionClick = { onNavigateToRoute("goals") }
            )
        }

        if (goals.isEmpty()) {
            item {
                LuxuryEmptyState(
                    title = "No active goals set",
                    description = "Define milestones for career, health, finance, and learning.",
                    icon = Icons.Default.TrackChanges,
                    actionText = "+ Create Goal",
                    onActionClick = { onNavigateToRoute("goals") }
                )
            }
        } else {
            items(goals.take(3)) { goal ->
                LuxuryCard(
                    contentPadding = PaddingValues(14.dp),
                    onClick = { onNavigateToRoute("goals") }
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = goal.category.name.uppercase(),
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = ChampagneGoldDark,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 10.sp
                                    )
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "• Target: ${goal.targetDate}",
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        fontSize = 10.sp,
                                        color = TextMutedDark
                                    )
                                )
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = goal.name,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontFamily = FontFamily.Serif,
                                    fontWeight = FontWeight.SemiBold
                                )
                            )
                        }
                        Text(
                            text = "${goal.progress}%",
                            style = MaterialTheme.typography.labelLarge.copy(
                                fontWeight = FontWeight.Bold,
                                color = ChampagneGoldDark
                            )
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    GoldProgressIndicator(progress = goal.progress / 100f)
                }
            }
        }
    }
}
