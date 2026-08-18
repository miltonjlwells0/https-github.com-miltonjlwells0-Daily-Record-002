import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { Plus, ArrowDownRight, ArrowUpRight, Wallet, CreditCard, PiggyBank } from 'lucide-react';
import { format } from 'date-fns';
import { TransactionType, TransactionCategory } from '../types';

export const Finance = () => {
  const { transactions, addTransaction, deleteTransaction } = useData();
  const [showForm, setShowForm] = useState(false);

  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('Expense');
  const [category, setCategory] = useState<TransactionCategory>('Food');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !amount) return;
    addTransaction({
      item,
      amount: parseFloat(amount),
      type,
      category,
      date
    });
    setItem('');
    setAmount('');
    setShowForm(false);
  };

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense' || t.type === 'Subscription').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl serif italic tracking-wide text-nat-accent-2">Finance Hub</h1>
          <p className="text-nat-text opacity-60 mt-1 text-sm">Manage income, expenses, and active subscriptions.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-nat-accent-2 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-nat-accent-3 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-6 shadow-sm border border-nat-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-nat-light-1 rounded-lg text-nat-accent-2"><Wallet className="w-5 h-5" /></div>
            <h3 className="font-medium opacity-70 text-sm">Net Balance</h3>
          </div>
          <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
        </div>
        <div className="glass rounded-2xl p-6 shadow-sm border border-nat-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#F1F3EE] rounded-lg text-nat-accent-2"><ArrowUpRight className="w-5 h-5" /></div>
            <h3 className="font-medium opacity-70 text-sm">Total Income</h3>
          </div>
          <p className="text-3xl font-bold text-nat-accent-2">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="glass rounded-2xl p-6 shadow-sm border border-nat-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#FAF3EF] rounded-lg text-nat-accent-1"><ArrowDownRight className="w-5 h-5" /></div>
            <h3 className="font-medium opacity-70 text-sm">Total Expenses</h3>
          </div>
          <p className="text-3xl font-bold text-nat-accent-1">${totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass p-6 rounded-2xl mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end border border-nat-border">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium opacity-70 mb-1">Date</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium opacity-70 mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value as TransactionType)} className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none">
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Subscription">Subscription</option>
            </select>
          </div>
          <div className="md:col-span-1">
             <label className="block text-xs font-medium opacity-70 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as TransactionCategory)} className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none">
              <option value="Salary">Salary</option>
              <option value="Rent">Rent</option>
              <option value="Food">Food</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Investments">Investments</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium opacity-70 mb-1">Item</label>
            <input type="text" required value={item} onChange={e => setItem(e.target.value)} placeholder="e.g. Groceries" className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium opacity-70 mb-1">Amount ($)</label>
            <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none" />
          </div>
          <div className="md:col-span-5 flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium opacity-70 hover:opacity-100">Cancel</button>
            <button type="submit" className="bg-nat-accent-2 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-nat-accent-3">Save Record</button>
          </div>
        </form>
      )}

      <div className="glass border border-nat-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-nat-border bg-white/40">
          <h3 className="font-semibold serif italic">Recent Transactions</h3>
        </div>
        {sortedTransactions.length === 0 ? (
           <div className="p-8 text-center opacity-50 text-sm">No transactions yet.</div>
        ) : (
          <ul className="divide-y divide-nat-border/50">
            {sortedTransactions.map(transaction => (
              <li key={transaction.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-white/40 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'Income' ? 'bg-[#F1F3EE] text-nat-accent-2' :
                    transaction.type === 'Subscription' ? 'bg-[#FAF3EF] text-nat-accent-1' :
                    'bg-[#FAF3EF] text-nat-accent-1'
                  }`}>
                    {transaction.type === 'Income' ? <PiggyBank className="w-4 h-4" /> :
                     transaction.type === 'Subscription' ? <CreditCard className="w-4 h-4" /> :
                     <Wallet className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.item}</p>
                    <p className="text-xs opacity-60">{format(new Date(transaction.date), 'MMM d, yyyy')} • {transaction.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-semibold text-sm ${
                    transaction.type === 'Income' ? 'text-nat-accent-2' : 'text-nat-text'
                  }`}>
                    {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <button onClick={() => deleteTransaction(transaction.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
