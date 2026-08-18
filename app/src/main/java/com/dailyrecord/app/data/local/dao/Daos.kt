package com.dailyrecord.app.data.local.dao

import androidx.room.*
import com.dailyrecord.app.data.local.entity.*
import kotlinx.coroutines.flow.Flow

@Dao
interface GoalDao {
    @Query("SELECT * FROM goals ORDER BY targetDate ASC")
    fun getAllGoals(): Flow<List<GoalEntity>>

    @Query("SELECT * FROM goals WHERE id = :id")
    suspend fun getGoalById(id: String): GoalEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGoal(goal: GoalEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(goals: List<GoalEntity>)

    @Update
    suspend fun updateGoal(goal: GoalEntity)

    @Delete
    suspend fun deleteGoal(goal: GoalEntity)

    @Query("DELETE FROM goals WHERE id = :id")
    suspend fun deleteGoalById(id: String)

    @Query("DELETE FROM goals")
    suspend fun clearAll()
}

@Dao
interface ProjectDao {
    @Query("SELECT * FROM projects ORDER BY deadline ASC")
    fun getAllProjects(): Flow<List<ProjectEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProject(project: ProjectEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(projects: List<ProjectEntity>)

    @Update
    suspend fun updateProject(project: ProjectEntity)

    @Delete
    suspend fun deleteProject(project: ProjectEntity)

    @Query("DELETE FROM projects WHERE id = :id")
    suspend fun deleteProjectById(id: String)

    @Query("DELETE FROM projects")
    suspend fun clearAll()
}

@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks ORDER BY dueDate ASC")
    fun getAllTasks(): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE dueDate = :date")
    fun getTasksForDate(date: String): Flow<List<TaskEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTask(task: TaskEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(tasks: List<TaskEntity>)

    @Update
    suspend fun updateTask(task: TaskEntity)

    @Delete
    suspend fun deleteTask(task: TaskEntity)

    @Query("DELETE FROM tasks WHERE id = :id")
    suspend fun deleteTaskById(id: String)

    @Query("DELETE FROM tasks")
    suspend fun clearAll()
}

@Dao
interface HabitDao {
    @Query("SELECT * FROM habit_definitions")
    fun getAllDefinitions(): Flow<List<HabitDefEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDefinition(def: HabitDefEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAllDefinitions(defs: List<HabitDefEntity>)

    @Delete
    suspend fun deleteDefinition(def: HabitDefEntity)

    @Query("DELETE FROM habit_definitions WHERE id = :id")
    suspend fun deleteDefinitionById(id: String)

    @Query("SELECT * FROM habit_days WHERE date = :date")
    fun getHabitDay(date: String): Flow<HabitDayEntity?>

    @Query("SELECT * FROM habit_days")
    fun getAllHabitDays(): Flow<List<HabitDayEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHabitDay(day: HabitDayEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAllHabitDays(days: List<HabitDayEntity>)

    @Query("DELETE FROM habit_definitions")
    suspend fun clearDefinitions()

    @Query("DELETE FROM habit_days")
    suspend fun clearHabitDays()
}

@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions ORDER BY date DESC")
    fun getAllTransactions(): Flow<List<TransactionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaction(transaction: TransactionEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(transactions: List<TransactionEntity>)

    @Delete
    suspend fun deleteTransaction(transaction: TransactionEntity)

    @Query("DELETE FROM transactions WHERE id = :id")
    suspend fun deleteTransactionById(id: String)

    @Query("DELETE FROM transactions")
    suspend fun clearAll()
}

@Dao
interface TimeLogDao {
    @Query("SELECT * FROM time_logs ORDER BY completedAt DESC")
    fun getAllTimeLogs(): Flow<List<TimeLogEntity>>

    @Query("SELECT * FROM time_logs WHERE date = :date ORDER BY completedAt DESC")
    fun getTimeLogsForDate(date: String): Flow<List<TimeLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTimeLog(log: TimeLogEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(logs: List<TimeLogEntity>)

    @Update
    suspend fun updateTimeLog(log: TimeLogEntity)

    @Delete
    suspend fun deleteTimeLog(log: TimeLogEntity)

    @Query("DELETE FROM time_logs WHERE id = :id")
    suspend fun deleteTimeLogById(id: String)

    @Query("DELETE FROM time_logs")
    suspend fun clearAll()
}

@Dao
interface DailyJournalDao {
    @Query("SELECT * FROM daily_journals ORDER BY date DESC")
    fun getAllJournals(): Flow<List<DailyJournalEntity>>

    @Query("SELECT * FROM daily_journals WHERE date = :date")
    fun getJournalForDate(date: String): Flow<DailyJournalEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(entry: DailyJournalEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(entries: List<DailyJournalEntity>)

    @Query("DELETE FROM daily_journals WHERE date = :date")
    suspend fun deleteJournalByDate(date: String)

    @Query("DELETE FROM daily_journals")
    suspend fun clearAll()
}

@Dao
interface WeeklyReviewDao {
    @Query("SELECT * FROM weekly_reviews ORDER BY createdAt DESC")
    fun getAllWeeklyReviews(): Flow<List<WeeklyReviewEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWeeklyReview(review: WeeklyReviewEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(reviews: List<WeeklyReviewEntity>)

    @Update
    suspend fun updateWeeklyReview(review: WeeklyReviewEntity)

    @Delete
    suspend fun deleteWeeklyReview(review: WeeklyReviewEntity)

    @Query("DELETE FROM weekly_reviews WHERE id = :id")
    suspend fun deleteWeeklyReviewById(id: String)

    @Query("DELETE FROM weekly_reviews")
    suspend fun clearAll()
}

@Dao
interface ScratchpadDao {
    @Query("SELECT * FROM scratchpad_notes ORDER BY pinned DESC, updatedAt DESC")
    fun getAllNotes(): Flow<List<ScratchpadEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNote(note: ScratchpadEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(notes: List<ScratchpadEntity>)

    @Update
    suspend fun updateNote(note: ScratchpadEntity)

    @Delete
    suspend fun deleteNote(note: ScratchpadEntity)

    @Query("DELETE FROM scratchpad_notes WHERE id = :id")
    suspend fun deleteNoteById(id: String)

    @Query("DELETE FROM scratchpad_notes")
    suspend fun clearAll()
}

@Dao
interface MediaLogDao {
    @Query("SELECT * FROM media_logs ORDER BY title ASC")
    fun getAllMedia(): Flow<List<MediaLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMedia(media: MediaLogEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(media: List<MediaLogEntity>)

    @Update
    suspend fun updateMedia(media: MediaLogEntity)

    @Delete
    suspend fun deleteMedia(media: MediaLogEntity)

    @Query("DELETE FROM media_logs WHERE id = :id")
    suspend fun deleteMediaById(id: String)

    @Query("DELETE FROM media_logs")
    suspend fun clearAll()
}

@Dao
interface SettingDao {
    @Query("SELECT * FROM app_settings WHERE `key` = :key")
    suspend fun getSetting(key: String): SettingEntity?

    @Query("SELECT * FROM app_settings")
    fun getAllSettings(): Flow<List<SettingEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun setSetting(setting: SettingEntity)
}
