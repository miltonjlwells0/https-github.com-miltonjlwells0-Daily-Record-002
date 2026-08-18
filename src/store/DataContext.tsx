import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Goal, Project, Task, HabitTracker, Transaction, MediaLog, HabitDefinition, TimeLog,
  DailyJournalEntry, WeeklyReview, ScratchpadNote, MoodType
} from '../types';
import { generateId } from '../lib/utils';
import { format } from 'date-fns';

interface DataContextType {
  goals: Goal[];
  projects: Project[];
  tasks: Task[];
  habits: HabitTracker[];
  habitDefs: HabitDefinition[];
  transactions: Transaction[];
  mediaLogs: MediaLog[];
  timeLogs: TimeLog[];
  dailyJournals: DailyJournalEntry[];
  weeklyReviews: WeeklyReview[];
  scratchpadNotes: ScratchpadNote[];
  
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  addHabitDef: (def: Omit<HabitDefinition, 'id'>) => void;
  deleteHabitDef: (id: string) => void;
  toggleHabit: (date: string, habitKey: string) => void;
  
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  addMediaLog: (media: Omit<MediaLog, 'id'>) => void;
  updateMediaLog: (id: string, media: Partial<MediaLog>) => void;
  deleteMediaLog: (id: string) => void;

  addTimeLog: (log: Omit<TimeLog, 'id'>) => void;
  updateTimeLog: (id: string, log: Partial<TimeLog>) => void;
  deleteTimeLog: (id: string) => void;

  // Daily Journal & Wellness
  getJournalForDate: (date: string) => DailyJournalEntry;
  saveDailyJournal: (entry: DailyJournalEntry) => void;
  updateDailyWellness: (date: string, updates: Partial<DailyJournalEntry>) => void;

  // Weekly Reviews
  addWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => void;
  updateWeeklyReview: (id: string, updates: Partial<WeeklyReview>) => void;
  deleteWeeklyReview: (id: string) => void;

  // Quick Scratchpad
  addScratchpadNote: (content: string, color?: string) => void;
  updateScratchpadNote: (id: string, updates: Partial<ScratchpadNote>) => void;
  deleteScratchpadNote: (id: string) => void;
  convertNoteToTask: (noteId: string, taskName: string, priority?: 'High' | 'Medium' | 'Low') => void;

  // Backup, Export & Import
  exportAllDataJSON: () => string;
  importAllDataJSON: (jsonString: string) => boolean;
  exportCSV: (type: 'timeLogs' | 'transactions' | 'tasks' | 'habits') => string;
  resetAllData: () => void;
}

const defaultGoals: Goal[] = [
  { id: 'g1', name: 'Learn AI Development', category: 'Learning', targetDate: '2026-12-31', status: 'In Progress', progress: 40 },
  { id: 'g2', name: 'Save $10,000', category: 'Finance', targetDate: '2026-11-01', status: 'In Progress', progress: 65 }
];

const defaultProjects: Project[] = [
  { id: 'p1', name: 'Zenith OS Build', status: 'In Progress', deadline: '2026-08-30', goalId: 'g1' },
  { id: 'p2', name: 'Emergency Fund', status: 'In Progress', deadline: '2026-10-15', goalId: 'g2' }
];

const today = format(new Date(), 'yyyy-MM-dd');
const defaultTasks: Task[] = [
  { id: 't1', name: 'Design dashboard UI', dueDate: today, priority: 'High', status: 'Doing', projectId: 'p1' },
  { id: 't2', name: 'Transfer savings', dueDate: today, priority: 'Medium', status: 'To Do', projectId: 'p2' },
  { id: 't3', name: 'Read chapter 3', dueDate: '2026-08-10', priority: 'Low', status: 'To Do' }
];

const defaultHabitDefs: HabitDefinition[] = [];

const defaultHabits: HabitTracker[] = [];

const defaultTransactions: Transaction[] = [
  { id: 'tr1', item: 'Salary', amount: 5000, type: 'Income', category: 'Salary', date: '2026-08-01' },
  { id: 'tr2', item: 'Rent', amount: 1500, type: 'Expense', category: 'Rent', date: '2026-08-02' },
  { id: 'tr3', item: 'Netflix', amount: 15.99, type: 'Subscription', category: 'Entertainment', date: '2026-08-05' }
];

const defaultMediaLogs: MediaLog[] = [
  { id: 'm1', title: 'Deep Work', type: 'Book', status: 'In Progress', rating: 4 },
  { id: 'm2', title: 'React 19 Changes', type: 'Article', status: 'To Read/Watch', rating: 0 }
];

const defaultTimeLogs: TimeLog[] = [
  {
    id: 'tl1',
    taskName: 'Design dashboard UI',
    category: 'Deep Work',
    date: today,
    durationSeconds: 3000, // 50 mins
    mode: 'countdown',
    targetSeconds: 3000,
    notes: 'Completed wireframing and component layout',
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    taskId: 't1'
  },
  {
    id: 'tl2',
    taskName: 'Zenith Architecture Review',
    category: 'Coding',
    date: today,
    durationSeconds: 1500, // 25 mins
    mode: 'stopwatch',
    notes: 'Reviewed module structure and state management',
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  }
];

const defaultDailyJournals: DailyJournalEntry[] = [
  {
    id: '2024-05-15',
    date: '2024-05-15',
    mood: 'great',
    energyLevel: 5,
    morningIntention: "Let's make today count. Focused progress and intentional deep work.",
    eveningReflection: 'Grateful for the progress I made today. Consistency is the key.',
    gratitude: [
      'Grateful for the progress I made today. Consistency is the key.',
      'Calm morning mindset and productive momentum',
      'Unbroken habit streak and disciplined routine'
    ],
    waterGlasses: 8,
    sleepHours: 8.0,
    tags: ['consistency', 'progress', 'gratitude', 'reflection']
  },
  {
    id: today,
    date: today,
    mood: 'great',
    energyLevel: 4,
    morningIntention: 'Focus on core system architecture and thoughtful execution without rushing.',
    eveningReflection: 'Made great progress on modular offline persistence and intuitive interface layouts.',
    gratitude: ['Quiet morning coffee', 'Clarity on product direction', 'Reliable offline tools'],
    waterGlasses: 6,
    sleepHours: 7.5,
    tags: ['focus', 'design', 'mindfulness']
  }
];

const defaultWeeklyReviews: WeeklyReview[] = [
  {
    id: 'w-review-1',
    weekLabel: 'Week 32 Review',
    startDate: '2026-08-03',
    endDate: '2026-08-09',
    wins: 'Finished the goal-to-task pipeline and built out the deep focus time tracker with stopwatch & Pomodoro countdowns.',
    bottlenecks: 'Context switching between too many micro tasks mid-afternoon.',
    nextWeekPriorities: [
      'Complete offline data backup and micro-journal modules',
      'Optimize habit streak calculations',
      'Refine typography and theme responsiveness'
    ],
    productivityRating: 5,
    wellnessRating: 4,
    notes: 'Energy was consistent throughout the week.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

const defaultScratchpads: ScratchpadNote[] = [
  {
    id: 'sn-0',
    content: '“Grateful for the progress I made today. Consistency is the key.” — Daily Record reflection (07:45 AM)',
    color: '#FEF3C7',
    pinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sn-1',
    content: 'Review quarterly savings targets and set up automated allocation.',
    color: '#FEF3C7',
    pinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sn-2',
    content: 'Book recommendations from friend: "Atomic Habits", "Four Thousand Weeks", "Essentialism".',
    color: '#E0E7FF',
    pinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('zenith_goals');
    return saved ? JSON.parse(saved) : defaultGoals;
  });
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('zenith_projects');
    return saved ? JSON.parse(saved) : defaultProjects;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zenith_tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [habitDefs, setHabitDefs] = useState<HabitDefinition[]>(() => {
    const saved = localStorage.getItem('zenith_habitDefs');
    return saved ? JSON.parse(saved) : defaultHabitDefs;
  });
  
  const [habits, setHabits] = useState<HabitTracker[]>(() => {
    const saved = localStorage.getItem('zenith_habits');
    return saved ? JSON.parse(saved) : defaultHabits;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('zenith_transactions');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });
  
  const [mediaLogs, setMediaLogs] = useState<MediaLog[]>(() => {
    const saved = localStorage.getItem('zenith_mediaLogs');
    return saved ? JSON.parse(saved) : defaultMediaLogs;
  });

  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(() => {
    const saved = localStorage.getItem('zenith_timeLogs');
    return saved ? JSON.parse(saved) : defaultTimeLogs;
  });

  const [dailyJournals, setDailyJournals] = useState<DailyJournalEntry[]>(() => {
    const saved = localStorage.getItem('zenith_dailyJournals');
    if (!saved) return defaultDailyJournals;
    try {
      const parsed = JSON.parse(saved);
      const existingDates = new Set(parsed.map((j: DailyJournalEntry) => j.date));
      const missingDefaults = defaultDailyJournals.filter(d => !existingDates.has(d.date));
      return [...parsed, ...missingDefaults];
    } catch {
      return defaultDailyJournals;
    }
  });

  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>(() => {
    const saved = localStorage.getItem('zenith_weeklyReviews');
    return saved ? JSON.parse(saved) : defaultWeeklyReviews;
  });

  const [scratchpadNotes, setScratchpadNotes] = useState<ScratchpadNote[]>(() => {
    const saved = localStorage.getItem('zenith_scratchpadNotes');
    if (!saved) return defaultScratchpads;
    try {
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map((n: ScratchpadNote) => n.id));
      const missingDefaults = defaultScratchpads.filter(d => !existingIds.has(d.id));
      return [...missingDefaults, ...parsed];
    } catch {
      return defaultScratchpads;
    }
  });

  useEffect(() => { localStorage.setItem('zenith_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('zenith_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('zenith_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('zenith_habitDefs', JSON.stringify(habitDefs)); }, [habitDefs]);
  useEffect(() => { localStorage.setItem('zenith_habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('zenith_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('zenith_mediaLogs', JSON.stringify(mediaLogs)); }, [mediaLogs]);
  useEffect(() => { localStorage.setItem('zenith_timeLogs', JSON.stringify(timeLogs)); }, [timeLogs]);
  useEffect(() => { localStorage.setItem('zenith_dailyJournals', JSON.stringify(dailyJournals)); }, [dailyJournals]);
  useEffect(() => { localStorage.setItem('zenith_weeklyReviews', JSON.stringify(weeklyReviews)); }, [weeklyReviews]);
  useEffect(() => { localStorage.setItem('zenith_scratchpadNotes', JSON.stringify(scratchpadNotes)); }, [scratchpadNotes]);

  // Goal actions
  const addGoal = (g: Omit<Goal, 'id'>) => setGoals([...goals, { ...g, id: generateId() }]);
  const updateGoal = (id: string, updates: Partial<Goal>) => setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
  const deleteGoal = (id: string) => setGoals(goals.filter(g => g.id !== id));

  // Project actions
  const addProject = (p: Omit<Project, 'id'>) => setProjects([...projects, { ...p, id: generateId() }]);
  const updateProject = (id: string, updates: Partial<Project>) => setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  const deleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  // Task actions
  const addTask = (t: Omit<Task, 'id'>) => setTasks([...tasks, { ...t, id: generateId() }]);
  const updateTask = (id: string, updates: Partial<Task>) => setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  // Habit actions
  const addHabitDef = (def: Omit<HabitDefinition, 'id'>) => setHabitDefs([...habitDefs, { ...def, id: generateId() }]);
  const deleteHabitDef = (id: string) => setHabitDefs(habitDefs.filter(h => h.id !== id));

  const toggleHabit = (date: string, habitKey: string) => {
    setHabits(prev => {
      const existingDay = prev.find(h => h.date === date);
      if (existingDay) {
        return prev.map(h => {
          if (h.date === date) {
            return { ...h, habits: { ...h.habits, [habitKey]: !h.habits[habitKey] } };
          }
          return h;
        });
      } else {
        const newHabitDay: HabitTracker = {
          id: date,
          date,
          habits: { [habitKey]: true }
        };
        return [...prev, newHabitDay];
      }
    });
  };

  // Transaction actions
  const addTransaction = (t: Omit<Transaction, 'id'>) => setTransactions([...transactions, { ...t, id: generateId() }]);
  const deleteTransaction = (id: string) => setTransactions(transactions.filter(t => t.id !== id));

  // MediaLog actions
  const addMediaLog = (m: Omit<MediaLog, 'id'>) => setMediaLogs([...mediaLogs, { ...m, id: generateId() }]);
  const updateMediaLog = (id: string, updates: Partial<MediaLog>) => setMediaLogs(mediaLogs.map(m => m.id === id ? { ...m, ...updates } : m));
  const deleteMediaLog = (id: string) => setMediaLogs(mediaLogs.filter(m => m.id !== id));

  // TimeLog actions
  const addTimeLog = (log: Omit<TimeLog, 'id'>) => setTimeLogs(prev => [{ ...log, id: generateId() }, ...prev]);
  const updateTimeLog = (id: string, updates: Partial<TimeLog>) => setTimeLogs(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  const deleteTimeLog = (id: string) => setTimeLogs(prev => prev.filter(l => l.id !== id));

  // Daily Journal actions
  const getJournalForDate = (date: string): DailyJournalEntry => {
    const existing = dailyJournals.find(j => j.date === date);
    if (existing) return existing;
    return {
      id: date,
      date,
      mood: 'neutral',
      energyLevel: 3,
      morningIntention: '',
      eveningReflection: '',
      gratitude: ['', '', ''],
      waterGlasses: 0,
      sleepHours: 7,
      tags: []
    };
  };

  const saveDailyJournal = (entry: DailyJournalEntry) => {
    setDailyJournals(prev => {
      const idx = prev.findIndex(j => j.date === entry.date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = entry;
        return updated;
      }
      return [entry, ...prev];
    });
  };

  const updateDailyWellness = (date: string, updates: Partial<DailyJournalEntry>) => {
    setDailyJournals(prev => {
      const idx = prev.findIndex(j => j.date === date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...updates };
        return updated;
      }
      const newEntry: DailyJournalEntry = {
        id: date,
        date,
        mood: updates.mood || 'neutral',
        energyLevel: updates.energyLevel || 3,
        morningIntention: updates.morningIntention || '',
        eveningReflection: updates.eveningReflection || '',
        gratitude: updates.gratitude || ['', '', ''],
        waterGlasses: updates.waterGlasses !== undefined ? updates.waterGlasses : 0,
        sleepHours: updates.sleepHours !== undefined ? updates.sleepHours : 7,
        tags: updates.tags || []
      };
      return [newEntry, ...prev];
    });
  };

  // Weekly Reviews actions
  const addWeeklyReview = (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => {
    const newRev: WeeklyReview = {
      ...review,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setWeeklyReviews(prev => [newRev, ...prev]);
  };

  const updateWeeklyReview = (id: string, updates: Partial<WeeklyReview>) => {
    setWeeklyReviews(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteWeeklyReview = (id: string) => {
    setWeeklyReviews(prev => prev.filter(r => r.id !== id));
  };

  // Scratchpad actions
  const addScratchpadNote = (content: string, color = '#FEF3C7') => {
    const note: ScratchpadNote = {
      id: generateId(),
      content,
      color,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setScratchpadNotes(prev => [note, ...prev]);
  };

  const updateScratchpadNote = (id: string, updates: Partial<ScratchpadNote>) => {
    setScratchpadNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };

  const deleteScratchpadNote = (id: string) => {
    setScratchpadNotes(prev => prev.filter(n => n.id !== id));
  };

  const convertNoteToTask = (noteId: string, taskName: string, priority: 'High' | 'Medium' | 'Low' = 'Medium') => {
    addTask({
      name: taskName,
      dueDate: today,
      priority,
      status: 'To Do'
    });
    deleteScratchpadNote(noteId);
  };

  // Backup, Export & Import functions
  const exportAllDataJSON = (): string => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      goals,
      projects,
      tasks,
      habitDefs,
      habits,
      transactions,
      mediaLogs,
      timeLogs,
      dailyJournals,
      weeklyReviews,
      scratchpadNotes
    };
    return JSON.stringify(data, null, 2);
  };

  const importAllDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.goals)) setGoals(data.goals);
      if (Array.isArray(data.projects)) setProjects(data.projects);
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (Array.isArray(data.habitDefs)) setHabitDefs(data.habitDefs);
      if (Array.isArray(data.habits)) setHabits(data.habits);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      if (Array.isArray(data.mediaLogs)) setMediaLogs(data.mediaLogs);
      if (Array.isArray(data.timeLogs)) setTimeLogs(data.timeLogs);
      if (Array.isArray(data.dailyJournals)) setDailyJournals(data.dailyJournals);
      if (Array.isArray(data.weeklyReviews)) setWeeklyReviews(data.weeklyReviews);
      if (Array.isArray(data.scratchpadNotes)) setScratchpadNotes(data.scratchpadNotes);
      return true;
    } catch (err) {
      console.error('Failed to import backup JSON', err);
      return false;
    }
  };

  const exportCSV = (type: 'timeLogs' | 'transactions' | 'tasks' | 'habits'): string => {
    if (type === 'timeLogs') {
      const headers = ['Date', 'Task Name', 'Category', 'Duration (Minutes)', 'Mode', 'Notes', 'Completed At'];
      const rows = timeLogs.map(l => [
        `"${l.date}"`,
        `"${(l.taskName || '').replace(/"/g, '""')}"`,
        `"${(l.category || '').replace(/"/g, '""')}"`,
        (l.durationSeconds / 60).toFixed(1),
        `"${l.mode}"`,
        `"${(l.notes || '').replace(/"/g, '""')}"`,
        `"${l.completedAt}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    if (type === 'transactions') {
      const headers = ['Date', 'Item', 'Amount', 'Type', 'Category'];
      const rows = transactions.map(t => [
        `"${t.date}"`,
        `"${t.item.replace(/"/g, '""')}"`,
        t.amount,
        `"${t.type}"`,
        `"${t.category}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    if (type === 'tasks') {
      const headers = ['Task Name', 'Due Date', 'Priority', 'Status', 'Project ID'];
      const rows = tasks.map(t => [
        `"${t.name.replace(/"/g, '""')}"`,
        `"${t.dueDate}"`,
        `"${t.priority}"`,
        `"${t.status}"`,
        `"${t.projectId || ''}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    return '';
  };

  const resetAllData = () => {
    setGoals(defaultGoals);
    setProjects(defaultProjects);
    setTasks(defaultTasks);
    setHabitDefs(defaultHabitDefs);
    setHabits(defaultHabits);
    setTransactions(defaultTransactions);
    setMediaLogs(defaultMediaLogs);
    setTimeLogs(defaultTimeLogs);
    setDailyJournals(defaultDailyJournals);
    setWeeklyReviews(defaultWeeklyReviews);
    setScratchpadNotes(defaultScratchpads);
    localStorage.clear();
  };

  return (
    <DataContext.Provider value={{
      goals, projects, tasks, habits, habitDefs, transactions, mediaLogs, timeLogs,
      dailyJournals, weeklyReviews, scratchpadNotes,
      addGoal, updateGoal, deleteGoal,
      addProject, updateProject, deleteProject,
      addTask, updateTask, deleteTask,
      addHabitDef, deleteHabitDef, toggleHabit,
      addTransaction, deleteTransaction,
      addMediaLog, updateMediaLog, deleteMediaLog,
      addTimeLog, updateTimeLog, deleteTimeLog,
      getJournalForDate, saveDailyJournal, updateDailyWellness,
      addWeeklyReview, updateWeeklyReview, deleteWeeklyReview,
      addScratchpadNote, updateScratchpadNote, deleteScratchpadNote, convertNoteToTask,
      exportAllDataJSON, importAllDataJSON, exportCSV, resetAllData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

