package com.dailyrecord.app.ui.screens.review

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.dailyrecord.app.data.local.entity.WeeklyReviewEntity
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun WeeklyReviewScreen(
    viewModel: DailyRecordViewModel
) {
    val weeklyReviews by viewModel.weeklyReviews.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }

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
                            text = "STRATEGIC REFLECTION",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = ChampagneGold,
                                letterSpacing = 1.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Text(
                            text = "Thinking & Review",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontFamily = FontFamily.Serif,
                                color = WarmIvory,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }

                    GoldButton(
                        text = "+ Review",
                        onClick = { showAddDialog = true }
                    )
                }
            }
        }

        // Reviews List
        if (weeklyReviews.isEmpty()) {
            item {
                LuxuryEmptyState(
                    title = "No weekly reviews logged",
                    description = "Take 15 minutes each Sunday to evaluate high-leverage wins, bottlenecks, and next week's focus.",
                    icon = Icons.Default.Psychology,
                    actionText = "+ Conduct Weekly Review",
                    onActionClick = { showAddDialog = true }
                )
            }
        } else {
            items(weeklyReviews) { review ->
                LuxuryCard(contentPadding = PaddingValues(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = review.weekLabel,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontFamily = FontFamily.Serif,
                                    fontWeight = FontWeight.Bold,
                                    color = DeepObsidian
                                )
                            )
                            Text(
                                text = "${review.startDate} – ${review.endDate}",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontSize = 11.sp,
                                    color = TextMutedDark
                                )
                            )
                        }

                        IconButton(
                            onClick = { viewModel.deleteWeeklyReview(review.id) },
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

                    Spacer(modifier = Modifier.height(10.dp))
                    Divider(color = ChampagneGoldBorder, thickness = 0.5.dp)
                    Spacer(modifier = Modifier.height(10.dp))

                    // Wins section
                    Text(
                        text = "KEY WINS & BREAKTHROUGHS",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = ChampagneGoldDark,
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp
                        )
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = review.wins.ifBlank { "No specific wins recorded." },
                        style = MaterialTheme.typography.bodyMedium.copy(color = TextPrimaryDark)
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Bottlenecks
                    Text(
                        text = "FRICTIONS & BOTTLENECK ANALYSIS",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = PriorityHigh,
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp
                        )
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = review.bottlenecks.ifBlank { "No bottlenecks identified." },
                        style = MaterialTheme.typography.bodyMedium.copy(color = TextPrimaryDark)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Scores
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Productivity: ${review.productivityRating}/10",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = ChampagneGoldDark,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Text(
                            text = "Wellness: ${review.wellnessRating}/10",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = StatusCompleted,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                }
            }
        }
    }

    // Add Review Dialog
    if (showAddDialog) {
        var weekLabel by remember { mutableStateOf("Week ${Calendar.getInstance().get(Calendar.WEEK_OF_YEAR)} Review") }
        var wins by remember { mutableStateOf("") }
        var bottlenecks by remember { mutableStateOf("") }
        var productivityRating by remember { mutableStateOf(8) }
        var wellnessRating by remember { mutableStateOf(8) }

        val today = remember { SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()) }

        LuxuryDialog(
            onDismissRequest = { showAddDialog = false },
            title = "Weekly Review",
            confirmButton = {
                GoldButton(
                    text = "Save Review",
                    onClick = {
                        if (wins.isNotBlank() || bottlenecks.isNotBlank()) {
                            viewModel.addWeeklyReview(
                                weekLabel = weekLabel.trim(),
                                startDate = today,
                                endDate = today,
                                wins = wins.trim(),
                                bottlenecks = bottlenecks.trim(),
                                nextWeekPriorities = emptyList(),
                                productivityRating = productivityRating,
                                wellnessRating = wellnessRating,
                                notes = null
                            )
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
                    value = weekLabel,
                    onValueChange = { weekLabel = it },
                    label = "Review Title"
                )

                LuxuryTextField(
                    value = wins,
                    onValueChange = { wins = it },
                    label = "Major Wins & High-Leverage Milestones",
                    placeholder = "What went extraordinarily well?",
                    singleLine = false,
                    maxLines = 3
                )

                LuxuryTextField(
                    value = bottlenecks,
                    onValueChange = { bottlenecks = it },
                    label = "Frictions, Bottlenecks & Distractions",
                    placeholder = "What slowed momentum down?",
                    singleLine = false,
                    maxLines = 3
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Productivity Rating: $productivityRating/10", style = MaterialTheme.typography.bodyMedium)
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        IconButton(
                            onClick = { if (productivityRating > 1) productivityRating-- },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(Icons.Default.Remove, contentDescription = null, tint = TextSecondaryDark)
                        }
                        IconButton(
                            onClick = { if (productivityRating < 10) productivityRating++ },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null, tint = ChampagneGoldDark)
                        }
                    }
                }
            }
        }
    }
}
