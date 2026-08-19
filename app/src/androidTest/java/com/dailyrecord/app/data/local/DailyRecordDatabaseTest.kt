package com.dailyrecord.app.data.local

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.dailyrecord.app.data.local.entity.DailyJournalEntity
import com.dailyrecord.app.data.local.entity.GoalEntity
import com.dailyrecord.app.data.model.GoalCategory
import com.dailyrecord.app.data.model.GoalStatus
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class DailyRecordDatabaseTest {
    private lateinit var db: DailyRecordDatabase

    @Before
    fun setUp() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        db = Room.inMemoryDatabaseBuilder(context, DailyRecordDatabase::class.java)
            .allowMainThreadQueries()
            .build()
    }

    @After
    fun tearDown() {
        db.close()
    }

    @Test
    fun journal_create_update_and_delete_persists_through_dao() = runBlocking {
        val journalDao = db.dailyJournalDao()
        val date = "2026-08-18"

        journalDao.insertOrUpdate(
            DailyJournalEntity(
                date = date,
                morningIntention = "Build Daily Record",
                eveningReflection = "Initial entry",
                waterGlasses = 4
            )
        )

        val created = journalDao.getJournalForDateOnce(date)
        assertEquals("Build Daily Record", created?.morningIntention)
        assertEquals(4, created?.waterGlasses)

        journalDao.insertOrUpdate(created!!.copy(waterGlasses = 8))
        assertEquals(8, journalDao.getJournalForDateOnce(date)?.waterGlasses)

        journalDao.deleteJournalByDate(date)
        assertNull(journalDao.getJournalForDateOnce(date))
    }

    @Test
    fun goal_create_update_and_delete_persists_through_dao() = runBlocking {
        val goalDao = db.goalDao()
        val goal = GoalEntity(
            id = "test-goal",
            name = "Offline goal",
            category = GoalCategory.Personal,
            targetDate = "2026-12-31",
            status = GoalStatus.InProgress,
            progress = 25
        )

        goalDao.insertGoal(goal)
        assertEquals(goal, goalDao.getGoalById(goal.id))

        goalDao.updateGoal(goal.copy(progress = 75))
        assertEquals(75, goalDao.getGoalById(goal.id)?.progress)

        goalDao.deleteGoalById(goal.id)
        assertNull(goalDao.getGoalById(goal.id))
    }

    @Test
    fun journal_flow_emits_persisted_value() = runBlocking {
        val dao = db.dailyJournalDao()
        val date = "2026-08-19"
        dao.insertOrUpdate(DailyJournalEntity(date = date, gratitude = listOf("Consistency")))

        val observed = dao.getJournalForDate(date).first()
        assertEquals(listOf("Consistency"), observed?.gratitude)
    }
}
