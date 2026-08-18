package com.dailyrecord.app.ui.screens.knowledge

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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dailyrecord.app.data.local.entity.MediaLogEntity
import com.dailyrecord.app.data.model.MediaStatus
import com.dailyrecord.app.data.model.MediaType
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel

@Composable
fun KnowledgeBaseScreen(
    viewModel: DailyRecordViewModel
) {
    val mediaLogs by viewModel.mediaLogs.collectAsState()

    var showAddDialog by remember { mutableStateOf(false) }
    var selectedTypeFilter by remember { mutableStateOf<MediaType?>(null) }

    val filteredMedia = mediaLogs.filter { item ->
        selectedTypeFilter == null || item.type == selectedTypeFilter
    }

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
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "INTELLECTUAL CAPITAL",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = ChampagneGold,
                                letterSpacing = 1.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Text(
                            text = "Second Brain & Media",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontFamily = FontFamily.Serif,
                                color = WarmIvory,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }

                    GoldButton(
                        text = "+ Resource",
                        onClick = { showAddDialog = true }
                    )
                }
            }
        }

        // Type Filter Chips
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                LuxuryChip(
                    text = "All (${mediaLogs.size})",
                    selected = selectedTypeFilter == null,
                    onClick = { selectedTypeFilter = null }
                )
                MediaType.values().forEach { type ->
                    LuxuryChip(
                        text = type.name,
                        selected = selectedTypeFilter == type,
                        onClick = { selectedTypeFilter = type }
                    )
                }
            }
        }

        // Media List
        if (filteredMedia.isEmpty()) {
            item {
                LuxuryEmptyState(
                    title = "No intellectual assets logged",
                    description = "Catalog books, research articles, courses, and podcasts for continuous learning.",
                    icon = Icons.Default.MenuBook,
                    actionText = "+ Add First Item",
                    onActionClick = { showAddDialog = true }
                )
            }
        } else {
            items(filteredMedia) { media ->
                val icon = when (media.type) {
                    MediaType.Book -> Icons.Default.MenuBook
                    MediaType.Article -> Icons.Default.Article
                    MediaType.Podcast -> Icons.Default.Podcasts
                    MediaType.Course -> Icons.Default.School
                    MediaType.Note -> Icons.Default.Description
                }

                LuxuryCard(contentPadding = PaddingValues(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(ChampagneGold.copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = null,
                                    tint = ChampagneGoldDark,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = media.title,
                                    style = MaterialTheme.typography.bodyLarge.copy(
                                        fontWeight = FontWeight.SemiBold,
                                        color = DeepObsidian
                                    )
                                )
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = "${media.type.name} • ${media.status.displayName}",
                                        style = MaterialTheme.typography.bodyMedium.copy(
                                            fontSize = 11.sp,
                                            color = TextSecondaryDark
                                        )
                                    )
                                    if (media.rating > 0) {
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = "★".repeat(media.rating),
                                            style = MaterialTheme.typography.bodyMedium.copy(
                                                fontSize = 11.sp,
                                                color = ChampagneGoldDark
                                            )
                                        )
                                    }
                                }
                            }
                        }

                        IconButton(
                            onClick = { viewModel.deleteMediaLog(media.id) },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.DeleteOutline,
                                contentDescription = "Delete",
                                tint = TextMutedDark,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }
        }
    }

    // Add Media Dialog
    if (showAddDialog) {
        var title by remember { mutableStateOf("") }
        var type by remember { mutableStateOf(MediaType.Book) }
        var status by remember { mutableStateOf(MediaStatus.InProgress) }
        var rating by remember { mutableStateOf(5) }

        LuxuryDialog(
            onDismissRequest = { showAddDialog = false },
            title = "Add Learning Resource",
            confirmButton = {
                GoldButton(
                    text = "Save Resource",
                    onClick = {
                        if (title.isNotBlank()) {
                            viewModel.addMediaLog(
                                title = title.trim(),
                                type = type,
                                status = status,
                                rating = rating
                            )
                            showAddDialog = false
                        }
                    }
                )
            },
            dismissButton = {
                SecondaryButton(text = "Cancel", onClick = { showAddDialog = false })
            }
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                LuxuryTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = "Title / Course Name",
                    placeholder = "e.g. Clean Architecture in Jetpack Compose"
                )

                Text("Resource Type", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    MediaType.values().forEach { t ->
                        LuxuryChip(
                            text = t.name,
                            selected = type == t,
                            onClick = { type = t }
                        )
                    }
                }

                Text("Status", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    MediaStatus.values().forEach { s ->
                        LuxuryChip(
                            text = s.displayName,
                            selected = status == s,
                            onClick = { status = s }
                        )
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Rating: $rating / 5 Stars", style = MaterialTheme.typography.bodyMedium)
                    Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                        (1..5).forEach { star ->
                            IconButton(
                                onClick = { rating = star },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Text(
                                    text = if (star <= rating) "★" else "☆",
                                    color = ChampagneGoldDark,
                                    fontSize = 18.sp
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
