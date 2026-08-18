import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { format, subDays, addDays, parseISO } from 'date-fns';
import { MoodType, DailyJournalEntry } from '../types';
import {
  Sun,
  Moon,
  Heart,
  Droplets,
  Bed,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Smile,
  Zap,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  BookOpen,
  Quote,
  Tag,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import journalFountainPenImg from '../assets/images/journal_fountain_pen_1787011029300.jpg';

export const DailyJournal: React.FC = () => {
  const { getJournalForDate, saveDailyJournal, updateDailyWellness, dailyJournals } = useData();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [searchFilter, setSearchFilter] = useState('');

  const entry: DailyJournalEntry = getJournalForDate(selectedDate);

  const moodOptions: { id: MoodType; label: string; icon: string }[] = [
    { id: 'great', label: 'Vibrant', icon: '✨' },
    { id: 'good', label: 'Good & Focused', icon: '🌿' },
    { id: 'neutral', label: 'Balanced', icon: '☕' },
    { id: 'tired', label: 'Tired / Low Energy', icon: '🌙' },
    { id: 'stressed', label: 'Overwhelmed', icon: '🌧️' },
  ];

  const handleDateChange = (days: number) => {
    try {
      const current = parseISO(selectedDate);
      const newDate = days > 0 ? addDays(current, days) : subDays(current, Math.abs(days));
      setSelectedDate(format(newDate, 'yyyy-MM-dd'));
    } catch {
      setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    }
  };

  const handleIntentionChange = (val: string) => {
    saveDailyJournal({ ...entry, morningIntention: val });
  };

  const handleReflectionChange = (val: string) => {
    saveDailyJournal({ ...entry, eveningReflection: val });
  };

  const handleGratitudeChange = (index: number, val: string) => {
    const list = [...(entry.gratitude || ['', '', ''])];
    list[index] = val;
    saveDailyJournal({ ...entry, gratitude: list });
  };

  const addGratitudeSlot = () => {
    const list = [...(entry.gratitude || []), ''];
    saveDailyJournal({ ...entry, gratitude: list });
  };

  const removeGratitudeSlot = (index: number) => {
    const list = (entry.gratitude || []).filter((_, i) => i !== index);
    saveDailyJournal({ ...entry, gratitude: list });
  };

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Header & Date Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl serif italic tracking-wide text-nat-accent-2">Daily Log & Journal</h1>
          <p className="text-nat-text opacity-60 mt-1 text-sm">Mindful reflections, daily intentions, and wellness vitals.</p>
        </div>

        {/* Date Navigator in classic glass style */}
        <div className="flex items-center gap-1.5 glass border border-nat-border p-1.5 rounded-xl shadow-xs">
          <button
            onClick={() => handleDateChange(-1)}
            className="p-1.5 rounded-lg hover:bg-nat-light-1 text-nat-accent-2 transition-colors cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-white/70 rounded-lg text-xs font-semibold text-nat-text">
            <Calendar className="w-3.5 h-3.5 text-nat-accent-2" />
            <span>{isToday ? 'Today, ' : ''}{format(parseISO(selectedDate), 'EEEE, MMM d, yyyy')}</span>
          </div>

          <button
            onClick={() => handleDateChange(1)}
            className="p-1.5 rounded-lg hover:bg-nat-light-1 text-nat-accent-2 transition-colors cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
              className="px-2.5 py-1 rounded-lg bg-nat-accent-2 text-white text-[11px] font-medium hover:bg-nat-accent-3 transition-colors ml-1 cursor-pointer"
            >
              Today
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: JOURNAL PROMPTS & REFLECTIONS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Mood & Energy Selector */}
          <div className="glass p-5 md:p-6 rounded-2xl border border-nat-border shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-nat-accent-2" />
                <h2 className="serif text-base font-medium text-nat-text">Daily Mood & Energy</h2>
              </div>
              <span className="text-xs font-semibold text-nat-accent-4">
                Energy Level: {entry.energyLevel || 3}/5 ⚡
              </span>
            </div>

            {/* Mood Options */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {moodOptions.map(m => {
                const isSelected = entry.mood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => updateDailyWellness(selectedDate, { mood: m.id })}
                    className={cn(
                      "p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer",
                      isSelected
                        ? "border-nat-accent-2 bg-white ring-2 ring-nat-accent-2/30 shadow-xs font-semibold"
                        : "border-nat-border bg-white/40 hover:bg-white/80 text-nat-text opacity-80 hover:opacity-100"
                    )}
                  >
                    <span className="text-xl select-none">{m.icon}</span>
                    <span className="text-[11px] text-nat-text line-clamp-1">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Energy Slider */}
            <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-nat-border">
              <Zap className="w-4 h-4 text-nat-accent-4" />
              <div className="flex-1">
                <div className="flex justify-between text-[11px] font-medium opacity-70 mb-1">
                  <span>Low Energy (1)</span>
                  <span>Peak Focus (5)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={entry.energyLevel || 3}
                  onChange={e => updateDailyWellness(selectedDate, { energyLevel: parseInt(e.target.value) })}
                  className="w-full accent-nat-accent-2 cursor-pointer h-2 bg-nat-border rounded-lg appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Morning Intention */}
          <div className="glass p-5 md:p-6 rounded-2xl border border-nat-border shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-4 h-4 text-amber-500" />
              <h2 className="serif text-base font-medium text-nat-text">Morning Focus & Intention</h2>
            </div>
            <p className="text-xs opacity-60 mb-3">What is the single most essential outcome for today?</p>
            <textarea
              value={entry.morningIntention || ''}
              onChange={e => handleIntentionChange(e.target.value)}
              placeholder="e.g. Complete core project milestone and protect 2 hours of deep focus..."
              rows={3}
              className="w-full p-3 rounded-xl border border-nat-border bg-white/60 text-sm text-nat-text focus:border-nat-accent-2 focus:ring-1 focus:ring-nat-accent-2 outline-none resize-none transition-all placeholder:opacity-40"
            />
          </div>

          {/* 3 Things I am Grateful For */}
          <div className="glass p-5 md:p-6 rounded-2xl border border-nat-border shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <h2 className="serif text-base font-medium text-nat-text">Daily Gratitude List</h2>
              </div>
              <button
                onClick={addGratitudeSlot}
                className="flex items-center gap-1 text-[11px] font-medium text-nat-accent-2 hover:text-nat-accent-3 px-2.5 py-1 rounded-lg bg-white/80 border border-nat-border hover:bg-white transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(entry.gratitude && entry.gratitude.length > 0 ? entry.gratitude : ['', '', '']).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-nat-accent-1/20 text-nat-accent-4 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleGratitudeChange(idx, e.target.value)}
                    placeholder={`Gratitude #${idx + 1}...`}
                    className="flex-1 px-3 py-2 rounded-lg border border-nat-border bg-white/60 text-xs text-nat-text focus:border-nat-accent-2 outline-none"
                  />
                  {(entry.gratitude || []).length > 3 && (
                    <button
                      onClick={() => removeGratitudeSlot(idx)}
                      className="p-1.5 text-nat-text opacity-40 hover:opacity-100 hover:text-rose-500 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Evening Reflection */}
          <div className="glass p-5 md:p-6 rounded-2xl border border-nat-border shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="w-4 h-4 text-indigo-400" />
              <h2 className="serif text-base font-medium text-nat-text">Evening Reflection & Wins</h2>
            </div>
            <p className="text-xs opacity-60 mb-3">What went well? What did you learn or accomplish today?</p>
            <textarea
              value={entry.eveningReflection || ''}
              onChange={e => handleReflectionChange(e.target.value)}
              placeholder="e.g. Cleared high priority deliverables smoothly; rested well in the evening..."
              rows={3}
              className="w-full p-3 rounded-xl border border-nat-border bg-white/60 text-sm text-nat-text focus:border-nat-accent-2 focus:ring-1 focus:ring-nat-accent-2 outline-none resize-none transition-all placeholder:opacity-40"
            />
          </div>

        </div>

        {/* RIGHT COL: DAILY VITALS & QUICK STATS */}
        <div className="space-y-6">
          
          {/* Hydration Tracker */}
          <div className="glass p-5 md:p-6 rounded-2xl border border-nat-border shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-500" />
                <h3 className="serif text-sm font-medium text-nat-text">Hydration Log</h3>
              </div>
              <span className="text-xs font-semibold text-sky-600">
                {(entry.waterGlasses || 0) * 250} ml / 2000 ml
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {Array.from({ length: 8 }).map((_, i) => {
                const filled = i < (entry.waterGlasses || 0);
                return (
                  <button
                    key={i}
                    onClick={() => updateDailyWellness(selectedDate, { waterGlasses: filled && i === (entry.waterGlasses || 0) - 1 ? i : i + 1 })}
                    className={cn(
                      "h-12 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer",
                      filled
                        ? "bg-sky-500 text-white border-sky-600 shadow-2xs"
                        : "bg-white/50 border-nat-border text-sky-400 hover:bg-white"
                    )}
                    title={`Glass ${i + 1} (250ml)`}
                  >
                    <Droplets className={cn("w-4 h-4", filled ? "fill-white" : "opacity-50")} />
                    <span className="text-[9px] font-semibold mt-0.5">250ml</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-nat-text opacity-70">
              <span>{entry.waterGlasses || 0} of 8 glasses logged</span>
              <button
                onClick={() => updateDailyWellness(selectedDate, { waterGlasses: (entry.waterGlasses || 0) + 1 })}
                className="text-xs font-semibold text-nat-accent-2 hover:underline cursor-pointer"
              >
                + Add Cup
              </button>
            </div>
          </div>

          {/* Sleep Hours Log */}
          <div className="glass p-5 md:p-6 rounded-2xl border border-nat-border shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-purple-500" />
                <h3 className="serif text-sm font-medium text-nat-text">Sleep & Recovery</h3>
              </div>
              <span className="text-xs font-semibold text-nat-accent-2">
                {entry.sleepHours || 7} Hours
              </span>
            </div>

            <div className="space-y-3">
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={entry.sleepHours || 7}
                onChange={e => updateDailyWellness(selectedDate, { sleepHours: parseFloat(e.target.value) })}
                className="w-full accent-nat-accent-2 cursor-pointer h-2 bg-nat-border rounded-lg appearance-none"
              />

              <div className="flex justify-between text-[11px] font-medium opacity-60">
                <span>4 hrs (Short)</span>
                <span>7-8 hrs (Optimal)</span>
                <span>10+ hrs</span>
              </div>
            </div>
          </div>

          {/* Mindful Tip Card */}
          <div className="p-5 rounded-2xl bg-white/70 border border-nat-border shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-nat-accent-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-nat-accent-4">Mindful Practice</h4>
            </div>
            <p className="text-xs text-nat-text opacity-80 leading-relaxed">
              "Small, consistent daily reflections create clarity and prevent burnout far better than occasional massive resets."
            </p>
          </div>

        </div>

      </div>

      {/* JOURNAL ENTRIES HISTORY LIST (Includes New Reference Entry) */}
      <div className="mt-10 pt-8 border-t border-nat-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-nat-accent-2" />
              <h2 className="serif text-xl font-bold text-nat-text">Recorded Journal Entries ({dailyJournals.length})</h2>
            </div>
            <p className="text-xs text-nat-text opacity-60 mt-1">Browse all historical reflections, gratitude entries, and daily insights.</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search journals or tags..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl border border-nat-border bg-white/80 text-xs text-nat-text focus:border-nat-accent-2 outline-none w-56 placeholder:opacity-50 shadow-2xs"
            />
            <button
              onClick={() => {
                const todayStr = format(new Date(), 'yyyy-MM-dd');
                setSelectedDate(todayStr);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-nat-accent-2 text-white text-xs font-semibold hover:bg-nat-accent-3 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Today's Log</span>
            </button>
          </div>
        </div>

        {/* List of journal entries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyJournals
            .filter(j => {
              if (!searchFilter.trim()) return true;
              const q = searchFilter.toLowerCase();
              return (
                j.date.includes(q) ||
                j.eveningReflection.toLowerCase().includes(q) ||
                j.morningIntention.toLowerCase().includes(q) ||
                j.gratitude.some(g => g.toLowerCase().includes(q)) ||
                (j.tags || []).some(t => t.toLowerCase().includes(q))
              );
            })
            .sort((a, b) => b.date.localeCompare(a.date))
            .map(j => {
              const isCurrent = j.date === selectedDate;
              let dateFormatted = j.date;
              try {
                dateFormatted = format(parseISO(j.date), 'EEEE, MMMM d, yyyy');
              } catch {}

              const isMay15Ref = j.date === '2024-05-15';

              return (
                <div
                  key={j.date}
                  onClick={() => {
                    setSelectedDate(j.date);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={cn(
                    "p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between",
                    isCurrent
                      ? "border-nat-accent-2 bg-white/95 ring-2 ring-nat-accent-2/40 shadow-md"
                      : "border-nat-border bg-white/60 hover:bg-white/90 hover:shadow-xs"
                  )}
                >
                  {/* Subtle Top Accent */}
                  {isMay15Ref && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/15 border-b border-l border-amber-500/30 rounded-bl-xl text-[10px] font-bold text-amber-700 uppercase tracking-widest font-mono">
                      ⭐ Reference Entry
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {j.mood === 'great' ? '✨' : j.mood === 'good' ? '🌿' : j.mood === 'tired' ? '🌙' : j.mood === 'stressed' ? '🌧️' : '☕'}
                        </span>
                        <div>
                          <h3 className="serif font-bold text-sm text-nat-text">{dateFormatted}</h3>
                          <span className="text-[10px] text-nat-accent-4 font-mono font-semibold">Energy: {j.energyLevel || 3}/5</span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-nat-accent-2 text-white text-[10px] font-bold tracking-wider uppercase">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Evening Reflection / Quote Highlight */}
                    {j.eveningReflection && (
                      <div className="mb-3 p-3 rounded-xl bg-nat-light-1/70 border border-nat-border relative">
                        <Quote className="w-3.5 h-3.5 text-nat-accent-2 opacity-50 mb-1" />
                        <p className="serif italic text-xs text-nat-text leading-relaxed font-medium">
                          "{j.eveningReflection}"
                        </p>
                      </div>
                    )}

                    {/* Morning Intention */}
                    {j.morningIntention && (
                      <div className="mb-2.5 flex items-start gap-1.5 text-xs text-nat-text opacity-85">
                        <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2"><strong>Intention:</strong> {j.morningIntention}</span>
                      </div>
                    )}

                    {/* Gratitude Items */}
                    {j.gratitude && j.gratitude.filter(Boolean).length > 0 && (
                      <div className="space-y-1 mb-3">
                        <span className="text-[11px] font-semibold text-rose-600 block">Gratitude:</span>
                        {j.gratitude.filter(Boolean).slice(0, 2).map((g, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-nat-text opacity-75">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span className="line-clamp-1">{g}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Stats & Open Button */}
                  <div className="pt-3 border-t border-nat-border/60 flex items-center justify-between text-[11px] text-nat-text opacity-70">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-sky-500" />
                        {(j.waterGlasses || 0) * 250}ml
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3 text-purple-500" />
                        {j.sleepHours || 7}h
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-nat-accent-2 font-semibold hover:underline">
                      <span>{isCurrent ? 'Editing' : 'View / Edit'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

