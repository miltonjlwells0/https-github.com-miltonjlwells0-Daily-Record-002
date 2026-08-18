package com.dailyrecord.app.ui.screens.goals

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
import com.dailyrecord.app.data.local.entity.GoalEntity
import com.dailyrecord.app.data.model.GoalCategory
import com.dailyrecord.app.data.model.GoalStatus
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun GoalsScreen(
    viewModel: DailyRecordViewModel
) {
    val goals by viewModel.goals.collectAsState()
    val projects by viewModel.projects.collectAsState()

    var selectedCategoryFilter by remember { mutableStateOf<GoalCategory?>(null) }
    var selectedStatusFilter by remember { mutableStateOf<GoalStatus?>(null) }
    var showAddDialog by remember { mutableStateOf(false) }
    var editingGoal by remember { mutableStateOf<GoalEntity?>(null) }

    val filteredGoals = goals.filter { goal ->
        (selectedCategoryFilter == null || goal.category == selectedCategoryFilter) &&
        (selectedStatusFilter == null || goal.status == selectedStatusFilter)
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmIvory),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Goals Header Card
        item {
            ObsidianCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "STRATEGIC VISION",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = ChampagneGold,
                                letterSpacing = 1.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Text(
                            text = "Goals & Milestones",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontFamily = FontFamily.Serif,
                                color = WarmIvory,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }

                    GoldButton(
                        text = "+ Goal",
                        onClick = { showAddDialog = true }
                    )
                }
            }
        }

        // Category Filter Chips
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Filter by Pillar",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = ChampagneGoldDark,
                        fontWeight = FontWeight.Bold
                    )
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    LuxuryChip(
                        text = "All",
                        selected = selectedCategoryFilter == null,
                        onClick = { selectedCategoryFilter = null }
                    )
                    GoalCategory.values().forEach { cat ->
                        LuxuryChip(
                            text = cat.name,
                            selected = selectedCategoryFilter == cat,
                            onClick = { selectedCategoryFilter = cat }
                        )
                    }
                }
            }
        }

        // Goals List
        if (filteredGoals.isEmpty()) {
            item {
                LuxuryEmptyState(
                    title = "No Goals in this View",
                    description = "Formulate high-impact objectives to direct your daily focus and projects.",
                    icon = Icons.Default.TrackChanges,
                    actionText = "+ Formulate Goal",
                    onActionClick = { showAddDialog = true }
                )
            }
        } else {
            items(filteredGoals) { goal ->
                val linkedProjects = projects.filter { it.goalId == goal.id }
                LuxuryCard(
                    contentPadding = PaddingValues(16.dp),
                    onClick = { editingGoal = goal }
                ) {
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
                                        text = goal.category.name.uppercase(),
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = ChampagneGoldDark,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 9.sp
                                        )
                                    )
                                }
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Target: ${goal.targetDate}",
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        fontSize = 11.sp,
                                        color = TextMutedDark
                                    )
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = goal.name,
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontFamily = FontFamily.Serif,
                                    fontWeight = FontWeight.SemiBold,
                                    color = DeepObsidian
                                )
                            )
                        }

                        IconButton(
                            onClick = { editingGoal = goal },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.MoreVert,
                                contentDescription = "Edit Goal",
                                tint = TextSecondaryDark
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (goal.progress >= 100) "Status: Achieved" else "Progress",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = if (goal.progress >= 100) StatusCompleted else TextSecondaryDark,
                                fontWeight = FontWeight.SemiBold
                            )
                        )
                        Text(
                            text = "${goal.progress}%",
                            style = MaterialTheme.typography.labelLarge.copy(
                                fontWeight = FontWeight.Bold,
                                color = ChampagneGoldDark
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    GoldProgressIndicator(progress = goal.progress / 100f)

                    // Quick Progress Buttons (+10%, -10%, Mark Done)
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedButton(
                            onClick = {
                                val next = (goal.progress - 10).coerceAtLeast(0)
                                viewModel.updateGoal(goal.copy(progress = next))
                            },
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                            modifier = Modifier.height(30.dp),
                            shape = RoundedCornerShape(8.dp),
                            border = androidx.compose.foundation.BorderStroke(0.5.dp, ChampagneGoldBorder)
                        ) {
                            Text("-10%", fontSize = 10.sp, color = TextPrimaryDark)
                        }
                        OutlinedButton(
                            onClick = {
                                val next = (goal.progress + 10).coerceAtMost(100)
                                viewModel.updateGoal(goal.copy(progress = next))
                            },
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                            modifier = Modifier.height(30.dp),
                            shape = RoundedCornerShape(8.dp),
                            border = androidx.compose.foundation.BorderStroke(0.5.dp, ChampagneGoldBorder)
                        ) {
                            Text("+10%", fontSize = 10.sp, color = TextPrimaryDark)
                        }

                        Spacer(modifier = Modifier.weight(1f))

                        if (linkedProjects.isNotEmpty()) {
                            Text(
                                text = "${linkedProjects.size} Linked Projects",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 11.sp,
                                    color = ChampagneGoldDark
                                )
                            )
                        }
                    }
                }
            }
        }
    }

    // Add Goal Dialog
    if (showAddDialog) {
        var goalName by remember { mutableStateOf("") }
        var category by remember { mutableStateOf(GoalCategory.Career) }
        var targetDate by remember {
            mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()))
        }
        var initialProgress by remember { mutableStateOf("0") }

        LuxuryDialog(
            onDismissRequest = { showAddDialog = false },
            title = "Create New Goal",
            confirmButton = {
                GoldButton(
                    text = "Save Goal",
                    onClick = {
                        if (goalName.isNotBlank()) {
                            viewModel.addGoal(
                                name = goalName.trim(),
                                category = category,
                                targetDate = targetDate,
                                progress = initialProgress.toIntOrNull()?.coerceIn(0, 100) ?: 0
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
                    value = goalName,
                    onValueChange = { goalName = it },
                    label = "Goal Title",
                    placeholder = "e.g. Master High-Performance Android Development"
                )

                Text(
                    text = "Category",
                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    GoalCategory.values().forEach { cat ->
                        LuxuryChip(
                            text = cat.name,
                            selected = category == cat,
                            onClick = { category = cat }
                        )
                    }
                }

                LuxuryTextField(
                    value = targetDate,
                    onValueChange = { targetDate = it },
                    label = "Target Date (YYYY-MM-DD)",
                    leadingIcon = Icons.Default.Event
                )

                LuxuryTextField(
                    value = initialProgress,
                    onValueChange = { initialProgress = it },
                    label = "Current Progress (%)"
                )
            }
        }
    }

    // Edit Goal Dialog
    editingGoal?.let { goal ->
        var editName by remember(goal) { mutableStateOf(goal.name) }
        var editCategory by remember(goal) { mutableStateOf(goal.category) }
        var editTargetDate by remember(goal) { mutableStateOf(goal.targetDate) }
        var editProgress by remember(goal) { mutableStateOf(goal.progress.toString()) }

        LuxuryDialog(
            onDismissRequest = { editingGoal = null },
            title = "Edit Goal",
            confirmButton = {
                GoldButton(
                    text = "Update",
                    onClick = {
                        val prog = editProgress.toIntOrNull()?.coerceIn(0, 100) ?: goal.progress
                        viewModel.updateGoal(
                            goal.copy(
                                name = editName.trim(),
                                category = editCategory,
                                targetDate = editTargetDate,
                                progress = prog,
                                status = if (prog >= 100) GoalStatus.Achieved else GoalStatus.InProgress
                            )
                        )
                        editingGoal = null
                    }
                )
            },
            dismissButton = {
                OutlinedButton(
                    onClick = {
                        viewModel.deleteGoal(goal.id)
                        editingGoal = null
                    },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PriorityHigh),
                    border = androidx.compose.foundation.BorderStroke(1.dp, PriorityHigh.copy(alpha = 0.5f))
                ) {
                    Text("Delete")
                }
            }
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                LuxuryTextField(
                    value = editName,
                    onValueChange = { editName = it },
                    label = "Goal Title"
                )

                Text(
                    text = "Category",
                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    GoalCategory.values().forEach { cat ->
                        LuxuryChip(
                            text = cat.name,
                            selected = editCategory == cat,
                            onClick = { editCategory = cat }
                        )
                    }
                }

                LuxuryTextField(
                    value = editTargetDate,
                    onValueChange = { editTargetDate = it },
                    label = "Target Date (YYYY-MM-DD)"
                )

                LuxuryTextField(
                    value = editProgress,
                    onValueChange = { editProgress = it },
                    label = "Progress (%)"
                )
            }
        }
    }
}
