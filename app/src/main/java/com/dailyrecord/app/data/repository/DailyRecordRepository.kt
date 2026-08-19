package com.dailyrecord.app.data.repository

import androidx.room.withTransaction
import com.dailyrecord.app.data.local.DailyRecordDatabase
import com.dailyrecord.app.data.local.entity.*
import com.dailyrecord.app.data.model.*
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class DailyRecordRepository(private val db: DailyRecordDatabase) {

    private val gson: Gson = GsonBuilder().setPrettyPrinting().create()

    // Goals
    val allGoals: Flow<List<GoalEntity>> = db.goalDao().getAllGoals()
    suspend fun insertGoal(goal: GoalEntity) = db.goalDao().insertGoal(goal)
    suspend fun updateGoal(goal: GoalEntity) = db.goalDao().updateGoal(goal)
    suspend fun deleteGoal(id: String) = db.goalDao().deleteGoalById(id)

    // Projects
    val allProjects: Flow<List<ProjectEntity>> = db.projectDao().getAllProjects()
    suspend fun insertProject(project: ProjectEntity) = db.projectDao().insertProject(project)
    suspend fun updateProject(project: ProjectEntity) = db.projectDao().updateProject(project)
    suspend fun deleteProject(id: String) = db.projectDao().deleteProjectById(id)

    // Tasks
    val allTasks: Flow<List<TaskEntity>> = db.taskDao().getAllTasks()
    fun getTasksForDate(date: String): Flow<List<TaskEntity>> = db.taskDao().getTasksForDate(date)
    suspend fun insertTask(task: TaskEntity) = db.taskDao().insertTask(task)
    suspend fun updateTask(task: TaskEntity) = db.taskDao().updateTask(task)
    suspend fun deleteTask(id: String) = db.taskDao().deleteTaskById(id)

    // Habits
    val habitDefinitions: Flow<List<HabitDefEntity>> = db.habitDao().getAllDefinitions()
    val allHabitDays: Flow<List<HabitDayEntity>> = db.habitDao().getAllHabitDays()
    fun getHabitDay(date: String): Flow<HabitDayEntity?> = db.habitDao().getHabitDay(date)
    suspend fun insertHabitDef(def: HabitDefEntity) = db.habitDao().insertDefinition(def)
    suspend fun deleteHabitDef(id: String) = db.habitDao().deleteDefinitionById(id)
    suspend fun toggleHabit(date: String, habitId: String) {
        val currentDay = db.habitDao().getHabitDay(date).first()
        val currentCompleted = currentDay?.completedHabitIds ?: emptyList()
        val newCompleted = if (currentCompleted.contains(habitId)) {
            currentCompleted.filter { it != habitId }
        } else {
            currentCompleted + habitId
        }
        db.habitDao().insertHabitDay(HabitDayEntity(date, newCompleted))
    }

    // Transactions
    val allTransactions: Flow<List<TransactionEntity>> = db.transactionDao().getAllTransactions()
    suspend fun insertTransaction(transaction: TransactionEntity) = db.transactionDao().insertTransaction(transaction)
    suspend fun deleteTransaction(id: String) = db.transactionDao().deleteTransactionById(id)

    // Time Logs
    val allTimeLogs: Flow<List<TimeLogEntity>> = db.timeLogDao().getAllTimeLogs()
    fun getTimeLogsForDate(date: String): Flow<List<TimeLogEntity>> = db.timeLogDao().getTimeLogsForDate(date)
    suspend fun insertTimeLog(log: TimeLogEntity) = db.timeLogDao().insertTimeLog(log)
    suspend fun updateTimeLog(log: TimeLogEntity) = db.timeLogDao().updateTimeLog(log)
    suspend fun deleteTimeLog(id: String) = db.timeLogDao().deleteTimeLogById(id)

    // Daily Journal
    val allJournals: Flow<List<DailyJournalEntity>> = db.dailyJournalDao().getAllJournals()
    fun getJournalForDate(date: String): Flow<DailyJournalEntity?> = db.dailyJournalDao().getJournalForDate(date)
    suspend fun saveDailyJournal(journal: DailyJournalEntity) = db.dailyJournalDao().insertOrUpdate(journal)
    suspend fun deleteJournal(date: String) = db.dailyJournalDao().deleteJournalByDate(date)

    // Weekly Reviews
    val allWeeklyReviews: Flow<List<WeeklyReviewEntity>> = db.weeklyReviewDao().getAllWeeklyReviews()
    suspend fun insertWeeklyReview(review: WeeklyReviewEntity) = db.weeklyReviewDao().insertWeeklyReview(review)
    suspend fun updateWeeklyReview(review: WeeklyReviewEntity) = db.weeklyReviewDao().updateWeeklyReview(review)
    suspend fun deleteWeeklyReview(id: String) = db.weeklyReviewDao().deleteWeeklyReviewById(id)

    // Scratchpad Notes
    val allScratchpadNotes: Flow<List<ScratchpadEntity>> = db.scratchpadDao().getAllNotes()
    suspend fun insertScratchpadNote(note: ScratchpadEntity) = db.scratchpadDao().insertNote(note)
    suspend fun updateScratchpadNote(note: ScratchpadEntity) = db.scratchpadDao().updateNote(note)
    suspend fun deleteScratchpadNote(id: String) = db.scratchpadDao().deleteNoteById(id)
    suspend fun convertNoteToTask(noteId: String, taskName: String, priority: Priority) {
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        val task = TaskEntity(
            id = UUID.randomUUID().toString(),
            name = taskName,
            dueDate = today,
            priority = priority,
            status = TaskStatus.ToDo,
            projectId = null
        )
        insertTask(task)
        deleteScratchpadNote(noteId)
    }

    // Media Logs
    val allMediaLogs: Flow<List<MediaLogEntity>> = db.mediaLogDao().getAllMedia()
    suspend fun insertMediaLog(media: MediaLogEntity) = db.mediaLogDao().insertMedia(media)
    suspend fun updateMediaLog(media: MediaLogEntity) = db.mediaLogDao().updateMedia(media)
    suspend fun deleteMediaLog(id: String) = db.mediaLogDao().deleteMediaById(id)

    // Settings
    val allSettings: Flow<List<SettingEntity>> = db.settingDao().getAllSettings()
    suspend fun setSetting(key: String, value: String) = db.settingDao().setSetting(SettingEntity(key, value))

    // JSON Export
    suspend fun exportAllDataJson(): String {
        val backup = BackupData(
            version = "1.1",
            exportedAt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).format(Date()),
            goals = db.goalDao().getAllGoals().first(),
            projects = db.projectDao().getAllProjects().first(),
            tasks = db.taskDao().getAllTasks().first(),
            habitDefs = db.habitDao().getAllDefinitions().first(),
            habitDays = db.habitDao().getAllHabitDays().first(),
            transactions = db.transactionDao().getAllTransactions().first(),
            mediaLogs = db.mediaLogDao().getAllMedia().first(),
            timeLogs = db.timeLogDao().getAllTimeLogs().first(),
            dailyJournals = db.dailyJournalDao().getAllJournals().first(),
            weeklyReviews = db.weeklyReviewDao().getAllWeeklyReviews().first(),
            scratchpadNotes = db.scratchpadDao().getAllNotes().first(),
            settings = db.settingDao().getAllSettings().first()
        )
        return gson.toJson(backup)
    }

    /**
     * Replaces the local database from a backup as one atomic Room transaction.
     * If any insert fails, Room rolls the entire restore back and the existing
     * database remains unchanged.
     *
     * Version 1.0 backups did not contain settings, so existing settings are
     * preserved when importing those older backups.
     */
    suspend fun importAllDataJson(jsonString: String): Boolean {
        return try {
            val data = gson.fromJson(jsonString, BackupData::class.java)
                ?: return false

            val existingSettings = db.settingDao().getAllSettings().first()
            val isCurrentBackup = data.version == "1.1"
            val isLegacyBackup = data.version == "1.0"

            if (!isCurrentBackup && !isLegacyBackup) return false

            db.withTransaction {
                // Restore means replace, not merge. This prevents stale records
                // that are absent from the backup from surviving the restore.
                db.goalDao().clearAll()
                db.projectDao().clearAll()
                db.taskDao().clearAll()
                db.habitDao().clearDefinitions()
                db.habitDao().clearHabitDays()
                db.transactionDao().clearAll()
                db.mediaLogDao().clearAll()
                db.timeLogDao().clearAll()
                db.dailyJournalDao().clearAll()
                db.weeklyReviewDao().clearAll()
                db.scratchpadDao().clearAll()
                db.settingDao().clearAll()

                if (data.goals.orEmpty().isNotEmpty()) db.goalDao().insertAll(data.goals.orEmpty())
                if (data.projects.orEmpty().isNotEmpty()) db.projectDao().insertAll(data.projects.orEmpty())
                if (data.tasks.orEmpty().isNotEmpty()) db.taskDao().insertAll(data.tasks.orEmpty())
                if (data.habitDefs.orEmpty().isNotEmpty()) db.habitDao().insertAllDefinitions(data.habitDefs.orEmpty())
                if (data.habitDays.orEmpty().isNotEmpty()) db.habitDao().insertAllHabitDays(data.habitDays.orEmpty())
                if (data.transactions.orEmpty().isNotEmpty()) db.transactionDao().insertAll(data.transactions.orEmpty())
                if (data.mediaLogs.orEmpty().isNotEmpty()) db.mediaLogDao().insertAll(data.mediaLogs.orEmpty())
                if (data.timeLogs.orEmpty().isNotEmpty()) db.timeLogDao().insertAll(data.timeLogs.orEmpty())
                if (data.dailyJournals.orEmpty().isNotEmpty()) db.dailyJournalDao().insertAll(data.dailyJournals.orEmpty())
                if (data.weeklyReviews.orEmpty().isNotEmpty()) db.weeklyReviewDao().insertAll(data.weeklyReviews.orEmpty())
                if (data.scratchpadNotes.orEmpty().isNotEmpty()) db.scratchpadDao().insertAll(data.scratchpadNotes.orEmpty())

                if (isCurrentBackup) {
                    if (data.settings.orEmpty().isNotEmpty()) {
                        db.settingDao().insertAll(data.settings.orEmpty())
                    }
                } else if (existingSettings.isNotEmpty()) {
                    db.settingDao().insertAll(existingSettings)
                }
            }

            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    // Clear all data
    suspend fun clearAllData() {
        db.withTransaction {
            db.goalDao().clearAll()
            db.projectDao().clearAll()
            db.taskDao().clearAll()
            db.habitDao().clearDefinitions()
            db.habitDao().clearHabitDays()
            db.transactionDao().clearAll()
            db.timeLogDao().clearAll()
            db.dailyJournalDao().clearAll()
            db.weeklyReviewDao().clearAll()
            db.scratchpadDao().clearAll()
            db.mediaLogDao().clearAll()
            db.settingDao().clearAll()
        }
    }
}
