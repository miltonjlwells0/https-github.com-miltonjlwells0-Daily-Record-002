import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../store/DataContext';
import { format } from 'date-fns';
import { 
  Play, Pause, RotateCcw, Check, Plus, Trash2, Clock, 
  Tag, Calendar, TrendingUp, Sparkles, Filter, Volume2, 
  VolumeX, Maximize2, Minimize2, ChevronDown, CheckCircle2, 
  Award, History, MessageSquare, X, ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TimeTrackerMode, TimeLog } from '../types';
import { Menu } from 'lucide-react';

interface TimeTrackerProps {
  setCurrentTab?: (tab: string) => void;
  onOpenMenu?: () => void;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ setCurrentTab, onOpenMenu }) => {
  const { tasks, timeLogs, addTimeLog, deleteTimeLog, updateTask } = useData();
  const today = format(new Date(), 'yyyy-MM-dd');

  // Main View: 'timer' or 'history'
  const [currentView, setCurrentView] = useState<'timer' | 'history'>('timer');

  // Mode: 'stopwatch' | 'countdown'
  const [activeMode, setActiveMode] = useState<TimeTrackerMode>('countdown');

  // Task selection & metadata
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [customTaskName, setCustomTaskName] = useState<string>('');
  const [category, setCategory] = useState<string>('Deep Work');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [markTaskDoneOnFinish, setMarkTaskDoneOnFinish] = useState<boolean>(false);

  // Countdown duration setting (in seconds) - default 25 mins (1500s)
  const [presetSeconds, setPresetSeconds] = useState<number>(1500);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('25');

  // Active Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1500);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinishedAlert, setIsFinishedAlert] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Manual Log Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualMinutes, setManualMinutes] = useState<number>(30);
  const [manualTaskName, setManualTaskName] = useState<string>('');
  const [manualCategory, setManualCategory] = useState<string>('Deep Work');
  const [manualDate, setManualDate] = useState<string>(today);
  const [manualNotes, setManualNotes] = useState<string>('');

  // Filtering & History in History View
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Daily target in minutes
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(240); // 4 hours

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tagDropdownRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    'Deep Work', 'Coding', 'Design', 'Writing', 
    'Study & Research', 'Meeting', 'Planning', 'Admin', 'Personal'
  ];

  // Close tag dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Play audio chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.35); // D6
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Ignore audio context errors if uninitialized
    }
  };

  // Sync selected task name
  useEffect(() => {
    if (selectedTaskId) {
      const found = tasks.find(t => t.id === selectedTaskId);
      if (found) {
        setCustomTaskName(found.name);
      }
    }
  }, [selectedTaskId, tasks]);

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (activeMode === 'stopwatch') {
          setSecondsElapsed(prev => prev + 1);
        } else if (activeMode === 'countdown') {
          setSecondsRemaining(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              setIsRunning(false);
              setIsFinishedAlert(true);
              playChime();
              return 0;
            }
            return prev - 1;
          });
          setSecondsElapsed(prev => prev + 1);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, activeMode, soundEnabled]);

  // Switch modes
  const handleModeChange = (mode: TimeTrackerMode) => {
    if (isRunning) {
      if (!window.confirm('Timer is currently running. Switch mode and reset current timer?')) {
        return;
      }
    }
    setIsRunning(false);
    setActiveMode(mode);
    setIsFinishedAlert(false);
    if (mode === 'countdown') {
      setSecondsRemaining(presetSeconds);
      setSecondsElapsed(0);
    } else {
      setSecondsElapsed(0);
    }
  };

  // Set preset countdown time
  const handleSetPreset = (minutes: number) => {
    const secs = minutes * 60;
    setPresetSeconds(secs);
    setCustomMinutesInput(minutes.toString());
    if (!isRunning) {
      setSecondsRemaining(secs);
      setSecondsElapsed(0);
      setIsFinishedAlert(false);
    }
  };

  // Set custom minutes countdown
  const handleApplyCustomMinutes = (mins: number) => {
    if (mins <= 0 || isNaN(mins)) return;
    const secs = Math.round(mins * 60);
    setPresetSeconds(secs);
    if (!isRunning) {
      setSecondsRemaining(secs);
      setSecondsElapsed(0);
      setIsFinishedAlert(false);
    }
  };

  // Start / Pause
  const handleToggleTimer = () => {
    if (!isRunning && activeMode === 'countdown' && secondsRemaining === 0) {
      setSecondsRemaining(presetSeconds);
      setSecondsElapsed(0);
      setIsFinishedAlert(false);
    }
    setIsRunning(!isRunning);
  };

  // Reset Timer
  const handleResetTimer = () => {
    setIsRunning(false);
    setIsFinishedAlert(false);
    if (activeMode === 'countdown') {
      setSecondsRemaining(presetSeconds);
      setSecondsElapsed(0);
    } else {
      setSecondsElapsed(0);
    }
  };

  // Log and save completed session
  const handleSaveSession = () => {
    const duration = activeMode === 'countdown' 
      ? (secondsRemaining === 0 ? presetSeconds : secondsElapsed) 
      : secondsElapsed;

    if (duration < 5 && !window.confirm('The session is under 5 seconds. Save anyway?')) {
      return;
    }

    const taskTitle = customTaskName.trim() || (selectedTaskId ? tasks.find(t => t.id === selectedTaskId)?.name : '') || 'Focused Session';

    const newLog: Omit<TimeLog, 'id'> = {
      taskName: taskTitle,
      category,
      date: today,
      durationSeconds: Math.max(duration, 1),
      mode: activeMode,
      targetSeconds: activeMode === 'countdown' ? presetSeconds : undefined,
      notes: sessionNotes.trim() || undefined,
      completedAt: new Date().toISOString(),
      taskId: selectedTaskId || undefined,
    };

    addTimeLog(newLog);

    if (selectedTaskId && markTaskDoneOnFinish) {
      updateTask(selectedTaskId, { status: 'Done' });
    }

    setIsRunning(false);
    setIsFinishedAlert(false);
    setSessionNotes('');
    setIsNotesOpen(false);
    if (activeMode === 'countdown') {
      setSecondsRemaining(presetSeconds);
      setSecondsElapsed(0);
    } else {
      setSecondsElapsed(0);
    }
  };

  // Handle Manual Log Submission
  const handleAddManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTaskName.trim()) return;

    addTimeLog({
      taskName: manualTaskName.trim(),
      category: manualCategory,
      date: manualDate || today,
      durationSeconds: Math.max(manualMinutes * 60, 60),
      mode: 'manual',
      notes: manualNotes.trim() || undefined,
      completedAt: new Date().toISOString()
    });

    setIsManualModalOpen(false);
    setManualTaskName('');
    setManualNotes('');
    setManualMinutes(30);
  };

  // Formatting helpers
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const formatHoursMins = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    if (hrs === 0 && mins === 0) return `${totalSecs}s`;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  // Stats
  const todaysLogs = timeLogs.filter(l => l.date === today);
  const totalTodaySeconds = todaysLogs.reduce((acc, curr) => acc + curr.durationSeconds, 0);
  const todayMinutes = Math.round(totalTodaySeconds / 60);
  const todayProgressPercent = Math.min(Math.round((todayMinutes / dailyGoalMinutes) * 100), 100);

  const categoryBreakdown = todaysLogs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + log.durationSeconds;
    return acc;
  }, {} as Record<string, number>);

  // Filtered logs for history
  const filteredLogs = timeLogs.filter(log => {
    const matchesCategory = selectedFilterCategory === 'All' || log.category === selectedFilterCategory;
    const matchesSearch = log.taskName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (log.notes && log.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const countdownPercent = activeMode === 'countdown' && presetSeconds > 0
    ? Math.min(100, Math.max(0, ((presetSeconds - secondsRemaining) / presetSeconds) * 100))
    : 0;

  return (
    <div className={cn("p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-300 transition-all", isZenMode && "max-w-3xl")}>
      
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {setCurrentTab && (
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="p-2 rounded-xl bg-white border border-nat-border text-nat-accent-2 hover:bg-nat-light-1 hover:text-nat-accent-3 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
              title="Back to Dashboard"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-nat-accent-1/20 text-nat-accent-4">
                Focus & Productivity
              </span>
              <span className="text-xs opacity-50">• {format(new Date(), 'MMMM d, yyyy')}</span>
            </div>
            <h1 className="serif text-2xl md:text-3xl text-nat-accent-2 font-medium">Time Tracker</h1>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main View Switcher: Timer vs History */}
          <div className="bg-nat-light-1/80 p-1 rounded-xl flex items-center border border-nat-border shadow-xs">
            <button
              onClick={() => setCurrentView('timer')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                currentView === 'timer'
                  ? "bg-white text-nat-accent-2 shadow-xs font-semibold"
                  : "text-nat-text opacity-70 hover:opacity-100"
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Tracker</span>
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                currentView === 'history'
                  ? "bg-white text-nat-accent-2 shadow-xs font-semibold"
                  : "text-nat-text opacity-70 hover:opacity-100"
              )}
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({timeLogs.length})</span>
            </button>
          </div>

          {/* Quick Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-nat-border bg-white/60 hover:bg-white text-nat-text opacity-70 hover:opacity-100 transition-colors shadow-xs"
            title={soundEnabled ? "Mute Timer Sound" : "Enable Timer Sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
          </button>
          
          {/* Zen Mode */}
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className={cn(
              "p-2 rounded-xl border border-nat-border text-nat-text transition-colors shadow-xs",
              isZenMode ? "bg-nat-accent-2 text-white opacity-100" : "bg-white/60 hover:bg-white opacity-70 hover:opacity-100"
            )}
            title={isZenMode ? "Exit Compact View" : "Compact Focus View"}
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Manual Entry Button */}
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-nat-accent-2 text-white text-xs font-medium hover:bg-nat-accent-3 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ACTIVE TRACKER VIEW */}
      {currentView === 'timer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Center: Clean, Focused Timer Stage (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            <div className="glass p-6 rounded-3xl relative overflow-hidden shadow-xs border border-nat-accent-1/30">
              
              {/* Background Ambient Glow */}
              <div className={cn(
                "absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-1000",
                isRunning ? "bg-nat-accent-2 scale-110" : "bg-nat-accent-1"
              )} />

              {/* Mode Switcher Tabs */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-nat-border/60">
                <div className="bg-nat-light-1/80 p-0.5 rounded-xl flex items-center border border-nat-border/60">
                  <button
                    onClick={() => handleModeChange('countdown')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      activeMode === 'countdown'
                        ? "bg-white text-nat-accent-2 shadow-xs font-semibold"
                        : "text-nat-text opacity-70 hover:opacity-100"
                    )}
                  >
                    ⏳ Time Limit
                  </button>
                  <button
                    onClick={() => handleModeChange('stopwatch')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      activeMode === 'stopwatch'
                        ? "bg-white text-nat-accent-2 shadow-xs font-semibold"
                        : "text-nat-text opacity-70 hover:opacity-100"
                    )}
                  >
                    ⏱️ Stopwatch
                  </button>
                </div>

                {/* Preset Time Limits (When in Countdown Mode) - Compact & Clean */}
                {activeMode === 'countdown' && (
                  <div className="flex items-center gap-1">
                    {[
                      { label: '15m', mins: 15 },
                      { label: '25m ★', mins: 25, title: 'Recommended Focus' },
                      { label: '45m', mins: 45 },
                      { label: '60m', mins: 60 },
                    ].map(p => {
                      const isSelected = presetSeconds === p.mins * 60;
                      return (
                        <button
                          key={p.mins}
                          onClick={() => handleSetPreset(p.mins)}
                          title={p.title || `${p.mins} minutes limit`}
                          className={cn(
                            "py-1 px-2 rounded-lg text-[11px] font-medium transition-all border",
                            isSelected
                              ? "bg-nat-accent-1 border-nat-accent-1 text-white shadow-xs font-semibold"
                              : "bg-white/70 border-nat-border text-nat-text opacity-70 hover:opacity-100 hover:bg-white"
                          )}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Task Input and Single-Dropdown Tag Selector (Uncluttered!) */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  
                  {/* Task Name Field */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={customTaskName}
                      onChange={(e) => {
                        setCustomTaskName(e.target.value);
                        setSelectedTaskId('');
                      }}
                      placeholder="What are you focusing on?"
                      className="w-full bg-white/80 border border-nat-border rounded-xl px-3.5 py-2 text-xs md:text-sm text-nat-text placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-nat-accent-1/50 transition-all"
                    />
                  </div>

                  {/* Single Tag Button with Dropdown (Collapses to selected tag only) */}
                  <div className="relative" ref={tagDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-nat-border text-xs font-medium text-nat-accent-2 hover:bg-nat-light-1 transition-colors shadow-xs whitespace-nowrap"
                      title="Select category tag"
                    >
                      <Tag className="w-3.5 h-3.5 text-nat-accent-1" />
                      <span className="font-semibold">{category}</span>
                      <ChevronDown className={cn("w-3.5 h-3.5 opacity-60 transition-transform duration-200", isTagDropdownOpen && "rotate-180")} />
                    </button>

                    {/* Popover Dropdown Menu */}
                    {isTagDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-44 bg-nat-bg border border-nat-border rounded-2xl p-1.5 shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider opacity-50">
                          Select Tag
                        </div>
                        <div className="space-y-0.5">
                          {categories.map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setCategory(cat);
                                setIsTagDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors",
                                category === cat
                                  ? "bg-nat-accent-2 text-white font-semibold"
                                  : "text-nat-text hover:bg-nat-light-1"
                              )}
                            >
                              <span>{cat}</span>
                              {category === cat && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Task Link Selector if tasks exist */}
                  {tasks.length > 0 && (
                    <select
                      value={selectedTaskId}
                      onChange={(e) => setSelectedTaskId(e.target.value)}
                      className="hidden sm:block max-w-[130px] bg-white border border-nat-border rounded-xl px-2.5 py-2 text-xs text-nat-text focus:outline-none focus:ring-1 focus:ring-nat-accent-1 transition-all cursor-pointer truncate"
                      title="Link Workspace Task"
                    >
                      <option value="">Link Task...</option>
                      {tasks.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Custom Mins Stepper for Countdown (Compact inline) */}
                {activeMode === 'countdown' && (
                  <div className="flex items-center justify-between text-[11px] opacity-70 px-1">
                    <span>
                      Target: <strong className="text-nat-accent-2">{formatHoursMins(presetSeconds)}</strong>
                      {presetSeconds === 1500 && <span className="ml-1 text-nat-accent-1 font-semibold">(Recommended)</span>}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span>Custom mins:</span>
                      <input
                        type="number"
                        min="1"
                        max="480"
                        value={customMinutesInput}
                        onChange={(e) => {
                          setCustomMinutesInput(e.target.value);
                          handleApplyCustomMinutes(parseFloat(e.target.value));
                        }}
                        className="w-12 bg-white border border-nat-border rounded-md px-1.5 py-0.5 text-center text-xs focus:outline-none focus:ring-1 focus:ring-nat-accent-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Clock Big Display */}
              <div className="flex flex-col items-center justify-center my-4 py-2">
                
                {/* Finished Alert Banner */}
                {isFinishedAlert && (
                  <div className="mb-3 px-3.5 py-1.5 bg-nat-accent-3/20 border border-nat-accent-3 text-nat-accent-2 rounded-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
                    <Sparkles className="w-4 h-4 text-nat-accent-1" />
                    Time Limit Reached! Great job focusing. Save session below.
                  </div>
                )}

                {/* Digital Time Numbers */}
                <div className="relative">
                  <div className={cn(
                    "font-mono text-5xl md:text-6xl font-bold tracking-tight text-nat-text select-none",
                    isRunning && "text-nat-accent-2"
                  )}>
                    {activeMode === 'countdown' ? formatTime(secondsRemaining) : formatTime(secondsElapsed)}
                  </div>

                  <div className="flex items-center justify-center gap-1.5 mt-1.5">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      isRunning ? "bg-nat-accent-2 animate-ping" : "bg-gray-300"
                    )} />
                    <span className="text-[11px] font-medium uppercase tracking-widest opacity-60">
                      {isRunning 
                        ? (activeMode === 'countdown' ? 'Focusing...' : 'Tracking...') 
                        : (isFinishedAlert ? 'Completed' : 'Ready')}
                    </span>
                  </div>
                </div>

                {/* Progress Bar for Countdown */}
                {activeMode === 'countdown' && (
                  <div className="w-full max-w-sm mt-4 space-y-1">
                    <div className="h-1.5 w-full bg-nat-light-1 rounded-full overflow-hidden border border-nat-border/50">
                      <div 
                        className="h-full bg-gradient-to-r from-nat-accent-1 to-nat-accent-2 transition-all duration-500 rounded-full"
                        style={{ width: `${countdownPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Scaled-Down, Balanced Controls */}
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={handleResetTimer}
                  disabled={secondsElapsed === 0 && (activeMode === 'stopwatch' || secondsRemaining === presetSeconds)}
                  className="p-2.5 rounded-xl bg-white border border-nat-border text-nat-text opacity-70 hover:opacity-100 hover:bg-nat-light-1 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleToggleTimer}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-white font-medium text-xs md:text-sm flex items-center gap-2 shadow-sm transition-all transform active:scale-95",
                    isRunning
                      ? "bg-nat-accent-4 hover:bg-opacity-90"
                      : "bg-nat-accent-2 hover:bg-nat-accent-3"
                  )}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> {secondsElapsed > 0 ? "Resume" : "Start Tracking"}
                    </>
                  )}
                </button>

                <button
                  onClick={handleSaveSession}
                  disabled={secondsElapsed === 0 && !isFinishedAlert}
                  className="px-4 py-2.5 rounded-xl bg-nat-accent-1 text-white font-medium text-xs md:text-sm flex items-center gap-1.5 hover:bg-opacity-90 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs"
                  title="Finish & Save Time Log"
                >
                  <Check className="w-4 h-4" /> Save Log
                </button>
              </div>

              {/* Collapsible Session Reflection Note & Task Done Toggle */}
              <div className="mt-4 pt-3 border-t border-nat-border/50 text-center">
                {!isNotesOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsNotesOpen(true)}
                    className="text-[11px] font-medium text-nat-accent-2/70 hover:text-nat-accent-2 hover:underline inline-flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>+ Add Reflection Notes / Link Options</span>
                  </button>
                ) : (
                  <div className="text-left space-y-2 pt-1 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold opacity-60">
                        Session Notes / Reflection (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsNotesOpen(false)}
                        className="text-[10px] opacity-50 hover:opacity-100 hover:underline"
                      >
                        Hide
                      </button>
                    </div>
                    <input
                      type="text"
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="What did you accomplish during this session?"
                      className="w-full bg-white/70 border border-nat-border rounded-xl px-3 py-1.5 text-xs text-nat-text placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-nat-accent-1"
                    />

                    {selectedTaskId && (
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium opacity-80 hover:opacity-100 select-none pt-1">
                        <input
                          type="checkbox"
                          checked={markTaskDoneOnFinish}
                          onChange={(e) => setMarkTaskDoneOnFinish(e.target.checked)}
                          className="rounded border-nat-border text-nat-accent-2 focus:ring-nat-accent-2 w-3.5 h-3.5"
                        />
                        <span>Mark linked task as "Done" upon saving</span>
                      </label>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right: Today's Summary & Progress (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Daily Focus Summary Card */}
            <div className="glass p-5 rounded-3xl border border-nat-border shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-nat-border pb-2.5">
                <div>
                  <h2 className="serif text-base font-medium text-nat-accent-2">Today's Focus</h2>
                  <p className="text-[10px] opacity-60">Daily momentum & progress</p>
                </div>
                <button
                  onClick={() => setCurrentView('history')}
                  className="text-xs font-medium text-nat-accent-2 hover:text-nat-accent-3 flex items-center gap-1 hover:underline"
                  title="Open full history"
                >
                  <History className="w-3.5 h-3.5" /> History ({timeLogs.length})
                </button>
              </div>

              {/* Metric Blocks */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="bg-white/60 p-3 rounded-2xl border border-nat-border">
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60 block mb-0.5">
                    Total Time
                  </span>
                  <span className="text-xl font-bold font-mono text-nat-accent-2">
                    {formatHoursMins(totalTodaySeconds)}
                  </span>
                </div>

                <div className="bg-white/60 p-3 rounded-2xl border border-nat-border">
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60 block mb-0.5">
                    Sessions
                  </span>
                  <span className="text-xl font-bold font-mono text-nat-accent-1">
                    {todaysLogs.length}
                  </span>
                </div>
              </div>

              {/* Daily Goal Gauge */}
              <div className="bg-white/50 p-3.5 rounded-2xl border border-nat-border mb-3">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Award className="w-3.5 h-3.5 text-nat-accent-1" /> Goal ({dailyGoalMinutes / 60}h)
                  </span>
                  <span className="text-nat-accent-2 font-mono text-xs">{todayProgressPercent}%</span>
                </div>

                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-nat-accent-2 transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${todayProgressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mt-1.5 text-[10px] opacity-50">
                  <span>{todayMinutes}m logged</span>
                  <button
                    onClick={() => {
                      const newGoal = prompt('Set daily focus goal in hours (e.g. 4):', (dailyGoalMinutes / 60).toString());
                      if (newGoal && !isNaN(parseFloat(newGoal))) {
                        setDailyGoalMinutes(Math.round(parseFloat(newGoal) * 60));
                      }
                    }}
                    className="underline hover:text-nat-accent-2"
                  >
                    Edit goal
                  </button>
                </div>
              </div>

              {/* Time by Category Today */}
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider opacity-60 mb-2">
                  Category Breakdown
                </h3>
                {Object.keys(categoryBreakdown).length === 0 ? (
                  <p className="text-xs opacity-50 italic py-1 text-center">
                    No sessions recorded today yet.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {Object.entries(categoryBreakdown).map(([cat, rawSecs]) => {
                      const secs = Number(rawSecs) || 0;
                      const pct = totalTodaySeconds > 0 ? Math.round((secs / totalTodaySeconds) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-0.5">
                          <div className="flex justify-between text-[11px] font-medium">
                            <span>{cat}</span>
                            <span className="opacity-70 font-mono">{formatHoursMins(secs)} ({pct}%)</span>
                          </div>
                          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-nat-accent-1 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Productivity Advice Card */}
            <div className="bg-nat-light-1/60 p-3.5 rounded-2xl border border-nat-border text-xs space-y-1">
              <div className="font-semibold text-nat-accent-2 flex items-center gap-1.5 text-[11px]">
                <TrendingUp className="w-3.5 h-3.5" /> Recommended Rhythm
              </div>
              <p className="opacity-70 text-[11px] leading-relaxed">
                25 minutes of deep focus followed by a 5-minute break helps sustain mental stamina throughout the day.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 2: DEDICATED TIME LOG HISTORY VIEW (Uncluttered, with search, filters, and complete logs) */}
      {currentView === 'history' && (
        <div className="glass p-6 md:p-8 rounded-3xl border border-nat-border shadow-xs animate-in fade-in duration-200">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-nat-border pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('timer')}
                className="p-2 rounded-xl bg-white border border-nat-border text-nat-text opacity-70 hover:opacity-100 hover:bg-nat-light-1 transition-all"
                title="Back to Timer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="serif text-xl font-medium text-nat-accent-2">Time Log History</h2>
                <p className="text-xs opacity-60">All recorded focus sessions ({timeLogs.length} total)</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-white/80 border border-nat-border rounded-xl px-2.5 py-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 opacity-50" />
                <select
                  value={selectedFilterCategory}
                  onChange={(e) => setSelectedFilterCategory(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-xs cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions..."
                className="bg-white/80 border border-nat-border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-nat-accent-1 w-44"
              />

              <button
                onClick={() => setIsManualModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-nat-accent-2 text-white text-xs font-medium hover:bg-nat-accent-3 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Manual Entry
              </button>
            </div>
          </div>

          {/* History List */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 opacity-50 text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No time logs found matching your filters.</p>
              <button
                onClick={() => setCurrentView('timer')}
                className="mt-3 text-xs text-nat-accent-2 font-medium underline"
              >
                Start a new timer session
              </button>
            </div>
          ) : (
            <div className="divide-y divide-nat-border/50 max-h-[600px] overflow-y-auto pr-1">
              {filteredLogs.map(log => (
                <div key={log.id} className="py-3 px-2 hover:bg-white/40 rounded-xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-nat-light-1 border border-nat-border flex items-center justify-center text-nat-accent-2 shrink-0 mt-0.5 text-sm">
                      {log.mode === 'countdown' ? '⏳' : log.mode === 'stopwatch' ? '⏱️' : '📝'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs md:text-sm font-semibold text-nat-text">{log.taskName}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-nat-light-1 text-nat-accent-2 border border-nat-border">
                          {log.category}
                        </span>
                      </div>

                      {log.notes && (
                        <p className="text-xs opacity-60 mt-0.5 italic">{log.notes}</p>
                      )}

                      <div className="flex items-center gap-3 text-[10px] opacity-50 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {log.date}
                        </span>
                        <span>•</span>
                        <span>Mode: {log.mode}</span>
                        {log.targetSeconds && (
                          <span>(Target: {formatHoursMins(log.targetSeconds)})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-11 sm:pl-0">
                    <div className="text-right">
                      <span className="font-mono text-sm md:text-base font-bold text-nat-accent-2 block">
                        {formatHoursMins(log.durationSeconds)}
                      </span>
                      <span className="text-[10px] opacity-40 font-mono">
                        {formatTime(log.durationSeconds)}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteTimeLog(log.id)}
                      className="p-1.5 text-nat-text opacity-40 hover:opacity-100 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Manual Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-nat-bg border border-nat-border rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="serif text-lg font-medium text-nat-accent-2">Log Time Manually</h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 text-nat-text opacity-60 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddManualLog} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-70">Task / Activity Name *</label>
                <input
                  type="text"
                  required
                  value={manualTaskName}
                  onChange={(e) => setManualTaskName(e.target.value)}
                  placeholder="e.g. Completed Sprint Planning"
                  className="w-full bg-white border border-nat-border rounded-xl px-3 py-2 text-xs md:text-sm text-nat-text focus:outline-none focus:ring-1 focus:ring-nat-accent-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-70">Duration (Mins) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-nat-border rounded-xl px-3 py-2 text-xs md:text-sm text-nat-text focus:outline-none focus:ring-1 focus:ring-nat-accent-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-70">Date</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full bg-white border border-nat-border rounded-xl px-3 py-2 text-xs md:text-sm text-nat-text focus:outline-none focus:ring-1 focus:ring-nat-accent-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-70">Category</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full bg-white border border-nat-border rounded-xl px-3 py-2 text-xs md:text-sm text-nat-text focus:outline-none focus:ring-1 focus:ring-nat-accent-1"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-70">Notes (Optional)</label>
                <textarea
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Summary of work completed..."
                  rows={2}
                  className="w-full bg-white border border-nat-border rounded-xl px-3 py-2 text-xs md:text-sm text-nat-text resize-none focus:outline-none focus:ring-1 focus:ring-nat-accent-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium hover:bg-nat-light-1 text-nat-text opacity-70 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-nat-accent-2 text-white text-xs font-medium hover:bg-nat-accent-3"
                >
                  Save Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
