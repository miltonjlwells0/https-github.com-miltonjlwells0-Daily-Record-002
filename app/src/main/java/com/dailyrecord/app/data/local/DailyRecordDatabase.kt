package com.dailyrecord.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.dailyrecord.app.data.local.dao.*
import com.dailyrecord.app.data.local.entity.*
import kotlinx.coroutines.CoroutineScope

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

        fun getDatabase(
            context: Context,
            scope: CoroutineScope = CoroutineScope(kotlinx.coroutines.Dispatchers.IO)
        ): DailyRecordDatabase {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    DailyRecordDatabase::class.java,
                    "daily_record_database"
                )
                    .build()
                    .also { INSTANCE = it }
            }
        }
    }
}
