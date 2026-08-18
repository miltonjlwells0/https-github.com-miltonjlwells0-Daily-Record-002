package com.dailyrecord.app.ui.screens.settings

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(
    viewModel: DailyRecordViewModel
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    val goals by viewModel.goals.collectAsState()
    val projects by viewModel.projects.collectAsState()
    val tasks by viewModel.tasks.collectAsState()
    val habitDefs by viewModel.habitDefs.collectAsState()
    val timeLogs by viewModel.timeLogs.collectAsState()
    val transactions by viewModel.transactions.collectAsState()
    val journals by viewModel.dailyJournals.collectAsState()
    val reviews by viewModel.weeklyReviews.collectAsState()

    var showExportDialog by remember { mutableStateOf(false) }
    var showImportDialog by remember { mutableStateOf(false) }
    var showResetDialog by remember { mutableStateOf(false) }
    var exportJsonString by remember { mutableStateOf("") }
    var importJsonInput by remember { mutableStateOf("") }

    val totalRecords = goals.size + projects.size + tasks.size + habitDefs.size +
            timeLogs.size + transactions.size + journals.size + reviews.size

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmIvory),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Header
        item {
            ObsidianCard {
                Text(
                    text = "APPLICATION & ARCHITECTURE",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = ChampagneGold,
                        letterSpacing = 1.5.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
                Text(
                    text = "Settings & Vault",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontFamily = FontFamily.Serif,
                        color = WarmIvory,
                        fontWeight = FontWeight.Bold
                    )
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "100% Offline-First Native Android SQLite Room Database",
                    style = MaterialTheme.typography.bodyMedium.copy(color = TextMutedLight)
                )
            }
        }

        // Offline Database Stats
        item {
            IvoryCard {
                Text(
                    text = "Local Storage Inventory",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.Bold,
                        color = DeepObsidian
                    )
                )
                Spacer(modifier = Modifier.height(10.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Total Entities Stored:", style = MaterialTheme.typography.bodyMedium)
                    Text("$totalRecords Items", style = MaterialTheme.typography.labelLarge.copy(color = ChampagneGoldDark))
                }
                Spacer(modifier = Modifier.height(4.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Goals / Projects / Tasks:", style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondaryDark))
                    Text("${goals.size} / ${projects.size} / ${tasks.size}", style = MaterialTheme.typography.bodyMedium)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Focus Logs & Journals:", style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondaryDark))
                    Text("${timeLogs.size} / ${journals.size}", style = MaterialTheme.typography.bodyMedium)
                }
            }
        }

        // Backup & Restore
        item {
            LuxuryCard {
                Text(
                    text = "Data Vault & Backup",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.Bold,
                        color = DeepObsidian
                    )
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Export your entire state as standard JSON or restore from an existing backup with full fidelity.",
                    style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondaryDark)
                )
                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    GoldButton(
                        text = "Export JSON",
                        icon = Icons.Default.FileDownload,
                        onClick = {
                            scope.launch {
                                exportJsonString = viewModel.exportJson()
                                showExportDialog = true
                            }
                        },
                        modifier = Modifier.weight(1f)
                    )

                    SecondaryButton(
                        text = "Import JSON",
                        icon = Icons.Default.FileUpload,
                        onClick = {
                            importJsonInput = ""
                            showImportDialog = true
                        },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // Danger Zone: Reset
        item {
            LuxuryCard(borderColor = PriorityHigh.copy(alpha = 0.3f)) {
                Text(
                    text = "Database Management",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.Bold,
                        color = DeepObsidian
                    )
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Clear all local Room entities and reset to an empty state.",
                    style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondaryDark)
                )
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedButton(
                    onClick = { showResetDialog = true },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PriorityHigh),
                    border = androidx.compose.foundation.BorderStroke(1.dp, PriorityHigh.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.DeleteSweep, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Clear All Local Data", style = MaterialTheme.typography.labelLarge)
                }
            }
        }

        // Architecture Specs
        item {
            ObsidianCard {
                Text(
                    text = "NATIVE SYSTEM DIAGNOSTICS",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = ChampagneGold,
                        fontWeight = FontWeight.Bold
                    )
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text("• Framework: Android Jetpack Compose 2024.10", color = WarmIvoryLight, fontSize = 12.sp)
                Text("• Architecture: Single Activity + ViewModels + Flow", color = WarmIvoryLight, fontSize = 12.sp)
                Text("• Persistence: Android Room SQLite (Offline-First)", color = WarmIvoryLight, fontSize = 12.sp)
                Text("• Visual Archetype: Obsidian Élite Luxury System", color = WarmIvoryLight, fontSize = 12.sp)
                Text("• Target SDK: Android 15 (API 35)", color = WarmIvoryLight, fontSize = 12.sp)
            }
        }
    }

    // Export Dialog
    if (showExportDialog) {
        LuxuryDialog(
            onDismissRequest = { showExportDialog = false },
            title = "Export Vault JSON",
            confirmButton = {
                GoldButton(
                    text = "Copy to Clipboard",
                    icon = Icons.Default.ContentCopy,
                    onClick = {
                        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        val clip = ClipData.newPlainText("DailyRecord_Backup", exportJsonString)
                        clipboard.setPrimaryClip(clip)
                        showExportDialog = false
                    }
                )
            },
            dismissButton = {
                SecondaryButton(text = "Close", onClick = { showExportDialog = false })
            }
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Backup payload generated (${exportJsonString.length} bytes):",
                    style = MaterialTheme.typography.bodyMedium
                )
                LuxuryTextField(
                    value = exportJsonString,
                    onValueChange = {},
                    label = "JSON Payload",
                    singleLine = false,
                    maxLines = 8
                )
            }
        }
    }

    // Import Dialog
    if (showImportDialog) {
        LuxuryDialog(
            onDismissRequest = { showImportDialog = false },
            title = "Restore Vault JSON",
            confirmButton = {
                GoldButton(
                    text = "Restore Data",
                    onClick = {
                        if (importJsonInput.isNotBlank()) {
                            viewModel.importJson(importJsonInput.trim()) { success ->
                                if (success) showImportDialog = false
                            }
                        }
                    }
                )
            },
            dismissButton = {
                SecondaryButton(text = "Cancel", onClick = { showImportDialog = false })
            }
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Paste a previously exported JSON backup payload to restore your database records:",
                    style = MaterialTheme.typography.bodyMedium
                )
                LuxuryTextField(
                    value = importJsonInput,
                    onValueChange = { importJsonInput = it },
                    label = "Paste Backup JSON Here",
                    placeholder = "{ \"version\": \"1.0\", ... }",
                    singleLine = false,
                    maxLines = 8
                )
            }
        }
    }

    // Reset Confirmation Dialog
    if (showResetDialog) {
        LuxuryDialog(
            onDismissRequest = { showResetDialog = false },
            title = "Confirm Reset",
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.resetDatabase()
                        showResetDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PriorityHigh)
                ) {
                    Text("Wipe Database", color = WarmIvory)
                }
            },
            dismissButton = {
                SecondaryButton(text = "Cancel", onClick = { showResetDialog = false })
            }
        ) {
            Text(
                text = "Are you sure you want to delete all goals, tasks, journals, and focus logs? This action cannot be undone unless you have a JSON backup.",
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}
