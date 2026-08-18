import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { Target, Plus, Search, Calendar, ChevronRight } from 'lucide-react';
import { GoalCategory, GoalStatus } from '../types';
import { format } from 'date-fns';

export const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal, projects } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Simple form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Personal');
  const [targetDate, setTargetDate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetDate) return;
    addGoal({ name, category, targetDate, status: 'Not Started', progress: 0 });
    setName('');
    setTargetDate('');
    setShowForm(false);
  };

  const filteredGoals = goals.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl serif italic tracking-wide text-nat-accent-2">Goals & Milestones</h1>
          <p className="text-nat-text opacity-60 mt-1 text-sm">Break big dreams into actionable steps.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-nat-accent-2 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-nat-accent-3 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass p-6 rounded-2xl mb-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium opacity-70 mb-1">Goal Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium opacity-70 mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as GoalCategory)} className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none">
                {['Career', 'Personal', 'Health', 'Finance', 'Learning'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium opacity-70 mb-1">Target Date</label>
              <input type="date" required value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium opacity-70 hover:opacity-100">Cancel</button>
            <button type="submit" className="bg-nat-accent-2 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-nat-accent-3">Save Goal</button>
          </div>
        </form>
      )}

      <div className="mb-6 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
        <input 
          type="text" 
          placeholder="Search goals..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-nat-light-1 border border-nat-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nat-accent-2/10 focus:border-nat-accent-2 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map(goal => {
          const linkedProjects = projects.filter(p => p.goalId === goal.id);
          return (
            <div key={goal.id} className="glass p-5 rounded-2xl group hover:shadow-sm transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-nat-light-1 opacity-80">
                      {goal.category}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-nat-accent-1/20 text-nat-accent-4">
                      {goal.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{goal.name}</h3>
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity">
                  <span className="text-xs text-red-500">Delete</span>
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs opacity-60 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Due {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  {linkedProjects.length} Projects
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium opacity-80">
                  <span>Overall Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="h-1 w-full bg-nat-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-nat-accent-1 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
        {filteredGoals.length === 0 && (
          <div className="col-span-full py-12 text-center opacity-50 bg-white/40 rounded-2xl border border-dashed border-nat-border">
            No goals found. Set your sights on something new!
          </div>
        )}
      </div>
    </div>
  );
};
