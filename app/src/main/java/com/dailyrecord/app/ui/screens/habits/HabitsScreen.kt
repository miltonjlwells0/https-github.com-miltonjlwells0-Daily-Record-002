package com.dailyrecord.app.ui.screens.habits

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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun HabitsScreen(
    viewModel: DailyRecordViewModel
) {
    val habitDefs by viewModel.habitDefs.collectAsState()
    val habitDays by viewModel.habitDays.collectAsState()
    val currentDate by viewModel.currentDate.collectAsState()

    var showAddDialog by remember { mutableStateOf(false) }

    // Last 7 days dates list
    val last7Days = remember {
        val list = mutableListOf<String>()
        val cal = Calendar.getInstance()
        val format = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val dayNameFormat = SimpleDateFormat("EEE", Locale.getDefault())
        for (i in 6 downTo 0) {
            val c = Calendar.getInstance()
            c.add(Calendar.DAY_OF_YEAR, -i)
            list.add(format.format(c.time))
        }
        list
    }

    val todayHabitDay = habitDays.find { it.date == currentDate }
    val completedCountToday = todayHabitDay?.completedHabitIds?.size ?: 0
    val totalHabits = habitDefs.size

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmIvory),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Header
        item {
            ObsidianCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "RITUALS & DISCIPLINES",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = ChampagneGold,
                                letterSpacing = 1.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Text(
                            text = "Daily Habits & Vitals",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontFamily = FontFamily.Serif,
                                color = WarmIvory,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }

                    GoldButton(
                        text = "+ Habit",
                        onClick = { showAddDialog = true }
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))
                Divider(color = ChampagneGoldBorder, thickness = 0.5.dp)
                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Today's Completion: $completedCountToday of $totalHabits",
                        style = MaterialTheme.typography.bodyMedium.copy(color = WarmIvoryLight)
                    )
                    Text(
                        text = if (totalHabits > 0) "${(completedCountToday * 100) / totalHabits}%" else "0%",
                        style = MaterialTheme.typography.labelLarge.copy(
                            color = ChampagneGold,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                GoldProgressIndicator(progress = if (totalHabits > 0) completedCountToday.toFloat() / totalHabits else 0f)
            }
        }

        // Habits 7-Day History Matrix
        item {
            LuxuryCard {
                Text(
                    text = "7-Day Consistency Matrix",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.SemiBold,
                        color = DeepObsidian
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))

                // Days of week header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Habit",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = ChampagneGoldDark,
                            fontWeight = FontWeight.Bold
                        ),
                        modifier = Modifier.weight(1.8f)
                    )
                    last7Days.forEach { d ->
                        val dayLabel = try {
                            val parsed = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(d)
                            SimpleDateFormat("EEE", Locale.getDefault()).format(parsed ?: Date())
                        } catch (e: Exception) {
                            "D"
                        }
                        Text(
                            text = dayLabel.uppercase(),
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = if (d == currentDate) ChampagneGoldDark else TextMutedDark,
                                fontWeight = if (d == currentDate) FontWeight.Bold else FontWeight.Normal,
                                fontSize = 10.sp
                            ),
                            modifier = Modifier.weight(1f),
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))
                Divider(color = ChampagneGoldBorder, thickness = 0.5.dp)
                Spacer(modifier = Modifier.height(8.dp))

                // Habits rows
                habitDefs.forEach { habit ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1.8f)
                        ) {
                            Text(text = habit.icon, fontSize = 16.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = habit.name,
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontWeight = FontWeight.Medium,
                                    fontSize = 12.sp
                                ),
                                maxLines = 1
                            )
                        }

                        last7Days.forEach { dateStr ->
                            val dayObj = habitDays.find { it.date == dateStr }
                            val isDone = dayObj?.completedHabitIds?.contains(habit.id) == true

                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .padding(horizontal = 2.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(24.dp)
                                        .clip(CircleShape)
                                        .background(if (isDone) ChampagneGoldDark else WarmIvoryMuted)
                                        .clickable {
                                            viewModel.toggleHabit(dateStr, habit.id)
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    if (isDone) {
                                        Icon(
                                            imageVector = Icons.Default.Check,
                                            contentDescription = null,
                                            tint = WarmIvory,
                                            modifier = Modifier.size(14.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Manage Habits List
        item {
            LuxurySectionHeader(title = "Habit Inventory (${habitDefs.size})")
        }

        if (habitDefs.isEmpty()) {
            item {
                LuxuryEmptyState(
                    title = "No habits defined",
                    description = "Establish recurring micro-actions for meditation, deep work, health, or reading.",
                    icon = Icons.Default.CheckCircle,
                    actionText = "+ Add Habit",
                    onActionClick = { showAddDialog = true }
                )
            }
        } else {
            items(habitDefs) { habit ->
                val isDoneToday = todayHabitDay?.completedHabitIds?.contains(habit.id) == true

                LuxuryCard(contentPadding = PaddingValues(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(if (isDoneToday) ChampagneGoldDark else WarmIvoryLight)
                                    .clickable { viewModel.toggleHabit(currentDate, habit.id) },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = habit.icon, fontSize = 18.sp)
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = habit.name,
                                    style = MaterialTheme.typography.bodyLarge.copy(
                                        fontWeight = FontWeight.SemiBold,
                                        color = DeepObsidian
                                    )
                                )
                                Text(
                                    text = if (isDoneToday) "Completed for Today ✨" else "Pending Today",
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        fontSize = 11.sp,
                                        color = if (isDoneToday) StatusCompleted else TextSecondaryDark
                                    )
                                )
                            }
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                checked = isDoneToday,
                                onCheckedChange = { viewModel.toggleHabit(currentDate, habit.id) },
                                colors = CheckboxDefaults.colors(
                                    checkedColor = ChampagneGoldDark,
                                    uncheckedColor = ChampagneGoldBorder,
                                    checkmarkColor = WarmIvory
                                )
                            )
                            IconButton(
                                onClick = { viewModel.deleteHabitDef(habit.id) },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.DeleteOutline,
                                    contentDescription = "Delete Habit",
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

    // Add Habit Dialog
    if (showAddDialog) {
        var habitName by remember { mutableStateOf("") }
        var habitIcon by remember { mutableStateOf("⚡") }

        val emojiPresets = listOf("⚡", "🧘", "💧", "📖", "🏃", "☕", "🌙", "🎯", "✍️", "🥗")

        LuxuryDialog(
            onDismissRequest = { showAddDialog = false },
            title = "New Daily Habit",
            confirmButton = {
                GoldButton(
                    text = "Add Habit",
                    onClick = {
                        if (habitName.isNotBlank()) {
                            viewModel.addHabitDef(name = habitName.trim(), icon = habitIcon)
                            showAddDialog = false
                        }
                    }
                )
            },
            dismissButton = {
                SecondaryButton(text = "Cancel", onClick = { showAddDialog = false })
            }
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                LuxuryTextField(
                    value = habitName,
                    onValueChange = { habitName = it },
                    label = "Habit Name",
                    placeholder = "e.g. Read 20 pages of nonfiction"
                )

                Text(
                    text = "Choose Icon",
                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    emojiPresets.take(5).forEach { emo ->
                        LuxuryChip(
                            text = emo,
                            selected = habitIcon == emo,
                            onClick = { habitIcon = emo }
                        )
                    }
                }
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    emojiPresets.drop(5).forEach { emo ->
                        LuxuryChip(
                            text = emo,
                            selected = habitIcon == emo,
                            onClick = { habitIcon = emo }
                        )
                    }
                }
            }
        }
    }
}
