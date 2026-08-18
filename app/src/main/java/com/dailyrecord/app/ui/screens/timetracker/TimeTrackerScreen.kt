package com.dailyrecord.app.ui.screens.timetracker

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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dailyrecord.app.data.model.TimeTrackerMode
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun TimeTrackerScreen(
    viewModel: DailyRecordViewModel
) {
    val timerState by viewModel.timerState.collectAsState()
    val timeLogs by viewModel.timeLogs.collectAsState()
    val tasks by viewModel.tasks.collectAsState()
    val currentDate by viewModel.currentDate.collectAsState()

    var showManualDialog by remember { mutableStateOf(false) }

    // Format time display
    val displaySeconds = if (timerState.mode == TimeTrackerMode.Countdown) {
        timerState.secondsRemaining
    } else {
        timerState.secondsElapsed
    }

    val hours = displaySeconds / 3600
    val minutes = (displaySeconds % 3600) / 60
    val seconds = displaySeconds % 60

    val formattedTimer = remember(hours, minutes, seconds) {
        if (hours > 0) {
            String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds)
        } else {
            String.format(Locale.US, "%02d:%02d", minutes, seconds)
        }
    }

    val countdownProgress = if (timerState.mode == TimeTrackerMode.Countdown && timerState.presetSeconds > 0) {
        (timerState.presetSeconds - timerState.secondsRemaining).toFloat() / timerState.presetSeconds
    } else {
        1f
    }

    val categories = listOf("Deep Work", "Coding", "Writing", "Strategy", "Admin", "Research")

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmIvory),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Mode Selector (Countdown vs Stopwatch vs Manual)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                LuxuryChip(
                    text = "Countdown",
                    selected = timerState.mode == TimeTrackerMode.Countdown,
                    onClick = { viewModel.setTimerMode(TimeTrackerMode.Countdown) },
                    modifier = Modifier.weight(1f)
                )
                LuxuryChip(
                    text = "Stopwatch",
                    selected = timerState.mode == TimeTrackerMode.Stopwatch,
                    onClick = { viewModel.setTimerMode(TimeTrackerMode.Stopwatch) },
                    modifier = Modifier.weight(1f)
                )
                SecondaryButton(
                    text = "+ Manual",
                    onClick = { showManualDialog = true },
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Main Timer Card
        item {
            ObsidianCard(
                contentPadding = PaddingValues(24.dp)
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = if (timerState.mode == TimeTrackerMode.Countdown) "FOCUS SPRINT" else "OPEN FOCUS",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = ChampagneGold,
                            letterSpacing = 2.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    // Digital Clock Face
                    Text(
                        text = formattedTimer,
                        style = MaterialTheme.typography.displayLarge.copy(
                            fontFamily = FontFamily.Serif,
                            fontSize = 54.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (timerState.isRunning) ChampagneGoldLight else WarmIvory
                        )
                    )

                    if (timerState.mode == TimeTrackerMode.Countdown) {
                        Spacer(modifier = Modifier.height(12.dp))
                        GoldProgressIndicator(progress = countdownProgress)
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // Primary Play/Pause Controls
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Reset button
                        IconButton(
                            onClick = { viewModel.resetTimer() },
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(ObsidianCard),
                            enabled = timerState.secondsElapsed > 0 || timerState.secondsRemaining < timerState.presetSeconds
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Reset",
                                tint = WarmIvory
                            )
                        }

                        // Play/Pause Main Button
                        Box(
                            modifier = Modifier
                                .size(68.dp)
                                .clip(CircleShape)
                                .background(ChampagneGoldDark)
                                .clickable { viewModel.toggleTimer() },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (timerState.isRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
                                contentDescription = if (timerState.isRunning) "Pause" else "Start",
                                tint = WarmIvory,
                                modifier = Modifier.size(36.dp)
                            )
                        }

                        // Log Session button
                        IconButton(
                            onClick = { viewModel.saveTimerSession() },
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(ObsidianCard),
                            enabled = timerState.secondsElapsed > 0 || (timerState.mode == TimeTrackerMode.Countdown && timerState.secondsRemaining == 0L)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Check,
                                contentDescription = "Log Session",
                                tint = ChampagneGold
                            )
                        }
                    }
                }
            }
        }

        // Preset Duration Chips (if Countdown)
        if (timerState.mode == TimeTrackerMode.Countdown) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf(15, 25, 45, 60, 90).forEach { mins ->
                        val isSelected = timerState.presetSeconds == (mins * 60L)
                        LuxuryChip(
                            text = "${mins}m",
                            selected = isSelected,
                            onClick = { viewModel.setTimerPreset(mins) },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // Session Configuration Card (Task Name, Category, Notes)
        item {
            IvoryCard {
                Text(
                    text = "Session Context",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.SemiBold,
                        color = DeepObsidian
                    )
                )
                Spacer(modifier = Modifier.height(10.dp))

                LuxuryTextField(
                    value = timerState.taskName,
                    onValueChange = { viewModel.setTimerTaskName(it) },
                    label = "Target Task / Focus Topic",
                    placeholder = "e.g. Design Obsidian Élite Compose Layout"
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Category Tag",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = TextSecondaryDark)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    categories.take(4).forEach { cat ->
                        LuxuryChip(
                            text = cat,
                            selected = timerState.category == cat,
                            onClick = { viewModel.setTimerCategory(cat) }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                LuxuryTextField(
                    value = timerState.sessionNotes,
                    onValueChange = { viewModel.setTimerSessionNotes(it) },
                    label = "Session Notes / Output",
                    placeholder = "Briefly summarize what was accomplished...",
                    singleLine = false,
                    maxLines = 3
                )

                // Link to Task Option
                val uncompletedTasks = tasks.filter { it.status != com.dailyrecord.app.data.model.TaskStatus.Done }
                if (uncompletedTasks.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Link to Existing Task (Optional)",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = TextSecondaryDark)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        uncompletedTasks.take(3).forEach { t ->
                            LuxuryChip(
                                text = t.name,
                                selected = timerState.selectedTaskId == t.id,
                                onClick = {
                                    if (timerState.selectedTaskId == t.id) {
                                        viewModel.setTimerLinkedTask(null)
                                    } else {
                                        viewModel.setTimerLinkedTask(t)
                                    }
                                }
                            )
                        }
                    }

                    if (timerState.selectedTaskId != null) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(top = 8.dp)
                        ) {
                            Checkbox(
                                checked = timerState.markTaskDoneOnFinish,
                                onCheckedChange = { viewModel.setTimerMarkTaskDone(it) },
                                colors = CheckboxDefaults.colors(checkedColor = ChampagneGoldDark)
                            )
                            Text(
                                text = "Mark linked task as Done when logged",
                                style = MaterialTheme.typography.bodyMedium.copy(fontSize = 12.sp)
                            )
                        }
                    }
                }
            }
        }

        // Focus Log History
        item {
            LuxurySectionHeader(
                title = "Focus Logs (${timeLogs.size})",
                actionText = if (timeLogs.isNotEmpty()) "Total: ${timeLogs.sumOf { it.durationSeconds } / 60}m" else null
            )
        }

        if (timeLogs.isEmpty()) {
            item {
                LuxuryEmptyState(
                    title = "No Focus Sessions Recorded",
                    description = "Start the timer or manually add completed deep work blocks.",
                    icon = Icons.Default.Timer
                )
            }
        } else {
            items(timeLogs.take(10)) { log ->
                val mins = log.durationSeconds / 60
                val secs = log.durationSeconds % 60
                val durFormatted = if (mins >= 60) "${mins / 60}h ${mins % 60}m" else "${mins}m ${secs}s"

                LuxuryCard(contentPadding = PaddingValues(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(ChampagneGold.copy(alpha = 0.2f))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = log.category.uppercase(),
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = ChampagneGoldDark,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 9.sp
                                        )
                                    )
                                }
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = log.date,
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        fontSize = 10.sp,
                                        color = TextMutedDark
                                    )
                                )
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = log.taskName,
                                style = MaterialTheme.typography.bodyLarge.copy(
                                    fontWeight = FontWeight.SemiBold,
                                    color = DeepObsidian
                                )
                            )
                            if (!log.notes.isNullOrBlank()) {
                                Text(
                                    text = log.notes,
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        fontSize = 11.sp,
                                        color = TextSecondaryDark
                                    ),
                                    maxLines = 2
                                )
                            }
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = durFormatted,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontFamily = FontFamily.Serif,
                                    fontWeight = FontWeight.Bold,
                                    color = ChampagneGoldDark
                                )
                            )
                            IconButton(
                                onClick = { viewModel.deleteTimeLog(log.id) },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.DeleteOutline,
                                    contentDescription = "Delete",
                                    tint = TextMutedDark,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // Manual Time Entry Dialog
    if (showManualDialog) {
        var manualTask by remember { mutableStateOf("") }
        var manualCategory by remember { mutableStateOf("Deep Work") }
        var manualDate by remember {
            mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()))
        }
        var manualMinutes by remember { mutableStateOf("30") }
        var manualNotes by remember { mutableStateOf("") }

        LuxuryDialog(
            onDismissRequest = { showManualDialog = false },
            title = "Log Manual Session",
            confirmButton = {
                GoldButton(
                    text = "Save Entry",
                    onClick = {
                        val mins = manualMinutes.toIntOrNull() ?: 30
                        viewModel.addManualTimeLog(
                            taskName = manualTask.trim(),
                            category = manualCategory,
                            date = manualDate,
                            minutes = mins,
                            notes = manualNotes.trim()
                        )
                        showManualDialog = false
                    }
                )
            },
            dismissButton = {
                SecondaryButton(text = "Cancel", onClick = { showManualDialog = false })
            }
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                LuxuryTextField(
                    value = manualTask,
                    onValueChange = { manualTask = it },
                    label = "Activity / Task Title"
                )

                LuxuryTextField(
                    value = manualMinutes,
                    onValueChange = { manualMinutes = it },
                    label = "Duration (Minutes)"
                )

                LuxuryTextField(
                    value = manualDate,
                    onValueChange = { manualDate = it },
                    label = "Date (YYYY-MM-DD)"
                )

                LuxuryTextField(
                    value = manualNotes,
                    onValueChange = { manualNotes = it },
                    label = "Session Notes",
                    singleLine = false,
                    maxLines = 3
                )
            }
        }
    }
}
