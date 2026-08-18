import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { format, subDays, addDays, startOfWeek } from 'date-fns';
import { Check, Flame, Award, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { HabitTracker } from '../types';
import { EmojiOrImage } from './EmojiOrImage';

export const Habits = () => {
  const { habits, habitDefs, toggleHabit, addHabitDef, deleteHabitDef } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [showForm, setShowForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('🌟');

  const habitIconPresets = ['🌟', '🧘', '🏃', '💧', '📚', '💻', '💰', '🥗', '🎯', '🏋️', '😴', '🧠', '🎨', '🌿', '☕', '📝'];

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

  const getDayData = (dateStr: string): HabitTracker['habits'] => {
    const day = habits.find(h => h.date === dateStr);
    return day ? day.habits : {};
  };

  const calculateStreak = (habitKey: string) => {
    let streak = 0;
    let d = new Date();
    while (true) {
      const dateStr = format(d, 'yyyy-MM-dd');
      const data = getDayData(dateStr);
      if (data[habitKey]) {
        streak++;
        d = subDays(d, 1);
      } else {
        // If today is missed, check yesterday before breaking streak entirely
        if (streak === 0 && format(d, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
           d = subDays(d, 1);
           const yData = getDayData(format(d, 'yyyy-MM-dd'));
           if(!yData[habitKey]) break;
        } else {
          break;
        }
      }
    }
    return streak;
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabitDef({
      name: newHabitName.trim(),
      icon: newHabitIcon || '🌟'
    });
    setNewHabitName('');
    setNewHabitIcon('🌟');
    setShowForm(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl serif italic tracking-wide text-nat-accent-2">Habit Tracker</h1>
          <p className="text-nat-text opacity-60 mt-1 text-sm">Build streaks and track your daily consistency.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-nat-accent-2 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-nat-accent-3 transition-colors flex items-center gap-2 h-[36px]"
        >
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddHabit} className="glass p-6 rounded-2xl mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border border-nat-border">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium opacity-70 mb-1">Habit Name</label>
            <input type="text" required value={newHabitName} onChange={e => setNewHabitName(e.target.value)} className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none" placeholder="e.g. Meditate for 10 min" />
          </div>
          <div>
            <label className="block text-xs font-medium opacity-70 mb-1">Emoji / Graphic Icon</label>
            <div className="flex items-center gap-2">
              <input type="text" required value={newHabitIcon} onChange={e => setNewHabitIcon(e.target.value)} className="w-16 rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-2 py-2 border bg-white/50 outline-none text-center" placeholder="🧘" />
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px]">
                {habitIconPresets.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewHabitIcon(preset)}
                    className={cn(
                      "p-1 rounded hover:bg-nat-light-1 transition-colors shrink-0",
                      newHabitIcon === preset && "bg-nat-accent-1/30"
                    )}
                  >
                    <EmojiOrImage emoji={preset} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium opacity-70 hover:opacity-100">Cancel</button>
            <button type="submit" className="bg-nat-accent-2 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-nat-accent-3">Save Habit</button>
          </div>
        </form>
      )}

      <div className="glass rounded-2xl overflow-hidden mb-8">
        <div className="flex items-center justify-between p-4 border-b border-nat-border bg-white/40">
          <button onClick={() => setCurrentDate(subDays(currentDate, 7))} className="text-sm font-medium px-3 py-1 bg-white/60 border border-nat-border rounded hover:bg-white/80">&larr; Previous Week</button>
          <span className="font-semibold text-nat-text serif italic">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </span>
          <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="text-sm font-medium px-3 py-1 bg-white/60 border border-nat-border rounded hover:bg-white/80">Next Week &rarr;</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-nat-text opacity-70 text-xs uppercase border-b border-nat-border">
              <tr>
                <th className="px-6 py-4 font-semibold w-48">Habit</th>
                {weekDays.map(day => (
                  <th key={day.toISOString()} className={cn("px-2 py-4 text-center font-semibold", format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && "text-nat-accent-2 font-bold")}>
                    <div>{format(day, 'EEE')}</div>
                    <div className="text-[10px] opacity-60 font-normal mt-0.5">{format(day, 'd')}</div>
                  </th>
                ))}
                <th className="px-6 py-4 font-semibold text-center w-24">Streak</th>
                <th className="px-4 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {habitDefs.map(({ id: key, name: label, icon }) => {
                const streak = calculateStreak(key);
                return (
                  <tr key={key} className="border-b border-nat-border/50 last:border-0 hover:bg-white/30 group">
                    <td className="px-6 py-4 font-medium flex items-center gap-2.5">
                      <EmojiOrImage emoji={icon} size="base" />
                      <span>{label}</span>
                    </td>
                    {weekDays.map(day => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const isDone = getDayData(dateStr)[key];
                      const isFuture = day > new Date();
                      
                      return (
                        <td key={dateStr} className="px-2 py-4 text-center">
                          <button
                            disabled={isFuture}
                            onClick={() => toggleHabit(dateStr, key)}
                            className={cn(
                              "w-8 h-8 rounded flex items-center justify-center mx-auto transition-all",
                              isDone ? "bg-nat-accent-2 text-white shadow-sm" : 
                              isFuture ? "bg-transparent text-transparent cursor-not-allowed border border-dashed border-nat-border" :
                              "bg-nat-light-1 text-transparent hover:bg-white border border-nat-border"
                            )}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1 font-semibold text-nat-accent-4">
                        <Flame className="w-4 h-4" /> {streak}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => deleteHabitDef(key)}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                );
              })}
              {habitDefs.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center opacity-50 border-dashed border-nat-border">
                    No habits created yet. Click "Add Habit" to start building consistency!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-nat-accent-2 text-white rounded-2xl p-6 shadow-sm">
           <Award className="w-8 h-8 text-nat-accent-1 mb-3" />
           <h3 className="font-semibold mb-1 serif italic text-lg">Consistency is Key</h3>
           <p className="text-xs opacity-80">You're doing great! Keep building those daily habits to reach your goals.</p>
        </div>
      </div>
    </div>
  );
};
