package com.dailyrecord.app.ui.screens.finance

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
import com.dailyrecord.app.data.model.TransactionCategory
import com.dailyrecord.app.data.model.TransactionType
import com.dailyrecord.app.ui.components.*
import com.dailyrecord.app.ui.theme.*
import com.dailyrecord.app.ui.viewmodel.DailyRecordViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun FinanceScreen(
    viewModel: DailyRecordViewModel
) {
    val transactions by viewModel.transactions.collectAsState()

    var showAddDialog by remember { mutableStateOf(false) }
    var selectedTypeFilter by remember { mutableStateOf<TransactionType?>(null) }

    val totalIncome = transactions.filter { it.type == TransactionType.Income }.sumOf { it.amount }
    val totalExpenses = transactions.filter { it.type == TransactionType.Expense || it.type == TransactionType.Subscription }.sumOf { it.amount }
    val netBalance = totalIncome - totalExpenses

    val filteredTransactions = transactions.filter { tr ->
        selectedTypeFilter == null || tr.type == selectedTypeFilter
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
                            text = "WEALTH & CAPITAL",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = ChampagneGold,
                                letterSpacing = 1.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Text(
                            text = "Financial Ledger",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontFamily = FontFamily.Serif,
                                color = WarmIvory,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }

                    GoldButton(
                        text = "+ Entry",
                        onClick = { showAddDialog = true }
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
                Divider(color = ChampagneGoldBorder, thickness = 0.5.dp)
                Spacer(modifier = Modifier.height(14.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(
                            text = "NET ACCUMULATION",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = ChampagneGoldLight,
                                fontSize = 10.sp
                            )
                        )
                        Text(
                            text = "$${String.format(Locale.US, "%,.2f", netBalance)}",
                            style = MaterialTheme.typography.displayMedium.copy(
                                fontFamily = FontFamily.Serif,
                                color = if (netBalance >= 0) WarmIvory else PriorityHigh,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "Income: +$${String.format(Locale.US, "%,.0f", totalIncome)}",
                            style = MaterialTheme.typography.labelMedium.copy(color = StatusCompleted)
                        )
                        Text(
                            text = "Outflow: -$${String.format(Locale.US, "%,.0f", totalExpenses)}",
                            style = MaterialTheme.typography.labelMedium.copy(color = PriorityHigh)
                        )
                    }
                }
            }
        }

        // Filter Tabs
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                LuxuryChip(
                    text = "All (${transactions.size})",
                    selected = selectedTypeFilter == null,
                    onClick = { selectedTypeFilter = null }
                )
                TransactionType.values().forEach { type ->
                    LuxuryChip(
                        text = type.name,
                        selected = selectedTypeFilter == type,
                        onClick = { selectedTypeFilter = type }
                    )
                }
            }
        }

        // Transactions List
        if (filteredTransactions.isEmpty()) {
            item {
                LuxuryEmptyState(
                    title = "No ledger records",
                    description = "Record revenue retainers, investments, fixed costs, and subscriptions.",
                    icon = Icons.Default.AccountBalanceWallet,
                    actionText = "+ Add Transaction",
                    onActionClick = { showAddDialog = true }
                )
            }
        } else {
            items(filteredTransactions) { tr ->
                val isIncome = tr.type == TransactionType.Income

                LuxuryCard(contentPadding = PaddingValues(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(
                                            if (isIncome) StatusCompleted.copy(alpha = 0.15f)
                                            else PriorityHigh.copy(alpha = 0.15f)
                                        )
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = tr.category.name.uppercase(),
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = if (isIncome) StatusCompleted else PriorityHigh,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 9.sp
                                        )
                                    )
                                }
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = tr.date,
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        fontSize = 11.sp,
                                        color = TextMutedDark
                                    )
                                )
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = tr.item,
                                style = MaterialTheme.typography.bodyLarge.copy(
                                    fontWeight = FontWeight.SemiBold,
                                    color = DeepObsidian
                                )
                            )
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "${if (isIncome) "+" else "-"}$${String.format(Locale.US, "%,.2f", tr.amount)}",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontFamily = FontFamily.Serif,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isIncome) StatusCompleted else PriorityHigh
                                )
                            )
                            IconButton(
                                onClick = { viewModel.deleteTransaction(tr.id) },
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
    }

    // Add Transaction Dialog
    if (showAddDialog) {
        var itemDesc by remember { mutableStateOf("") }
        var amountText by remember { mutableStateOf("") }
        var type by remember { mutableStateOf(TransactionType.Expense) }
        var category by remember { mutableStateOf(TransactionCategory.Other) }
        var date by remember {
            mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()))
        }

        LuxuryDialog(
            onDismissRequest = { showAddDialog = false },
            title = "Record Transaction",
            confirmButton = {
                GoldButton(
                    text = "Save Entry",
                    onClick = {
                        val amount = amountText.toDoubleOrNull() ?: 0.0
                        if (itemDesc.isNotBlank() && amount > 0) {
                            viewModel.addTransaction(
                                item = itemDesc.trim(),
                                amount = amount,
                                type = type,
                                category = category,
                                date = date
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
                    value = itemDesc,
                    onValueChange = { itemDesc = it },
                    label = "Description",
                    placeholder = "e.g. Consulting Retainer or AWS Cloud Costs"
                )

                LuxuryTextField(
                    value = amountText,
                    onValueChange = { amountText = it },
                    label = "Amount ($)"
                )

                Text("Type", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    TransactionType.values().forEach { t ->
                        LuxuryChip(
                            text = t.name,
                            selected = type == t,
                            onClick = { type = t }
                        )
                    }
                }

                Text("Category", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    TransactionCategory.values().take(3).forEach { cat ->
                        LuxuryChip(
                            text = cat.name,
                            selected = category == cat,
                            onClick = { category = cat }
                        )
                    }
                }
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    TransactionCategory.values().drop(3).forEach { cat ->
                        LuxuryChip(
                            text = cat.name,
                            selected = category == cat,
                            onClick = { category = cat }
                        )
                    }
                }

                LuxuryTextField(
                    value = date,
                    onValueChange = { date = it },
                    label = "Date (YYYY-MM-DD)",
                    leadingIcon = Icons.Default.CalendarToday
                )
            }
        }
    }
}
