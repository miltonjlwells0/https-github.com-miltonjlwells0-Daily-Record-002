package com.dailyrecord.app

import android.app.Application
import com.dailyrecord.app.data.local.DailyRecordDatabase
import com.dailyrecord.app.data.repository.DailyRecordRepository

class DailyRecordApplication : Application() {
    val database: DailyRecordDatabase by lazy { DailyRecordDatabase.getDatabase(this) }
    val repository: DailyRecordRepository by lazy { DailyRecordRepository(database) }
}
