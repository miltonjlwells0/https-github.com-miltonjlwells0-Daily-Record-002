package com.dailyrecord.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.dailyrecord.app.ui.navigation.AppNavigation
import com.dailyrecord.app.ui.theme.DailyRecordTheme
import com.dailyrecord.app.ui.theme.WarmIvory
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import com.dailyrecord.app.ui.viewmodel.ViewModelFactory

class MainActivity : ComponentActivity() {

    private val viewModel: DailyRecordViewModel by viewModels {
        val app = application as DailyRecordApplication
        ViewModelFactory(app.repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DailyRecordTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = WarmIvory
                ) {
                    AppNavigation(viewModel = viewModel)
                }
            }
        }
    }
}
