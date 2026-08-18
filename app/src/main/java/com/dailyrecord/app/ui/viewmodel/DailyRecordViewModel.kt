package com.dailyrecord.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dailyrecord.app.data.local.entity.*
import com.dailyrecord.app.data.model.*
import com.dailyrecord.app.data.repository.DailyRecordRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

data class TimerUiState(
    val mode: TimeTrackerMode = TimeTrackerMode.Countdown,
    val taskName: String = "",
    val category: String = "Deep Work",
    val selectedTaskId: String? = null,
    val presetSeconds: Long = 1500L, // 25 mins
    val secondsRemaining: Long = 1500L,
    val secondsElapsed: Long = 0L,
    val isRunning: Boolean = false,
    val isFinishedAlert: Boolean = false,
    val sessionNotes: String = "",
    val markTaskDoneOnFinish: Boolean = false,
    val startTimeTimestampMs: Long = 0L
)

class DailyRecordViewModel(
    private val repository: DailyRecordRepository
) : ViewModel() {

    private val _currentDate = MutableStateFlow(getTodayDateString())
    val currentDate: StateFlow<String> = _currentDate.asStateFlow()

    // Data Flows from Room
    val goals: StateFlow<List<GoalEntity>> = repository.allGoals
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val projects: StateFlow<List<ProjectEntity>> = repository.allProjects
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val tasks: StateFlow<List<TaskEntity>> = repository.allTasks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val habitDefs: StateFlow<List<HabitDefEntity>> = repository.habitDefinitions
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val habitDays: StateFlow<List<HabitDayEntity>> = repository.allHabitDays
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val transactions: StateFlow<List<TransactionEntity>> = repository.allTransactions
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val timeLogs: StateFlow<List<TimeLogEntity>> = repository.allTimeLogs
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val dailyJournals: StateFlow<List<DailyJournalEntity>> = repository.allJournals
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val weeklyReviews: StateFlow<List<WeeklyReviewEntity>> = repository.allWeeklyReviews
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val scratchpadNotes: StateFlow<List<ScratchpadEntity>> = repository.allScratchpadNotes
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val mediaLogs: StateFlow<List<MediaLogEntity>> = repository.allMediaLogs
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Selected Date Journal
    val selectedJournalDate = MutableStateFlow(getTodayDateString())
    val currentJournal: StateFlow<DailyJournalEntity?> = selectedJournalDate
        .flatMapLatest { date -> repository.getJournalForDate(date) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // User message/toast
    private val _userMessage = MutableStateFlow<String?>(null)
    val userMessage: StateFlow<String?> = _userMessage.asStateFlow()

    fun clearUserMessage() {
        _userMessage.value = null
    }

    // Timer State & Logic
    private val _timerState = MutableStateFlow(TimerUiState())
    val timerState: StateFlow<TimerUiState> = _timerState.asStateFlow()
    private var timerJob: Job? = null

    init {
        // Daily check
        _currentDate.value = getTodayDateString()
    }

    // Timer Controls
    fun setTimerMode(mode: TimeTrackerMode) {
        pauseTimer()
        _timerState.update {
            it.copy(
                mode = mode,
                secondsElapsed = 0L,
                secondsRemaining = it.presetSeconds,
                isFinishedAlert = false
            )
        }
    }

    fun setTimerPreset(minutes: Int) {
        val secs = minutes * 60L
        _timerState.update {
            it.copy(
                presetSeconds = secs,
                secondsRemaining = if (!it.isRunning) secs else it.secondsRemaining,
                secondsElapsed = if (!it.isRunning) 0L else it.secondsElapsed,
                isFinishedAlert = false
            )
        }
    }

    fun setTimerTaskName(name: String) {
        _timerState.update { it.copy(taskName = name, selectedTaskId = null) }
    }

    fun setTimerCategory(cat: String) {
        _timerState.update { it.copy(category = cat) }
    }

    fun setTimerLinkedTask(task: TaskEntity?) {
        _timerState.update {
            it.copy(
                selectedTaskId = task?.id,
                taskName = task?.name ?: it.taskName
            )
        }
    }

    fun setTimerSessionNotes(notes: String) {
        _timerState.update { it.copy(sessionNotes = notes) }
    }

    fun setTimerMarkTaskDone(mark: Boolean) {
        _timerState.update { it.copy(markTaskDoneOnFinish = mark) }
    }

    fun toggleTimer() {
        if (_timerState.value.isRunning) {
            pauseTimer()
        } else {
            startTimer()
        }
    }

    private fun startTimer() {
        val now = System.currentTimeMillis()
        _timerState.update {
            it.copy(
                isRunning = true,
                isFinishedAlert = false,
                startTimeTimestampMs = now
            )
        }
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (_timerState.value.isRunning) {
                delay(1000L)
                _timerState.update { current ->
                    if (!current.isRunning) return@update current
                    if (current.mode == TimeTrackerMode.Stopwatch) {
                        current.copy(secondsElapsed = current.secondsElapsed + 1L)
                    } else {
                        val remaining = current.secondsRemaining - 1L
                        if (remaining <= 0L) {
                            current.copy(
                                secondsRemaining = 0L,
                                secondsElapsed = current.secondsElapsed + 1L,
                                isRunning = false,
                                isFinishedAlert = true
                            )
                        } else {
                            current.copy(
                                secondsRemaining = remaining,
                                secondsElapsed = current.secondsElapsed + 1L
                            )
                        }
                    }
                }
            }
        }
    }

    fun pauseTimer() {
        timerJob?.cancel()
        timerJob = null
        _timerState.update { it.copy(isRunning = false) }
    }

    fun resetTimer() {
        pauseTimer()
        _timerState.update {
            it.copy(
                secondsRemaining = it.presetSeconds,
                secondsElapsed = 0L,
                isFinishedAlert = false
            )
        }
    }

    fun saveTimerSession() {
        val current = _timerState.value
        val duration = if (current.mode == TimeTrackerMode.Countdown && current.secondsRemaining == 0L) {
            current.presetSeconds
        } else {
            current.secondsElapsed
        }

        if (duration <= 0L) return

        val title = current.taskName.ifBlank { "Focus Session" }
        val nowIso = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).format(Date())

        val log = TimeLogEntity(
            id = UUID.randomUUID().toString(),
            taskName = title,
            category = current.category,
            date = getTodayDateString(),
            durationSeconds = duration,
            mode = current.mode,
            targetSeconds = if (current.mode == TimeTrackerMode.Countdown) current.presetSeconds else null,
            notes = current.sessionNotes.ifBlank { null },
            completedAt = nowIso,
            taskId = current.selectedTaskId
        )

        viewModelScope.launch {
            repository.insertTimeLog(log)
            if (current.selectedTaskId != null && current.markTaskDoneOnFinish) {
                val task = tasks.value.find { it.id == current.selectedTaskId }
                if (task != null) {
                    repository.updateTask(task.copy(status = TaskStatus.Done))
                }
            }
            _userMessage.value = "Focus session logged successfully"
            resetTimer()
            _timerState.update { it.copy(sessionNotes = "") }
        }
    }

    fun addManualTimeLog(taskName: String, category: String, date: String, minutes: Int, notes: String?) {
        viewModelScope.launch {
            val log = TimeLogEntity(
                id = UUID.randomUUID().toString(),
                taskName = taskName.ifBlank { "Focus Session" },
                category = category,
                date = date,
                durationSeconds = (minutes * 60).toLong(),
                mode = TimeTrackerMode.Manual,
                targetSeconds = null,
                notes = notes?.ifBlank { null },
                completedAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).format(Date())
            )
            repository.insertTimeLog(log)
            _userMessage.value = "Manual time entry added"
        }
    }

    fun deleteTimeLog(id: String) {
        viewModelScope.launch {
            repository.deleteTimeLog(id)
            _userMessage.value = "Time log deleted"
        }
    }

    // Daily Journal Actions
    fun setSelectedJournalDate(date: String) {
        selectedJournalDate.value = date
    }

    fun saveJournal(journal: DailyJournalEntity) {
        viewModelScope.launch {
            repository.saveDailyJournal(journal)
            _userMessage.value = "Journal saved"
        }
    }

    fun updateJournalField(update: (DailyJournalEntity) -> DailyJournalEntity) {
        val date = selectedJournalDate.value
        val existing = currentJournal.value ?: DailyJournalEntity(date = date)
        val updated = update(existing)
        viewModelScope.launch {
            repository.saveDailyJournal(updated)
        }
    }

    // Goals Actions
    fun addGoal(name: String, category: GoalCategory, targetDate: String, progress: Int = 0) {
        viewModelScope.launch {
            val goal = GoalEntity(
                id = UUID.randomUUID().toString(),
                name = name,
                category = category,
                targetDate = targetDate,
                status = if (progress >= 100) GoalStatus.Achieved else GoalStatus.InProgress,
                progress = progress
            )
            repository.insertGoal(goal)
            _userMessage.value = "Goal created"
        }
    }

    fun updateGoal(goal: GoalEntity) {
        viewModelScope.launch {
            val updated = if (goal.progress >= 100) goal.copy(status = GoalStatus.Achieved) else goal
            repository.updateGoal(updated)
        }
    }

    fun deleteGoal(id: String) {
        viewModelScope.launch {
            repository.deleteGoal(id)
            _userMessage.value = "Goal removed"
        }
    }

    // Projects Actions
    fun addProject(name: String, deadline: String, goalId: String? = null) {
        viewModelScope.launch {
            val project = ProjectEntity(
                id = UUID.randomUUID().toString(),
                name = name,
                status = ProjectStatus.InProgress,
                deadline = deadline,
                goalId = goalId
            )
            repository.insertProject(project)
            _userMessage.value = "Project created"
        }
    }

    fun updateProject(project: ProjectEntity) {
        viewModelScope.launch {
            repository.updateProject(project)
        }
    }

    fun deleteProject(id: String) {
        viewModelScope.launch {
            repository.deleteProject(id)
            _userMessage.value = "Project removed"
        }
    }

    // Tasks Actions
    fun addTask(name: String, dueDate: String, priority: Priority, projectId: String? = null) {
        viewModelScope.launch {
            val task = TaskEntity(
                id = UUID.randomUUID().toString(),
                name = name,
                dueDate = dueDate,
                priority = priority,
                status = TaskStatus.ToDo,
                projectId = projectId
            )
            repository.insertTask(task)
            _userMessage.value = "Task created"
        }
    }

    fun updateTask(task: TaskEntity) {
        viewModelScope.launch {
            repository.updateTask(task)
        }
    }

    fun deleteTask(id: String) {
        viewModelScope.launch {
            repository.deleteTask(id)
            _userMessage.value = "Task removed"
        }
    }

    // Habits Actions
    fun addHabitDef(name: String, icon: String = "✨") {
        viewModelScope.launch {
            val def = HabitDefEntity(
                id = UUID.randomUUID().toString(),
                name = name,
                icon = icon
            )
            repository.insertHabitDef(def)
            _userMessage.value = "Habit added"
        }
    }

    fun deleteHabitDef(id: String) {
        viewModelScope.launch {
            repository.deleteHabitDef(id)
            _userMessage.value = "Habit removed"
        }
    }

    fun toggleHabit(date: String, habitId: String) {
        viewModelScope.launch {
            repository.toggleHabit(date, habitId)
        }
    }

    // Finance Actions
    fun addTransaction(item: String, amount: Double, type: TransactionType, category: TransactionCategory, date: String) {
        viewModelScope.launch {
            val tr = TransactionEntity(
                id = UUID.randomUUID().toString(),
                item = item,
                amount = amount,
                type = type,
                category = category,
                date = date
            )
            repository.insertTransaction(tr)
            _userMessage.value = "Transaction recorded"
        }
    }

    fun deleteTransaction(id: String) {
        viewModelScope.launch {
            repository.deleteTransaction(id)
            _userMessage.value = "Transaction removed"
        }
    }

    // Weekly Review Actions
    fun addWeeklyReview(
        weekLabel: String,
        startDate: String,
        endDate: String,
        wins: String,
        bottlenecks: String,
        nextWeekPriorities: List<String>,
        productivityRating: Int,
        wellnessRating: Int,
        notes: String?
    ) {
        viewModelScope.launch {
            val review = WeeklyReviewEntity(
                id = UUID.randomUUID().toString(),
                weekLabel = weekLabel,
                startDate = startDate,
                endDate = endDate,
                wins = wins,
                bottlenecks = bottlenecks,
                nextWeekPriorities = nextWeekPriorities,
                productivityRating = productivityRating,
                wellnessRating = wellnessRating,
                notes = notes,
                createdAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).format(Date())
            )
            repository.insertWeeklyReview(review)
            _userMessage.value = "Weekly review saved"
        }
    }

    fun deleteWeeklyReview(id: String) {
        viewModelScope.launch {
            repository.deleteWeeklyReview(id)
            _userMessage.value = "Review removed"
        }
    }

    // Scratchpad Actions
    fun addScratchpadNote(content: String, color: String = "#FEF3C7") {
        viewModelScope.launch {
            val nowIso = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).format(Date())
            val note = ScratchpadEntity(
                id = UUID.randomUUID().toString(),
                content = content,
                color = color,
                pinned = false,
                createdAt = nowIso,
                updatedAt = nowIso
            )
            repository.insertScratchpadNote(note)
            _userMessage.value = "Quick note captured"
        }
    }

    fun updateScratchpadNote(note: ScratchpadEntity) {
        viewModelScope.launch {
            val nowIso = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).format(Date())
            repository.updateScratchpadNote(note.copy(updatedAt = nowIso))
        }
    }

    fun deleteScratchpadNote(id: String) {
        viewModelScope.launch {
            repository.deleteScratchpadNote(id)
            _userMessage.value = "Note removed"
        }
    }

    fun convertNoteToTask(noteId: String, taskName: String, priority: Priority) {
        viewModelScope.launch {
            repository.convertNoteToTask(noteId, taskName, priority)
            _userMessage.value = "Converted note to task"
        }
    }

    // Knowledge Base Media Actions
    fun addMediaLog(title: String, type: MediaType, status: MediaStatus, rating: Int = 0) {
        viewModelScope.launch {
            val media = MediaLogEntity(
                id = UUID.randomUUID().toString(),
                title = title,
                type = type,
                status = status,
                rating = rating
            )
            repository.insertMediaLog(media)
            _userMessage.value = "Item added to second brain"
        }
    }

    fun updateMediaLog(media: MediaLogEntity) {
        viewModelScope.launch {
            repository.updateMediaLog(media)
        }
    }

    fun deleteMediaLog(id: String) {
        viewModelScope.launch {
            repository.deleteMediaLog(id)
            _userMessage.value = "Item deleted"
        }
    }

    // Backup & Restore
    suspend fun exportJson(): String = repository.exportAllDataJson()

    fun importJson(json: String, onResult: (Boolean) -> Unit) {
        viewModelScope.launch {
            val success = repository.importAllDataJson(json)
            if (success) {
                _userMessage.value = "Data restored successfully"
            } else {
                _userMessage.value = "Failed to restore backup data"
            }
            onResult(success)
        }
    }

    fun resetDatabase() {
        viewModelScope.launch {
            repository.clearAllData()
            _userMessage.value = "Database reset to empty state"
        }
    }

    companion object {
        fun getTodayDateString(): String {
            return SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        }
    }
}
