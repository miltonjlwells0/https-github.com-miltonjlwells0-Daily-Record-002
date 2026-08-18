package com.dailyrecord.app.data.model

enum class GoalCategory {
    Career, Personal, Health, Finance, Learning
}

enum class GoalStatus {
    NotStarted, InProgress, Achieved;

    val displayName: String
        get() = when (this) {
            NotStarted -> "Not Started"
            InProgress -> "In Progress"
            Achieved -> "Achieved"
        }
}

enum class ProjectStatus {
    InProgress, OnHold, Completed;

    val displayName: String
        get() = when (this) {
            InProgress -> "In Progress"
            OnHold -> "On Hold"
            Completed -> "Completed"
        }
}

enum class Priority {
    High, Medium, Low
}

enum class TaskStatus {
    ToDo, Doing, Done;

    val displayName: String
        get() = when (this) {
            ToDo -> "To Do"
            Doing -> "Doing"
            Done -> "Done"
        }
}

enum class TransactionType {
    Income, Expense, Subscription
}

enum class TransactionCategory {
    Rent, Food, Salary, Entertainment, Investments, Other
}

enum class MediaType {
    Book, Article, Podcast, Course, Note
}

enum class MediaStatus {
    ToReadWatch, InProgress, Completed;

    val displayName: String
        get() = when (this) {
            ToReadWatch -> "To Read/Watch"
            InProgress -> "In Progress"
            Completed -> "Completed"
        }
}

enum class TimeTrackerMode {
    Stopwatch, Countdown, Manual
}

enum class MoodType {
    Great, Good, Neutral, Tired, Stressed;

    val displayName: String
        get() = when (this) {
            Great -> "Vibrant"
            Good -> "Good & Focused"
            Neutral -> "Balanced"
            Tired -> "Tired / Low Energy"
            Stressed -> "Overwhelmed"
        }

    val emoji: String
        get() = when (this) {
            Great -> "✨"
            Good -> "🌿"
            Neutral -> "☕"
            Tired -> "🌙"
            Stressed -> "🌧️"
        }
}

data class BackupData(
    val version: String = "1.1",
    val exportedAt: String = "",
    val goals: List<com.dailyrecord.app.data.local.entity.GoalEntity> = emptyList(),
    val projects: List<com.dailyrecord.app.data.local.entity.ProjectEntity> = emptyList(),
    val tasks: List<com.dailyrecord.app.data.local.entity.TaskEntity> = emptyList(),
    val habitDefs: List<com.dailyrecord.app.data.local.entity.HabitDefEntity> = emptyList(),
    val habitDays: List<com.dailyrecord.app.data.local.entity.HabitDayEntity> = emptyList(),
    val transactions: List<com.dailyrecord.app.data.local.entity.TransactionEntity> = emptyList(),
    val mediaLogs: List<com.dailyrecord.app.data.local.entity.MediaLogEntity> = emptyList(),
    val timeLogs: List<com.dailyrecord.app.data.local.entity.TimeLogEntity> = emptyList(),
    val dailyJournals: List<com.dailyrecord.app.data.local.entity.DailyJournalEntity> = emptyList(),
    val weeklyReviews: List<com.dailyrecord.app.data.local.entity.WeeklyReviewEntity> = emptyList(),
    val scratchpadNotes: List<com.dailyrecord.app.data.local.entity.ScratchpadEntity> = emptyList(),
    val settings: List<com.dailyrecord.app.data.local.entity.AppSettingEntity> = emptyList()
)
