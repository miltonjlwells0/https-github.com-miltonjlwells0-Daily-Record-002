package com.dailyrecord.app.data.local

import androidx.room.TypeConverter
import com.dailyrecord.app.data.model.*
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromStringList(value: List<String>?): String {
        return gson.toJson(value ?: emptyList<String>())
    }

    @TypeConverter
    fun toStringList(value: String?): List<String> {
        if (value.isNullOrEmpty()) return emptyList()
        val listType = object : TypeToken<List<String>>() {}.type
        return gson.fromJson(value, listType) ?: emptyList()
    }

    @TypeConverter
    fun fromGoalCategory(value: GoalCategory?): String = (value ?: GoalCategory.Personal).name

    @TypeConverter
    fun toGoalCategory(value: String?): GoalCategory =
        value?.let { runCatching { GoalCategory.valueOf(it) }.getOrNull() } ?: GoalCategory.Personal

    @TypeConverter
    fun fromGoalStatus(value: GoalStatus?): String = (value ?: GoalStatus.InProgress).name

    @TypeConverter
    fun toGoalStatus(value: String?): GoalStatus =
        value?.let { runCatching { GoalStatus.valueOf(it) }.getOrNull() } ?: GoalStatus.InProgress

    @TypeConverter
    fun fromProjectStatus(value: ProjectStatus?): String = (value ?: ProjectStatus.InProgress).name

    @TypeConverter
    fun toProjectStatus(value: String?): ProjectStatus =
        value?.let { runCatching { ProjectStatus.valueOf(it) }.getOrNull() } ?: ProjectStatus.InProgress

    @TypeConverter
    fun fromPriority(value: Priority?): String = (value ?: Priority.Medium).name

    @TypeConverter
    fun toPriority(value: String?): Priority =
        value?.let { runCatching { Priority.valueOf(it) }.getOrNull() } ?: Priority.Medium

    @TypeConverter
    fun fromTaskStatus(value: TaskStatus?): String = (value ?: TaskStatus.ToDo).name

    @TypeConverter
    fun toTaskStatus(value: String?): TaskStatus =
        value?.let { runCatching { TaskStatus.valueOf(it) }.getOrNull() } ?: TaskStatus.ToDo

    @TypeConverter
    fun fromTransactionType(value: TransactionType?): String = (value ?: TransactionType.Expense).name

    @TypeConverter
    fun toTransactionType(value: String?): TransactionType =
        value?.let { runCatching { TransactionType.valueOf(it) }.getOrNull() } ?: TransactionType.Expense

    @TypeConverter
    fun fromTransactionCategory(value: TransactionCategory?): String = (value ?: TransactionCategory.Other).name

    @TypeConverter
    fun toTransactionCategory(value: String?): TransactionCategory =
        value?.let { runCatching { TransactionCategory.valueOf(it) }.getOrNull() } ?: TransactionCategory.Other

    @TypeConverter
    fun fromMediaType(value: MediaType?): String = (value ?: MediaType.Book).name

    @TypeConverter
    fun toMediaType(value: String?): MediaType =
        value?.let { runCatching { MediaType.valueOf(it) }.getOrNull() } ?: MediaType.Book

    @TypeConverter
    fun fromMediaStatus(value: MediaStatus?): String = (value ?: MediaStatus.InProgress).name

    @TypeConverter
    fun toMediaStatus(value: String?): MediaStatus =
        value?.let { runCatching { MediaStatus.valueOf(it) }.getOrNull() } ?: MediaStatus.InProgress

    @TypeConverter
    fun fromTimeTrackerMode(value: TimeTrackerMode?): String = (value ?: TimeTrackerMode.Stopwatch).name

    @TypeConverter
    fun toTimeTrackerMode(value: String?): TimeTrackerMode =
        value?.let { runCatching { TimeTrackerMode.valueOf(it) }.getOrNull() } ?: TimeTrackerMode.Stopwatch

    @TypeConverter
    fun fromMoodType(value: MoodType?): String = (value ?: MoodType.Neutral).name

    @TypeConverter
    fun toMoodType(value: String?): MoodType =
        value?.let { runCatching { MoodType.valueOf(it) }.getOrNull() } ?: MoodType.Neutral
}
