package com.dailyrecord.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.dailyrecord.app.data.model.*

@Entity(tableName = "goals")
data class GoalEntity(
    @PrimaryKey val id: String,
    val name: String,
    val category: GoalCategory,
    val targetDate: String,
    val status: GoalStatus = GoalStatus.InProgress,
    val progress: Int = 0
)

@Entity(tableName = "projects")
data class ProjectEntity(
    @PrimaryKey val id: String,
    val name: String,
    val status: ProjectStatus = ProjectStatus.InProgress,
    val deadline: String,
    val goalId: String? = null
)

@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey val id: String,
    val name: String,
    val dueDate: String,
    val priority: Priority = Priority.Medium,
    val status: TaskStatus = TaskStatus.ToDo,
    val projectId: String? = null
)

@Entity(tableName = "habit_definitions")
data class HabitDefEntity(
    @PrimaryKey val id: String,
    val name: String,
    val icon: String = "✨"
)

@Entity(tableName = "habit_days")
data class HabitDayEntity(
    @PrimaryKey val date: String, // YYYY-MM-DD
    val completedHabitIds: List<String> = emptyList()
)

@Entity(tableName = "transactions")
data class TransactionEntity(
    @PrimaryKey val id: String,
    val item: String,
    val amount: Double,
    val type: TransactionType,
    val category: TransactionCategory,
    val date: String // YYYY-MM-DD
)

@Entity(tableName = "media_logs")
data class MediaLogEntity(
    @PrimaryKey val id: String,
    val title: String,
    val type: MediaType,
    val status: MediaStatus,
    val rating: Int = 0,
    val coverImage: String? = null
)

@Entity(tableName = "time_logs")
data class TimeLogEntity(
    @PrimaryKey val id: String,
    val taskName: String,
    val category: String,
    val date: String, // YYYY-MM-DD
    val durationSeconds: Long,
    val mode: TimeTrackerMode,
    val targetSeconds: Long? = null,
    val notes: String? = null,
    val completedAt: String,
    val taskId: String? = null
)

@Entity(tableName = "daily_journals")
data class DailyJournalEntity(
    @PrimaryKey val date: String, // YYYY-MM-DD
    val mood: MoodType = MoodType.Neutral,
    val energyLevel: Int = 3, // 1-5
    val morningIntention: String = "",
    val eveningReflection: String = "",
    val gratitude: List<String> = emptyList(),
    val waterGlasses: Int = 0,
    val sleepHours: Float = 7.0f,
    val tags: List<String> = emptyList()
)

@Entity(tableName = "weekly_reviews")
data class WeeklyReviewEntity(
    @PrimaryKey val id: String,
    val weekLabel: String,
    val startDate: String,
    val endDate: String,
    val wins: String,
    val bottlenecks: String,
    val nextWeekPriorities: List<String> = emptyList(),
    val productivityRating: Int = 5,
    val wellnessRating: Int = 4,
    val notes: String? = null,
    val createdAt: String
)

@Entity(tableName = "scratchpad_notes")
data class ScratchpadEntity(
    @PrimaryKey val id: String,
    val content: String,
    val color: String = "#FEF3C7",
    val pinned: Boolean = false,
    val createdAt: String,
    val updatedAt: String
)

@Entity(tableName = "app_settings")
data class SettingEntity(
    @PrimaryKey val key: String,
    val value: String
)
