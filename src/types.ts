export type GoalStatus = 'Not Started' | 'In Progress' | 'Achieved';
export type GoalCategory = 'Career' | 'Personal' | 'Health' | 'Finance' | 'Learning';

export interface Goal {
  id: string;
  name: string;
  category: GoalCategory;
  targetDate: string;
  status: GoalStatus;
  progress: number;
}

export type ProjectStatus = 'In Progress' | 'On Hold' | 'Completed';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  deadline: string;
  goalId?: string;
}

export type Priority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'Doing' | 'Done';

export interface Task {
  id: string;
  name: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  projectId?: string;
}

export interface HabitDefinition {
  id: string; // use this as the key in the tracker
  name: string;
  icon: string;
}

export interface HabitTracker {
  id: string; // date string YYYY-MM-DD
  date: string; 
  habits: {
    [key: string]: boolean;
  }
}

export type TransactionType = 'Income' | 'Expense' | 'Subscription';
export type TransactionCategory = 'Rent' | 'Food' | 'Salary' | 'Entertainment' | 'Investments' | 'Other';

export interface Transaction {
  id: string;
  item: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
}

export type MediaType = 'Book' | 'Article' | 'Podcast' | 'Course' | 'Note';
export type MediaStatus = 'To Read/Watch' | 'In Progress' | 'Completed';

export interface MediaLog {
  id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  rating: number; // 1-5
  coverImage?: string;
}

export type TimeTrackerMode = 'stopwatch' | 'countdown' | 'manual';

export interface TimeLog {
  id: string;
  taskName: string;
  category: string;
  date: string; // YYYY-MM-DD
  durationSeconds: number;
  mode: TimeTrackerMode;
  targetSeconds?: number;
  notes?: string;
  completedAt: string; // ISO timestamp
  taskId?: string;
}

export type MoodType = 'great' | 'good' | 'neutral' | 'tired' | 'stressed';

export interface DailyJournalEntry {
  id: string; // YYYY-MM-DD
  date: string; // YYYY-MM-DD
  mood: MoodType;
  energyLevel: number; // 1 to 5
  morningIntention: string;
  eveningReflection: string;
  gratitude: string[];
  waterGlasses: number; // 0 to 12
  sleepHours: number; // e.g. 7.5
  tags: string[];
}

export interface WeeklyReview {
  id: string;
  weekLabel: string; // e.g. "Week 33 - Aug 2026"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  wins: string;
  bottlenecks: string;
  nextWeekPriorities: string[];
  productivityRating: number; // 1 to 5
  wellnessRating: number; // 1 to 5
  notes?: string;
  createdAt: string;
}

export interface ScratchpadNote {
  id: string;
  content: string;
  color?: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ThemeId = 'gildedsilk' | 'obsidianelite' | 'obsidiansilk' | 'luxurymarble' | 'dailyrecord' | 'lanternpeaks' | 'solardune' | 'auric' | 'oasis' | 'midnight' | 'sand' | 'forest' | 'lavender' | 'rose';
export type FontStyleId = 'whimsical' | 'arcane' | 'regal' | 'serif' | 'sans' | 'mono' | 'rounded';
export type FontSizeId = 'sm' | 'base' | 'lg' | 'xl';
export type IconSizeId = 'sm' | 'base' | 'lg';
export type EmojiScaleId = 'sm' | 'base' | 'lg';
export type EmojiImageStyleId = 'illustrated' | 'minimal' | 'badge';

export interface AppSettings {
  theme: ThemeId;
  fontStyle: FontStyleId;
  fontSize: FontSizeId;
  iconSize: IconSizeId;
  emojiScale: EmojiScaleId;
  useImagesForEmojis: boolean;
  emojiImageStyle: EmojiImageStyleId;
  bgBlur: number;
}


