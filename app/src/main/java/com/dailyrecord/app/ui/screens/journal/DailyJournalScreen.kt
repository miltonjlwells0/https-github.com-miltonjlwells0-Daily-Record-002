package com.dailyrecord.app.ui.screens.journal

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.dailyrecord.app.data.local.entity.DailyJournalEntity
import com.dailyrecord.app.data.model.MoodType
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun DailyJournalScreen(
    viewModel: DailyRecordViewModel
) {
    val selectedDate by viewModel.selectedJournalDate.collectAsState()
    val currentJournal by viewModel.currentJournal.collectAsState()
    val todayDate = remember { DailyRecordViewModel.getTodayDateString() }

    val dateFormat = remember { SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()) }
    val displayFormat = remember { SimpleDateFormat("EEEE, MMM d, yyyy", Locale.getDefault()) }

    val formattedDisplayDate = remember(selectedDate) {
        try {
            val date = dateFormat.parse(selectedDate) ?: Date()
            displayFormat.format(date)
        } catch (e: Exception) {
            selectedDate
        }
    }

    val isToday = selectedDate == todayDate
    val entry = currentJournal ?: DailyJournalEntity(date = selectedDate)

    fun changeDate(offsetDays: Int) {
        try {
            val cal = Calendar.getInstance()
            cal.time = dateFormat.parse(selectedDate) ?: Date()
            cal.add(Calendar.DAY_OF_YEAR, offsetDays)
            viewModel.setSelectedJournalDate(dateFormat.format(cal.time))
        } catch (e: Exception) {
            viewModel.setSelectedJournalDate(todayDate)
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmIvory),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Date Navigator Header
        item {
            ObsidianCard(contentPadding = PaddingValues(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = { changeDate(-1) },
                        modifier = Modifier.size(36.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ChevronLeft,
                            contentDescription = "Previous Day",
                            tint = ChampagneGold
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = if (isToday) "TODAY'S RECORD" else "RECORD ARCHIVE",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = ChampagneGold,
                                letterSpacing = 1.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Text(
                            text = formattedDisplayDate,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontFamily = FontFamily.Serif,
                                color = WarmIvory,
                                fontWeight = FontWeight.SemiBold
                            )
                        )
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = { changeDate(1) },
                            modifier = Modifier.size(36.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.ChevronRight,
                                contentDescription = "Next Day",
                                tint = ChampagneGold
                            )
                        }
                        if (!isToday) {
                            Spacer(modifier = Modifier.width(4.dp))
                            TextButton(
                                onClick = { viewModel.setSelectedJournalDate(todayDate) },
                                contentPadding = PaddingValues(horizontal = 8.dp)
                            ) {
                                Text("Today", color = ChampagneGoldLight, fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }

        // Mood & Energy Level Selector
        item {
            IvoryCard {
                Text(
                    text = "State of Mind & Energy",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.SemiBold,
                        color = DeepObsidian
                    )
                )
                Spacer(modifier = Modifier.height(10.dp))

                // Mood selector chips
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    MoodType.values().forEach { mood ->
                        val isSelected = entry.mood == mood
                        LuxuryChip(
                            text = mood.displayName,
                            leadingEmoji = mood.emoji,
                            selected = isSelected,
                            onClick = {
                                viewModel.updateJournalField { it.copy(mood = mood) }
                            },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                Divider(color = ChampagneGoldBorder, thickness = 0.5.dp)
                Spacer(modifier = Modifier.height(10.dp))

                // Energy level 1-5
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Energy Level: ${entry.energyLevel}/5",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            fontWeight = FontWeight.Medium,
                            color = TextPrimaryDark
                        )
                    )

                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        (1..5).forEach { level ->
                            val isSelected = level <= entry.energyLevel
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clip(CircleShape)
                                    .background(if (isSelected) ChampagneGoldDark else WarmIvoryMuted)
                                    .clickable {
                                        viewModel.updateJournalField { it.copy(energyLevel = level) }
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "$level",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = if (isSelected) WarmIvory else TextSecondaryDark,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                            }
                        }
                    }
                }
            }
        }

        // Morning Intention
        item {
            LuxuryCard {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.WbSunny,
                        contentDescription = null,
                        tint = ChampagneGoldDark,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Morning Intention & Focus",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontFamily = FontFamily.Serif,
                            fontWeight = FontWeight.SemiBold,
                            color = DeepObsidian
                        )
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                LuxuryTextField(
                    value = entry.morningIntention,
                    onValueChange = { valText ->
                        viewModel.updateJournalField { it.copy(morningIntention = valText) }
                    },
                    label = "Today's Core Purpose",
                    placeholder = "What is the single most important intention for today?",
                    singleLine = false,
                    maxLines = 3
                )
            }
        }

        // Gratitude & Wins
        item {
            LuxuryCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Favorite,
                            contentDescription = null,
                            tint = PriorityHigh,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Gratitude & Reflections",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontFamily = FontFamily.Serif,
                                fontWeight = FontWeight.SemiBold,
                                color = DeepObsidian
                            )
                        )
                    }

                    IconButton(
                        onClick = {
                            val list = entry.gratitude + ""
                            viewModel.updateJournalField { it.copy(gratitude = list) }
                        },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.AddCircleOutline,
                            contentDescription = "Add Gratitude Slot",
                            tint = ChampagneGoldDark
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))

                val gratitudeList = if (entry.gratitude.isEmpty()) listOf("", "", "") else entry.gratitude
                gratitudeList.forEachIndexed { index, text ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${index + 1}.",
                            style = MaterialTheme.typography.labelMedium.copy(
                                color = ChampagneGoldDark,
                                fontWeight = FontWeight.Bold
                            ),
                            modifier = Modifier.width(20.dp)
                        )
                        LuxuryTextField(
                            value = text,
                            onValueChange = { newText ->
                                val updatedList = gratitudeList.toMutableList()
                                updatedList[index] = newText
                                viewModel.updateJournalField { it.copy(gratitude = updatedList) }
                            },
                            label = "I am grateful for...",
                            singleLine = true,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // Evening Reflection
        item {
            LuxuryCard {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.NightsStay,
                        contentDescription = null,
                        tint = ChampagneGoldDark,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Evening Reflection & Notes",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontFamily = FontFamily.Serif,
                            fontWeight = FontWeight.SemiBold,
                            color = DeepObsidian
                        )
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                LuxuryTextField(
                    value = entry.eveningReflection,
                    onValueChange = { valText ->
                        viewModel.updateJournalField { it.copy(eveningReflection = valText) }
                    },
                    label = "Night Thoughts & Lessons",
                    placeholder = "What went well today? What can be refined tomorrow?",
                    singleLine = false,
                    maxLines = 4
                )
            }
        }

        // Wellness Vitals (Water & Sleep)
        item {
            IvoryCard {
                Text(
                    text = "Daily Vitals",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.SemiBold,
                        color = DeepObsidian
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))

                // Water Intake
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.WaterDrop,
                            contentDescription = null,
                            tint = ChampagneGoldDark,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Water Intake: ${entry.waterGlasses} Glasses",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium)
                        )
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = {
                                if (entry.waterGlasses > 0) {
                                    viewModel.updateJournalField { it.copy(waterGlasses = it.waterGlasses - 1) }
                                }
                            },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.Remove, contentDescription = "Decrease", tint = TextSecondaryDark)
                        }
                        IconButton(
                            onClick = {
                                if (entry.waterGlasses < 16) {
                                    viewModel.updateJournalField { it.copy(waterGlasses = it.waterGlasses + 1) }
                                }
                            },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "Increase", tint = ChampagneGoldDark)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))
                Divider(color = ChampagneGoldBorder, thickness = 0.5.dp)
                Spacer(modifier = Modifier.height(10.dp))

                // Sleep hours
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Hotel,
                            contentDescription = null,
                            tint = ChampagneGoldDark,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Sleep: ${entry.sleepHours} Hours",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Medium)
                        )
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = {
                                if (entry.sleepHours >= 0.5f) {
                                    viewModel.updateJournalField { it.copy(sleepHours = (it.sleepHours - 0.5f).coerceAtLeast(0f)) }
                                }
                            },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.Remove, contentDescription = "Decrease", tint = TextSecondaryDark)
                        }
                        IconButton(
                            onClick = {
                                if (entry.sleepHours < 16f) {
                                    viewModel.updateJournalField { it.copy(sleepHours = it.sleepHours + 0.5f) }
                                }
                            },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "Increase", tint = ChampagneGoldDark)
                        }
                    }
                }
            }
        }
    }
}
