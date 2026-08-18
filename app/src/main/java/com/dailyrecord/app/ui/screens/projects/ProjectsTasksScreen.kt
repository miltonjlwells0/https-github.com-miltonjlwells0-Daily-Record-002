package com.dailyrecord.app.ui.screens.projects

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
import com.dailyrecord.app.data.local.entity.ProjectEntity
import com.dailyrecord.app.data.local.entity.TaskEntity
import com.dailyrecord.app.data.model.Priority
import com.dailyrecord.app.data.model.ProjectStatus
import com.dailyrecord.app.data.model.TaskStatus
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ProjectsTasksScreen(
    viewModel: DailyRecordViewModel
) {
    val tasks by viewModel.tasks.collectAsState()
    val projects by viewModel.projects.collectAsState()
    val goals by viewModel.goals.collectAsState()

    var activeTab by remember { mutableStateOf(0) } // 0: Tasks, 1: Projects
    var taskStatusFilter by remember { mutableStateOf<TaskStatus?>(null) }
    var taskPriorityFilter by remember { mutableStateOf<Priority?>(null) }

    var showAddTaskDialog by remember { mutableStateOf(false) }
    var showAddProjectDialog by remember { mutableStateOf(false) }
    var editingTask by remember { mutableStateOf<TaskEntity?>(null) }
    var editingProject by remember { mutableStateOf<ProjectEntity?>(null) }

    val filteredTasks = tasks.filter { task ->
        (taskStatusFilter == null || task.status == taskStatusFilter) &&
        (taskPriorityFilter == null || task.priority == taskPriorityFilter)
    }

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
                            text = "EXECUTION & TRACKING",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = ChampagneGold,
                                letterSpacing = 1.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Text(
                            text = if (activeTab == 0) "Tasks & Actions" else "Active Projects",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontFamily = FontFamily.Serif,
                                color = WarmIvory,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }

                    GoldButton(
                        text = if (activeTab == 0) "+ Task" else "+ Project",
                        onClick = {
                            if (activeTab == 0) showAddTaskDialog = true else showAddProjectDialog = true
                        }
                    )
                }
            }
        }

        // View Tabs (Tasks vs Projects)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                LuxuryChip(
                    text = "Action Items (${tasks.size})",
                    selected = activeTab == 0,
                    onClick = { activeTab = 0 },
                    modifier = Modifier.weight(1f)
                )
                LuxuryChip(
                    text = "Projects (${projects.size})",
                    selected = activeTab == 1,
                    onClick = { activeTab = 1 },
                    modifier = Modifier.weight(1f)
                )
            }
        }

        if (activeTab == 0) {
            // Task Filters
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    LuxuryChip(
                        text = "All",
                        selected = taskStatusFilter == null,
                        onClick = { taskStatusFilter = null }
                    )
                    TaskStatus.values().forEach { st ->
                        LuxuryChip(
                            text = st.displayName,
                            selected = taskStatusFilter == st,
                            onClick = { taskStatusFilter = st }
                        )
                    }
                }
            }

            // Tasks List
            if (filteredTasks.isEmpty()) {
                item {
                    LuxuryEmptyState(
                        title = "No tasks found",
                        description = "Create structured tasks with due dates and priority rankings.",
                        icon = Icons.Default.AssignmentTurnedIn,
                        actionText = "+ Add First Task",
                        onActionClick = { showAddTaskDialog = true }
                    )
                }
            } else {
                items(filteredTasks) { task ->
                    val linkedProj = projects.find { it.id == task.projectId }
                    val priorityColor = when (task.priority) {
                        Priority.High -> PriorityHigh
                        Priority.Medium -> PriorityMedium
                        Priority.Low -> PriorityLow
                    }

                    LuxuryCard(
                        contentPadding = PaddingValues(12.dp),
                        onClick = { editingTask = task }
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
                                Spacer(modifier = Modifier.width(6.dp))
                                Column {
                                    Text(
                                        text = task.name,
                                        style = MaterialTheme.typography.bodyLarge.copy(
                                            fontWeight = FontWeight.Medium,
                                            color = if (task.status == TaskStatus.Done) TextMutedDark else TextPrimaryDark
                                        )
                                    )
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = "Due: ${task.dueDate}",
                                            style = MaterialTheme.typography.bodyMedium.copy(
                                                fontSize = 11.sp,
                                                color = TextSecondaryDark
                                            )
                                        )
                                        if (linkedProj != null) {
                                            Text(
                                                text = " • Proj: ${linkedProj.name}",
                                                style = MaterialTheme.typography.bodyMedium.copy(
                                                    fontSize = 11.sp,
                                                    color = ChampagneGoldDark
                                                ),
                                                maxLines = 1
                                            )
                                        }
                                    }
                                }
                            }

                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(priorityColor.copy(alpha = 0.15f))
                                        .padding(horizontal = 6.dp, vertical = 3.dp)
                                ) {
                                    Text(
                                        text = task.priority.name,
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = priorityColor,
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    )
                                }

                                IconButton(
                                    onClick = { editingTask = task },
                                    modifier = Modifier.size(24.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Edit,
                                        contentDescription = "Edit",
                                        tint = TextMutedDark,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // Projects Tab
            if (projects.isEmpty()) {
                item {
                    LuxuryEmptyState(
                        title = "No active projects",
                        description = "Group related tasks under strategic projects linked to your goals.",
                        icon = Icons.Default.Folder,
                        actionText = "+ Create Project",
                        onActionClick = { showAddProjectDialog = true }
                    )
                }
            } else {
                items(projects) { project ->
                    val projTasks = tasks.filter { it.projectId == project.id }
                    val doneCount = projTasks.count { it.status == TaskStatus.Done }
                    val progressRatio = if (projTasks.isNotEmpty()) doneCount.toFloat() / projTasks.size else 0f
                    val linkedGoal = goals.find { it.id == project.goalId }

                    LuxuryCard(
                        contentPadding = PaddingValues(16.dp),
                        onClick = { editingProject = project }
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = project.status.displayName.uppercase(),
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = ChampagneGoldDark,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 10.sp
                                    )
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = project.name,
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontFamily = FontFamily.Serif,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                )
                                if (linkedGoal != null) {
                                    Text(
                                        text = "Goal: ${linkedGoal.name}",
                                        style = MaterialTheme.typography.bodyMedium.copy(
                                            fontSize = 11.sp,
                                            color = TextMutedDark
                                        )
                                    )
                                }
                            }

                            Text(
                                text = "Deadline: ${project.deadline}",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = TextSecondaryDark,
                                    fontSize = 11.sp
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "$doneCount of ${projTasks.size} tasks complete",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontSize = 12.sp,
                                    color = TextSecondaryDark
                                )
                            )
                            Text(
                                text = "${(progressRatio * 100).toInt()}%",
                                style = MaterialTheme.typography.labelLarge.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = ChampagneGoldDark
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(6.dp))
                        GoldProgressIndicator(progress = progressRatio)
                    }
                }
            }
        }
    }

    // Add Task Dialog
    if (showAddTaskDialog) {
        var taskName by remember { mutableStateOf("") }
        var dueDate by remember {
            mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()))
        }
        var priority by remember { mutableStateOf(Priority.Medium) }
        var selectedProjId by remember { mutableStateOf<String?>(null) }

        LuxuryDialog(
            onDismissRequest = { showAddTaskDialog = false },
            title = "New Task",
            confirmButton = {
                GoldButton(
                    text = "Add Task",
                    onClick = {
                        if (taskName.isNotBlank()) {
                            viewModel.addTask(
                                name = taskName.trim(),
                                dueDate = dueDate,
                                priority = priority,
                                projectId = selectedProjId
                            )
                            showAddTaskDialog = false
                        }
                    }
                )
            },
            dismissButton = {
                SecondaryButton(text = "Cancel", onClick = { showAddTaskDialog = false })
            }
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                LuxuryTextField(
                    value = taskName,
                    onValueChange = { taskName = it },
                    label = "Task Name",
                    placeholder = "e.g. Conduct weekly architectural review"
                )

                LuxuryTextField(
                    value = dueDate,
                    onValueChange = { dueDate = it },
                    label = "Due Date (YYYY-MM-DD)",
                    leadingIcon = Icons.Default.CalendarToday
                )

                Text("Priority", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Priority.values().forEach { pr ->
                        LuxuryChip(
                            text = pr.name,
                            selected = priority == pr,
                            onClick = { priority = pr }
                        )
                    }
                }

                if (projects.isNotEmpty()) {
                    Text("Linked Project (Optional)", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        LuxuryChip(
                            text = "None",
                            selected = selectedProjId == null,
                            onClick = { selectedProjId = null }
                        )
                        projects.forEach { proj ->
                            LuxuryChip(
                                text = proj.name,
                                selected = selectedProjId == proj.id,
                                onClick = { selectedProjId = proj.id }
                            )
                        }
                    }
                }
            }
        }
    }

    // Add Project Dialog
    if (showAddProjectDialog) {
        var projName by remember { mutableStateOf("") }
        var deadline by remember {
            mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()))
        }
        var selectedGoalId by remember { mutableStateOf<String?>(null) }

        LuxuryDialog(
            onDismissRequest = { showAddProjectDialog = false },
            title = "New Project",
            confirmButton = {
                GoldButton(
                    text = "Create",
                    onClick = {
                        if (projName.isNotBlank()) {
                            viewModel.addProject(
                                name = projName.trim(),
                                deadline = deadline,
                                goalId = selectedGoalId
                            )
                            showAddProjectDialog = false
                        }
                    }
                )
            },
            dismissButton = {
                SecondaryButton(text = "Cancel", onClick = { showAddProjectDialog = false })
            }
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                LuxuryTextField(
                    value = projName,
                    onValueChange = { projName = it },
                    label = "Project Name",
                    placeholder = "e.g. Q4 Asset Allocation Overhaul"
                )

                LuxuryTextField(
                    value = deadline,
                    onValueChange = { deadline = it },
                    label = "Target Deadline (YYYY-MM-DD)"
                )

                if (goals.isNotEmpty()) {
                    Text("Linked Goal (Optional)", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        LuxuryChip(
                            text = "None",
                            selected = selectedGoalId == null,
                            onClick = { selectedGoalId = null }
                        )
                        goals.forEach { goal ->
                            LuxuryChip(
                                text = goal.name,
                                selected = selectedGoalId == goal.id,
                                onClick = { selectedGoalId = goal.id }
                            )
                        }
                    }
                }
            }
        }
    }

    // Edit Task Dialog
    editingTask?.let { task ->
        var editName by remember(task) { mutableStateOf(task.name) }
        var editDueDate by remember(task) { mutableStateOf(task.dueDate) }
        var editPriority by remember(task) { mutableStateOf(task.priority) }
        var editStatus by remember(task) { mutableStateOf(task.status) }

        LuxuryDialog(
            onDismissRequest = { editingTask = null },
            title = "Edit Task",
            confirmButton = {
                GoldButton(
                    text = "Save",
                    onClick = {
                        viewModel.updateTask(
                            task.copy(
                                name = editName.trim(),
                                dueDate = editDueDate,
                                priority = editPriority,
                                status = editStatus
                            )
                        )
                        editingTask = null
                    }
                )
            },
            dismissButton = {
                OutlinedButton(
                    onClick = {
                        viewModel.deleteTask(task.id)
                        editingTask = null
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
                    label = "Task Name"
                )

                LuxuryTextField(
                    value = editDueDate,
                    onValueChange = { editDueDate = it },
                    label = "Due Date (YYYY-MM-DD)"
                )

                Text("Status", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    TaskStatus.values().forEach { st ->
                        LuxuryChip(
                            text = st.displayName,
                            selected = editStatus == st,
                            onClick = { editStatus = st }
                        )
                    }
                }

                Text("Priority", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Priority.values().forEach { pr ->
                        LuxuryChip(
                            text = pr.name,
                            selected = editPriority == pr,
                            onClick = { editPriority = pr }
                        )
                    }
                }
            }
        }
    }
}
