package com.dailyrecord.app.ui.screens.scratchpad

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dailyrecord.app.data.local.entity.ScratchpadEntity
import com.dailyrecord.app.data.model.Priority
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel

@Composable
fun ScratchpadScreen(
    viewModel: DailyRecordViewModel
) {
    val notes by viewModel.scratchpadNotes.collectAsState()

    var quickNoteText by remember { mutableStateOf("") }
    var editingNote by remember { mutableStateOf<ScratchpadEntity?>(null) }
    var convertNoteDialog by remember { mutableStateOf<ScratchpadEntity?>(null) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmIvory),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Header & Quick Capture
        item {
            ObsidianCard {
                Text(
                    text = "RAPID CAPTURE",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = ChampagneGold,
                        letterSpacing = 1.5.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
                Text(
                    text = "Quick Scratchpad",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontFamily = FontFamily.Serif,
                        color = WarmIvory,
                        fontWeight = FontWeight.Bold
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))

                LuxuryTextField(
                    value = quickNoteText,
                    onValueChange = { quickNoteText = it },
                    label = "Fleeting Idea / Scratchpad Memo",
                    placeholder = "Jot down ideas, links, quotes, or thoughts...",
                    singleLine = false,
                    maxLines = 3
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    GoldButton(
                        text = "Capture Note",
                        icon = Icons.Default.Add,
                        onClick = {
                            if (quickNoteText.isNotBlank()) {
                                viewModel.addScratchpadNote(quickNoteText.trim())
                                quickNoteText = ""
                            }
                        }
                    )
                }
            }
        }

        item {
            LuxurySectionHeader(title = "Captured Memos (${notes.size})")
        }

        if (notes.isEmpty()) {
            item {
                LuxuryEmptyState(
                    title = "No notes in scratchpad",
                    description = "Capture raw ideas instantly without cluttering your main task board.",
                    icon = Icons.Default.StickyNote2
                )
            }
        } else {
            items(notes) { note ->
                LuxuryCard(
                    contentPadding = PaddingValues(14.dp),
                    onClick = { editingNote = note }
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = note.content,
                                style = MaterialTheme.typography.bodyLarge.copy(
                                    color = DeepObsidian,
                                    lineHeight = 22.sp
                                )
                            )
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(
                                onClick = {
                                    viewModel.updateScratchpadNote(note.copy(pinned = !note.pinned))
                                },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(
                                    imageVector = if (note.pinned) Icons.Default.PushPin else Icons.Default.PushPin,
                                    contentDescription = "Pin Note",
                                    tint = if (note.pinned) ChampagneGoldDark else TextMutedDark,
                                    modifier = Modifier.size(16.dp)
                                )
                            }

                            IconButton(
                                onClick = { convertNoteDialog = note },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.ArrowForward,
                                    contentDescription = "Convert to Task",
                                    tint = ChampagneGoldDark,
                                    modifier = Modifier.size(16.dp)
                                )
                            }

                            IconButton(
                                onClick = { viewModel.deleteScratchpadNote(note.id) },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.DeleteOutline,
                                    contentDescription = "Delete Note",
                                    tint = TextMutedDark,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // Convert Note to Task Dialog
    convertNoteDialog?.let { note ->
        var taskTitle by remember(note) { mutableStateOf(note.content) }
        var priority by remember { mutableStateOf(Priority.Medium) }

        LuxuryDialog(
            onDismissRequest = { convertNoteDialog = null },
            title = "Convert Memo to Task",
            confirmButton = {
                GoldButton(
                    text = "Convert to Task",
                    onClick = {
                        viewModel.convertNoteToTask(note.id, taskTitle.trim(), priority)
                        convertNoteDialog = null
                    }
                )
            },
            dismissButton = {
                SecondaryButton(text = "Cancel", onClick = { convertNoteDialog = null })
            }
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                LuxuryTextField(
                    value = taskTitle,
                    onValueChange = { taskTitle = it },
                    label = "Task Name",
                    singleLine = false,
                    maxLines = 3
                )

                Text("Task Priority", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Priority.values().forEach { pr ->
                        LuxuryChip(
                            text = pr.name,
                            selected = priority == pr,
                            onClick = { priority = pr }
                        )
                    }
                }
            }
        }
    }
}
