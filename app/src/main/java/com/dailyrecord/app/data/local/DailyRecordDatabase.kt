package com.dailyrecord.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase
import com.dailyrecord.app.data.local.dao.*
import com.dailyrecord.app.data.local.entity.*
import com.dailyrecord.app.data.model.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

@Database(
    entities = [
        GoalEntity::class,
        ProjectEntity::class,
        TaskEntity::class,
        HabitDefEntity::class,
        HabitDayEntity::class,
        TransactionEntity::class,
        TimeLogEntity::class,
        DailyJournalEntity::class,
        WeeklyReviewEntity::class,
        ScratchpadEntity::class,
        MediaLogEntity::class,
        SettingEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class DailyRecordDatabase : RoomDatabase() {

    abstract fun goalDao(): GoalDao
    abstract fun projectDao(): ProjectDao
    abstract fun taskDao(): TaskDao
    abstract fun habitDao(): HabitDao
    abstract fun transactionDao(): TransactionDao
    abstract fun timeLogDao(): TimeLogDao
    abstract fun dailyJournalDao(): DailyJournalDao
    abstract fun weeklyReviewDao(): WeeklyReviewDao
    abstract fun scratchpadDao(): ScratchpadDao
    abstract fun mediaLogDao(): MediaLogDao
    abstract fun settingDao(): SettingDao

    companion object {
        @Volatile
        private var INSTANCE: DailyRecordDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope = CoroutineScope(Dispatchers.IO)): DailyRecordDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    DailyRecordDatabase::class.java,
                    "daily_record_database"
                )
                    .addCallback(DatabaseCallback(scope))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch {
                        populateInitialData(database)
                    }
                }
            }

            private suspend fun populateInitialData(db: DailyRecordDatabase) {
                val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
                val nowIso = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).format(Date())

                // Initial Goals
                val goal1 = GoalEntity("g1", "Learn AI & Native Android", GoalCategory.Learning, "2026-12-31", GoalStatus.InProgress, 45)
                val goal2 = GoalEntity("g2", "Master Financial Freedom", GoalCategory.Finance, "2026-11-01", GoalStatus.InProgress, 60)
                db.goalDao().insertAll(listOf(goal1, goal2))

                // Initial Projects
                val proj1 = ProjectEntity("p1", "Daily Record Android Build", ProjectStatus.InProgress, "2026-08-30", "g1")
                val proj2 = ProjectEntity("p2", "Personal Wealth Allocation", ProjectStatus.InProgress, "2026-10-15", "g2")
                db.projectDao().insertAll(listOf(proj1, proj2))

                // Initial Tasks
                val task1 = TaskEntity("t1", "Design Obsidian Élite Dashboard UI", today, Priority.High, TaskStatus.Doing, "p1")
                val task2 = TaskEntity("t2", "Review monthly savings allocation", today, Priority.Medium, TaskStatus.ToDo, "p2")
                val task3 = TaskEntity("t3", "Read chapter on mindful productivity", today, Priority.Low, TaskStatus.ToDo, null)
                db.taskDao().insertAll(listOf(task1, task2, task3))

                // Initial Habits
                val habit1 = HabitDefEntity("h1", "Morning Meditation", "🧘")
                val habit2 = HabitDefEntity("h2", "Deep Focus (45m)", "⚡")
                val habit3 = HabitDefEntity("h3", "Hydrate (8 Glasses)", "💧")
                val habit4 = HabitDefEntity("h4", "Evening Reflection", "🌙")
                db.habitDao().insertAllDefinitions(listOf(habit1, habit2, habit3, habit4))
                db.habitDao().insertHabitDay(HabitDayEntity(today, listOf("h1", "h3")))

                // Initial Transactions
                val tr1 = TransactionEntity("tr1", "Consulting Retainer", 5000.0, TransactionType.Income, TransactionCategory.Salary, today)
                val tr2 = TransactionEntity("tr2", "Studio Workspace Rent", 1450.0, TransactionType.Expense, TransactionCategory.Rent, today)
                val tr3 = TransactionEntity("tr3", "Research Subscriptions", 29.99, TransactionType.Subscription, TransactionCategory.Entertainment, today)
                db.transactionDao().insertAll(listOf(tr1, tr2, tr3))

                // Initial Time Logs
                val tl1 = TimeLogEntity(
                    "tl1",
                    "Design Obsidian Élite Dashboard UI",
                    "Deep Work",
                    today,
                    3000L,
                    TimeTrackerMode.Countdown,
                    3000L,
                    "Completed native Android Jetpack Compose architecture and luxurious Obsidian styling.",
                    nowIso,
                    "t1"
                )
                val tl2 = TimeLogEntity(
                    "tl2",
                    "Architecture & Data Modeling",
                    "Coding",
                    today,
                    1500L,
                    TimeTrackerMode.Stopwatch,
                    null,
                    "Constructed Room Database entities, DAOs, and repository layer.",
                    nowIso,
                    null
                )
                db.timeLogDao().insertAll(listOf(tl1, tl2))

                // Initial Daily Journals (Includes Reference Image Entry)
                val journalRef = DailyJournalEntity(
                    date = "2024-05-15",
                    mood = MoodType.Great,
                    energyLevel = 5,
                    morningIntention = "Let's make today count. Focused progress and intentional deep work.",
                    eveningReflection = "Grateful for the progress I made today. Consistency is the key.",
                    gratitude = listOf("Grateful for the progress I made today. Consistency is the key.", "Calm morning mindset and productive momentum", "Unbroken habit streak and disciplined routine"),
                    waterGlasses = 8,
                    sleepHours = 8.0f,
                    tags = listOf("consistency", "progress", "gratitude", "reflection")
                )
                val journalToday = DailyJournalEntity(
                    date = today,
                    mood = MoodType.Great,
                    energyLevel = 4,
                    morningIntention = "Cultivate clarity, disciplined focus, and architectural craftsmanship.",
                    eveningReflection = "Accomplished full offline-native persistence and refined Obsidian Élite theme.",
                    gratitude = listOf("Clear morning focus", "Reliable offline tools", "Quiet creative space"),
                    waterGlasses = 6,
                    sleepHours = 7.5f,
                    tags = listOf("focus", "craftsmanship", "clarity")
                )
                db.dailyJournalDao().insertOrUpdate(journalRef)
                db.dailyJournalDao().insertOrUpdate(journalToday)

                // Initial Scratchpad Notes
                val note1 = ScratchpadEntity(
                    "sn1",
                    "Review quarterly asset allocations and optimize emergency liquidity reserves.",
                    "#FEF3C7",
                    true,
                    nowIso,
                    nowIso
                )
                val note2 = ScratchpadEntity(
                    "sn2",
                    "Core Reading List: 'Deep Work' by Cal Newport, 'Atomic Habits', 'The Psychology of Money'.",
                    "#E0E7FF",
                    false,
                    nowIso,
                    nowIso
                )
                db.scratchpadDao().insertAll(listOf(note1, note2))

                // Initial Media Logs
                val m1 = MediaLogEntity("m1", "Deep Work: Rules for Focused Success", MediaType.Book, MediaStatus.InProgress, 5)
                val m2 = MediaLogEntity("m2", "Jetpack Compose Architecture & StateFlow", MediaType.Article, MediaStatus.Completed, 5)
                db.mediaLogDao().insertAll(listOf(m1, m2))
            }
        }
    }
}
