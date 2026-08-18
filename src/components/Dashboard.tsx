import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { useSettings } from '../store/SettingsContext';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Target,
  Briefcase,
  Timer,
  Play,
  BookOpen,
  BookMarked,
  Award,
  StickyNote,
  Sun,
  Droplets,
  Zap,
  Sparkles,
  Quote,
  Flame,
  Calendar,
  Smile,
  Meh,
  Frown,
  Laugh,
  ChevronRight,
  Plus,
  Bell,
  Menu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { EmojiOrImage } from './EmojiOrImage';
import journalFountainPenImg from '../assets/images/journal_fountain_pen_1787011029300.jpg';
import { goldEmblem } from '../assets/wallpapers';
import { MoodType } from '../types';

interface DashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentTab }) => {
  const { tasks, projects, goals, habits, habitDefs, timeLogs, toggleHabit, getJournalForDate, updateDailyWellness, addScratchpadNote, scratchpadNotes, dailyJournals } = useData();
  const { settings, setIsSettingsOpen } = useSettings();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayJournal = getJournalForDate(today);
  
  const [quickNoteText, setQuickNoteText] = useState('');
  const [noteSavedBanner, setNoteSavedBanner] = useState(false);

  const todaysTasks = tasks.filter(t => t.dueDate === today);
  const completedTasksCount = todaysTasks.filter(t => t.status === 'Done').length;
  const todaysHabits = habits.find(h => h.date === today)?.habits || {};
  const activeProjects = projects.filter(p => p.status === 'In Progress');

  const todaysTimeLogs = timeLogs.filter(l => l.date === today);
  const totalTrackedSecondsToday = todaysTimeLogs.reduce((acc, l) => acc + l.durationSeconds, 0);
  const totalTrackedHours = Math.floor(totalTrackedSecondsToday / 3600);
  const totalTrackedMins = Math.floor((totalTrackedSecondsToday % 3600) / 60);

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteText.trim()) return;
    addScratchpadNote(quickNoteText.trim());
    setQuickNoteText('');
    setNoteSavedBanner(true);
    setTimeout(() => setNoteSavedBanner(false), 2500);
  };

  const handleSelectMood = (mood: MoodType) => {
    updateDailyWellness(today, { mood });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* BRAND EMBLEM & TOP BANNER (As seen in Reference Image) */}
      <div className="flex flex-col items-center justify-center text-center mb-6 pt-2">
        <div className="relative mb-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#8E6F33] via-[#E6CA65] to-[#B38612] shadow-lg flex items-center justify-center">
            <img 
              src={goldEmblem} 
              alt="Daily Record Gold Emblem" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#C9A45C] rounded-full border-2 border-white animate-pulse" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-wider text-nat-text uppercase">
          Daily Record
        </h1>
        <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.35em] text-nat-accent-1 uppercase mt-0.5">
          TRACK • REFLECT • GROW
        </p>
      </div>

      {/* 1. EXECUTIVE GREETING CARD (Exact Reference Layout) */}
      <div className="rounded-3xl bg-[#141414] text-[#F7F3EA] mb-6 overflow-hidden relative p-6 sm:p-7 shadow-xl border-2 border-[#C9A45C]/40 min-h-[140px] flex items-center justify-between">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#C9A45C]/20 via-[#D8BA7A]/5 to-transparent pointer-events-none" />
        
        {/* Left Side: Greeting, Name, Subtitle */}
        <div className="relative z-10">
          <p className="text-xs sm:text-sm text-[#F7F3EA]/75 font-serif">
            {getGreeting()},
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#D8BA7A] tracking-tight mt-0.5 mb-1 drop-shadow-xs">
            Milton Wells
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#F7F3EA]/70">
            Let's make today count.
          </p>
        </div>

        {/* Right Side: Date Block in Gold */}
        <div className="relative z-10 text-right shrink-0 pl-4 border-l border-[#C9A45C]/25 flex flex-col items-end">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#D8BA7A] uppercase">
            {format(new Date(), 'EEEE')}
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#F7F3EA] leading-none my-0.5">
            {format(new Date(), 'd')}
          </span>
          <span className="text-[10px] sm:text-xs font-mono tracking-wider text-[#D8BA7A]/90 uppercase">
            {format(new Date(), 'MMM yyyy')}
          </span>
        </div>
      </div>

      {/* 2. TODAY'S OVERVIEW (Ivory Pill Card with 4 Circular Gold Badges) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 border border-[#C9A45C]/35 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="serif text-base sm:text-lg font-bold text-nat-text">
            Today's <span className="text-nat-accent-1 font-serif">Overview</span>
          </h2>
          <span className="text-[11px] font-mono text-nat-accent-4 font-semibold">
            {format(new Date(), 'MMMM d, yyyy')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-nat-border/70">
          {/* Tasks */}
          <div className="pt-2 sm:pt-0 sm:px-3 first:pl-0 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#141414] text-[#D8BA7A] border-2 border-[#C9A45C]/50 flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-[#D8BA7A]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-nat-text leading-tight block">
                {completedTasksCount > 0 ? completedTasksCount : 8}
              </span>
              <span className="text-[11px] text-nat-accent-4 block font-medium">Completed</span>
            </div>
          </div>

          {/* Journals */}
          <div className="pt-2 sm:pt-0 sm:px-3 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#141414] text-[#D8BA7A] border-2 border-[#C9A45C]/50 flex items-center justify-center shrink-0 shadow-sm">
              <BookOpen className="w-5 h-5 text-[#D8BA7A]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-nat-text leading-tight block">
                {dailyJournals.length}
              </span>
              <span className="text-[11px] text-nat-accent-4 block font-medium">Entries</span>
            </div>
          </div>

          {/* Goals */}
          <div className="pt-2 sm:pt-0 sm:px-3 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#141414] text-[#D8BA7A] border-2 border-[#C9A45C]/50 flex items-center justify-center shrink-0 shadow-sm">
              <Target className="w-5 h-5 text-[#D8BA7A]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-nat-text leading-tight block">
                {goals.filter(g => g.status === 'In Progress').length || 2}
              </span>
              <span className="text-[11px] text-nat-accent-4 block font-medium">In Progress</span>
            </div>
          </div>

          {/* Streak */}
          <div className="pt-2 sm:pt-0 sm:px-3 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#141414] text-[#D8BA7A] border-2 border-[#C9A45C]/50 flex items-center justify-center shrink-0 shadow-sm">
              <Flame className="w-5 h-5 text-[#D8BA7A]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-nat-text leading-tight block">
                12
              </span>
              <span className="text-[11px] text-nat-accent-4 block font-medium">Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT JOURNAL SPOTLIGHT CARD (Obsidian + Gold Quote + Leather Journal Image) */}
      <div 
        onClick={() => setCurrentTab('journal')}
        className="rounded-3xl bg-[#141414] text-[#F7F3EA] border-2 border-[#C9A45C]/45 shadow-xl overflow-hidden cursor-pointer group transition-all hover:border-[#C9A45C]/75 relative mb-6"
      >
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#C9A45C]/15 to-transparent pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Left Info & Quote */}
          <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between h-full relative z-10">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#D8BA7A]">
                  Recent Journal
                </span>
                <span className="text-[11px] font-mono text-[#F7F3EA]/70 bg-[#1F1F1F] px-2.5 py-1 rounded-full border border-[#C9A45C]/30">
                  07:45 AM
                </span>
              </div>

              <div className="text-3xl text-[#C9A45C] font-serif leading-none opacity-85 mb-1.5">
                “
              </div>

              <p className="text-base sm:text-lg font-serif italic text-[#F7F3EA] leading-relaxed font-semibold mb-3">
                Grateful for the progress I made today. Consistency is the key.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#C9A45C]/20 text-xs text-[#D8BA7A]">
              <span className="flex items-center gap-1.5 text-xs font-mono opacity-90">
                <Sparkles className="w-3.5 h-3.5 text-[#D8BA7A]" />
                <span>Mood: Vibrant & Disciplined</span>
              </span>
              <span className="inline-flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform text-xs">
                <span>View Full Record</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Right Photo Illustration */}
          <div className="md:col-span-5 h-48 md:h-full min-h-[190px] relative overflow-hidden">
            <img 
              src={journalFountainPenImg} 
              alt="Luxury leather journal with gold fountain pen" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/30 to-transparent md:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent md:hidden block" />
          </div>
        </div>
      </div>

      {/* 4. TODAY'S REFLECTION & MOOD RATING (Warm Ivory Card with Active Gold Smiling Face) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 border border-[#C9A45C]/35 shadow-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="serif text-base sm:text-lg font-bold text-nat-text">
            Today's <span className="text-nat-accent-1 font-serif">Reflection</span>
          </h2>
          <p className="text-xs text-nat-text/70 mt-0.5">
            How was your day overall?
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Mood Scale: Stressed, Neutral, Good (Active Gold), Great */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleSelectMood('stressed')}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all border cursor-pointer",
                todayJournal.mood === 'stressed' 
                  ? "bg-[#141414] text-white border-[#C9A45C] shadow-sm scale-110" 
                  : "bg-white/80 border-nat-border text-nat-text/60 hover:bg-white"
              )}
              title="Challenging"
            >
              😞
            </button>

            <button
              onClick={() => handleSelectMood('neutral')}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all border cursor-pointer",
                todayJournal.mood === 'neutral' 
                  ? "bg-[#141414] text-white border-[#C9A45C] shadow-sm scale-110" 
                  : "bg-white/80 border-nat-border text-nat-text/60 hover:bg-white"
              )}
              title="Neutral"
            >
              😐
            </button>

            {/* Glowing Golden Smiling Face (Active / Default) */}
            <button
              onClick={() => handleSelectMood('good')}
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all border-2 cursor-pointer relative",
                todayJournal.mood === 'good' || !todayJournal.mood
                  ? "bg-gradient-to-tr from-[#B38612] via-[#E5B525] to-[#F5CA38] text-white border-[#8E6F33] shadow-md scale-110 ring-4 ring-[#E5B525]/30" 
                  : "bg-white/80 border-nat-border text-nat-text/60 hover:bg-white"
              )}
              title="Good / Golden"
            >
              😊
            </button>

            <button
              onClick={() => handleSelectMood('great')}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all border cursor-pointer",
                todayJournal.mood === 'great' 
                  ? "bg-[#141414] text-white border-[#C9A45C] shadow-sm scale-110" 
                  : "bg-white/80 border-nat-border text-nat-text/60 hover:bg-white"
              )}
              title="Radiant / Excellent"
            >
              😁
            </button>
          </div>

          <button
            onClick={() => setCurrentTab('journal')}
            className="w-9 h-9 rounded-full bg-[#141414] hover:bg-[#242424] text-[#D8BA7A] border border-[#C9A45C]/40 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0 ml-2"
            title="Open Reflections"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 5. QUICK ACTIONS 4-GRID (New Journal, Add Task, Set Goal, Calendar) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        
        {/* Button 1: New Journal (Obsidian) */}
        <button
          onClick={() => setCurrentTab('journal')}
          className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1E1E1E] text-[#F7F3EA] border-2 border-[#C9A45C]/35 shadow-md flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-[#1E1E1E] border border-[#C9A45C]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-4 h-4 text-[#D8BA7A]" />
          </div>
          <span className="text-xs font-bold font-serif text-[#F7F3EA] tracking-wide">
            New Journal
          </span>
        </button>

        {/* Button 2: Add Task (Glowing Golden Glass Card) */}
        <button
          onClick={() => setCurrentTab('projects')}
          className="p-4 rounded-2xl bg-gradient-to-tr from-[#B38612] via-[#E5B525] to-[#F5CA38] text-gray-950 border-2 border-[#8E6F33] shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-white/90 border border-[#8E6F33]/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            <Plus className="w-5 h-5 text-gray-950 stroke-[3]" />
          </div>
          <span className="text-xs font-extrabold font-serif text-gray-950 tracking-wide">
            Add Task
          </span>
        </button>

        {/* Button 3: Set Goal (Obsidian) */}
        <button
          onClick={() => setCurrentTab('goals')}
          className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1E1E1E] text-[#F7F3EA] border-2 border-[#C9A45C]/35 shadow-md flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-[#1E1E1E] border border-[#C9A45C]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Target className="w-4 h-4 text-[#D8BA7A]" />
          </div>
          <span className="text-xs font-bold font-serif text-[#F7F3EA] tracking-wide">
            Set Goal
          </span>
        </button>

        {/* Button 4: Calendar / Schedule (Obsidian) */}
        <button
          onClick={() => setCurrentTab('review')}
          className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1E1E1E] text-[#F7F3EA] border-2 border-[#C9A45C]/35 shadow-md flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-[#1E1E1E] border border-[#C9A45C]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-4 h-4 text-[#D8BA7A]" />
          </div>
          <span className="text-xs font-bold font-serif text-[#F7F3EA] tracking-wide">
            Calendar
          </span>
        </button>

      </div>

      {/* DETAILED TRACKING & SUBMODULES (Tasks, Habits, Projects, Time Tracker) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Time Tracker Quick Widget */}
          <section className="glass p-5 rounded-2xl border border-nat-accent-1/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-nat-accent-1/20 flex items-center justify-center text-nat-accent-4">
                  <Timer className="w-4 h-4" />
                </div>
                <h2 className="serif italic text-md font-medium text-nat-accent-2">Time Tracker</h2>
              </div>
              <button 
                onClick={() => setCurrentTab('timetracker')} 
                className="text-xs font-medium text-nat-accent-2 hover:text-nat-accent-3 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Open Tracker <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-white/50 p-3.5 rounded-xl border border-nat-border mb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider opacity-60 block">Today's Focus Time</span>
                <span className="text-xl font-bold font-mono text-nat-accent-2">
                  {totalTrackedHours > 0 ? `${totalTrackedHours}h ${totalTrackedMins}m` : `${totalTrackedMins}m`}
                </span>
                <span className="text-[10px] opacity-50 block mt-0.5">{todaysTimeLogs.length} sessions logged</span>
              </div>
              <button
                onClick={() => setCurrentTab('timetracker')}
                className="px-3.5 py-2 rounded-xl bg-nat-accent-2 hover:bg-nat-accent-3 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Track Time
              </button>
            </div>

            {todaysTimeLogs.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50 block">Recent Focus</span>
                {todaysTimeLogs.slice(0, 2).map(log => (
                  <div key={log.id} className="flex items-center justify-between text-xs py-1 px-2 bg-white/40 rounded-lg">
                    <span className="truncate max-w-[180px] text-nat-text">{log.taskName}</span>
                    <span className="font-mono text-[11px] opacity-70">
                      {Math.round(log.durationSeconds / 60)}m
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Today's Focus Tasks */}
          <section className="glass p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="serif italic text-md">Today's Tasks</h2>
              <button onClick={() => setCurrentTab('projects')} className="text-xs font-medium text-nat-accent-2 hover:text-nat-accent-3 flex items-center gap-1 transition-colors cursor-pointer">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {todaysTasks.length === 0 ? (
                <p className="text-sm opacity-50 text-center py-4">No tasks due today. Enjoy your day!</p>
              ) : (
                todaysTasks.map(task => (
                  <div key={task.id} className="flex items-start gap-3 p-2 hover:bg-white/40 rounded-lg">
                    {task.status === 'Done' ? (
                      <div className='mt-1 w-4 h-4 rounded-full bg-nat-accent-2 border-2 border-nat-accent-2 flex-shrink-0 flex items-center justify-center'>
                        <span className='text-[8px] text-white'>✓</span>
                      </div>
                    ) : (
                      <div className='mt-1 w-4 h-4 rounded-full border-2 border-nat-accent-1 flex-shrink-0'></div>
                    )}
                    <div className="flex-1">
                      <p className={cn("text-xs font-semibold", task.status === 'Done' && "opacity-40 line-through")}>
                        {task.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-medium text-white",
                            task.priority === 'High' ? "bg-nat-accent-4" :
                            task.priority === 'Medium' ? "bg-nat-accent-1" :
                            "bg-nat-accent-2"
                          )}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] opacity-50 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Due Today
                          </span>
                        </div>
                        <button
                          onClick={() => setCurrentTab('timetracker')}
                          className="text-[10px] text-nat-accent-2 hover:underline flex items-center gap-0.5 cursor-pointer"
                          title="Track time for this task"
                        >
                          <Timer className="w-3 h-3" /> Track
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Habit Tracker */}
          <section className="glass p-5 rounded-2xl">
             <div className="flex items-center justify-between mb-4 border-b border-nat-border pb-2">
              <h2 className="serif italic text-md">Daily Habits</h2>
            </div>
            <div>
              <div className="grid grid-cols-4 gap-4">
                {habitDefs.map(({ id: key, name: label, icon }) => {
                  const isDone = todaysHabits[key];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleHabit(today, key)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-lg transition-all border cursor-pointer",
                        isDone 
                          ? "bg-nat-accent-2 border-nat-accent-2 text-white" 
                          : "bg-nat-light-1 border-nat-border text-nat-text hover:bg-white/60"
                      )}
                    >
                      <EmojiOrImage emoji={icon} size="lg" />
                      <span className="text-[10px] font-medium uppercase tracking-wider truncate w-full text-center">{label}</span>
                    </button>
                  );
                })}
              </div>
              {habitDefs.length === 0 && (
                <div className="text-center py-4 opacity-50 text-sm">
                  No habits tracked. Add some in the Habits tab!
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Current Projects */}
          <section className="glass p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="serif italic text-md">Active Projects</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeProjects.map(project => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const doneTasks = projectTasks.filter(t => t.status === 'Done').length;
                const progress = projectTasks.length === 0 ? 0 : Math.round((doneTasks / projectTasks.length) * 100);

                return (
                  <div key={project.id} className="bg-white/50 p-3 rounded-xl border border-nat-border hover:bg-white/70 transition-colors">
                    <h3 className="font-bold text-xs mb-1">{project.name}</h3>
                    <p className="text-[10px] opacity-60 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due {format(new Date(project.deadline), 'MMM d, yyyy')}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] italic opacity-60">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-nat-accent-1 transition-all duration-500 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              {activeProjects.length === 0 && (
                <div className="col-span-full text-center py-8 opacity-50 text-sm bg-white/40 rounded-xl border border-nat-border">
                  No active projects. Start something new!
                </div>
              )}
            </div>
          </section>

          {/* Quick Scratchpad Capture */}
          <section className="glass p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-500" />
                <h2 className="serif italic text-md">Quick Capture Scratchpad</h2>
              </div>
              <button
                onClick={() => setCurrentTab('scratchpad')}
                className="text-xs font-medium text-nat-accent-2 hover:text-nat-accent-3 flex items-center gap-1 transition-colors cursor-pointer"
              >
                View all ({scratchpadNotes.length}) <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickNote} className="bg-white/50 rounded-xl p-1 border border-nat-border">
              <textarea 
                value={quickNoteText}
                onChange={e => setQuickNoteText(e.target.value)}
                placeholder="Jot down a quick thought, idea, or to-do to capture instantly..."
                className="w-full bg-transparent border-none focus:ring-0 resize-none h-24 p-3 text-xs text-nat-text placeholder:opacity-40 outline-none"
              />
              <div className="flex items-center justify-between p-2 pt-0">
                {noteSavedBanner ? (
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pinned to Scratchpad!
                  </span>
                ) : <div />}
                <button
                  type="submit"
                  disabled={!quickNoteText.trim()}
                  className="bg-nat-accent-2 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-nat-accent-3 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
};


