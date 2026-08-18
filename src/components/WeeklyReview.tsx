import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { format, startOfWeek, endOfWeek, subWeeks, addWeeks } from 'date-fns';
import {
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  Activity,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Edit3
} from 'lucide-react';

export const WeeklyReview: React.FC = () => {
  const { weeklyReviews, addWeeklyReview, deleteWeeklyReview, timeLogs, tasks } = useData();
  
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [showNewForm, setShowNewForm] = useState<boolean>(false);

  // Form states
  const [wins, setWins] = useState<string>('');
  const [bottlenecks, setBottlenecks] = useState<string>('');
  const [priorities, setPriorities] = useState<string[]>(['', '', '']);
  const [prodRating, setProdRating] = useState<number>(4);
  const [wellRating, setWellRating] = useState<number>(4);
  const [reviewNotes, setReviewNotes] = useState<string>('');

  const now = new Date();
  const currentWeekDate = addWeeks(now, currentWeekOffset);
  const weekStart = startOfWeek(currentWeekDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeekDate, { weekStartsOn: 1 });

  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');
  const weekLabel = `Week ${format(weekStart, 'w')} • ${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  // Calculate automated metrics for this week
  const weekTimeLogs = timeLogs.filter(l => l.date >= weekStartStr && l.date <= weekEndStr);
  const totalFocusMinutes = weekTimeLogs.reduce((acc, l) => acc + (l.durationSeconds / 60), 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  const completedTasksCount = tasks.filter(t => t.status === 'Done').length;

  const currentReview = weeklyReviews.find(r => r.startDate === weekStartStr);

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    addWeeklyReview({
      weekLabel,
      startDate: weekStartStr,
      endDate: weekEndStr,
      wins,
      bottlenecks,
      nextWeekPriorities: priorities.filter(p => p.trim().length > 0),
      productivityRating: prodRating,
      wellnessRating: wellRating,
      notes: reviewNotes
    });
    setShowNewForm(false);
    setWins('');
    setBottlenecks('');
    setPriorities(['', '', '']);
    setReviewNotes('');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Header & Week Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl serif italic tracking-wide text-nat-accent-2">Weekly Review & Scorecard</h1>
          <p className="text-nat-text opacity-60 mt-1 text-sm">Weekly alignment, metric aggregation, and sprint resets.</p>
        </div>

        {/* Week Switcher */}
        <div className="flex items-center gap-1.5 glass border border-nat-border p-1.5 rounded-xl shadow-xs">
          <button
            onClick={() => setCurrentWeekOffset(prev => prev - 1)}
            className="p-1.5 rounded-lg hover:bg-nat-light-1 text-nat-accent-2 transition-colors cursor-pointer"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-white/70 rounded-lg text-xs font-semibold text-nat-text">
            <Calendar className="w-3.5 h-3.5 text-nat-accent-2" />
            <span>{weekLabel}</span>
          </div>

          <button
            onClick={() => setCurrentWeekOffset(prev => prev + 1)}
            className="p-1.5 rounded-lg hover:bg-nat-light-1 text-nat-accent-2 transition-colors cursor-pointer"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {currentWeekOffset !== 0 && (
            <button
              onClick={() => setCurrentWeekOffset(0)}
              className="px-2.5 py-1 rounded-lg bg-nat-accent-2 text-white text-[11px] font-medium hover:bg-nat-accent-3 transition-colors ml-1 cursor-pointer"
            >
              Current
            </button>
          )}
        </div>
      </div>

      {/* AUTOMATED WEEKLY SCORECARD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass p-5 rounded-2xl border border-nat-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-nat-accent-1/20 flex items-center justify-center text-nat-accent-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-nat-text">{totalFocusHours} <span className="text-xs font-normal opacity-60">hrs</span></div>
            <div className="text-xs font-medium opacity-60">Deep Work Logged</div>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-nat-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-nat-text">{completedTasksCount}</div>
            <div className="text-xs font-medium opacity-60">Tasks Completed</div>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-nat-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-nat-text">{weekTimeLogs.length}</div>
            <div className="text-xs font-medium opacity-60">Focus Sessions</div>
          </div>
        </div>
      </div>

      {/* EXISTING REVIEW OR CREATE REVIEW FORM */}
      {currentReview ? (
        <div className="glass p-6 md:p-8 rounded-2xl border border-nat-border shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-nat-border">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-nat-accent-1" />
              <h2 className="serif text-xl font-medium text-nat-accent-2">{currentReview.weekLabel} Saved Review</h2>
            </div>
            <button
              onClick={() => deleteWeeklyReview(currentReview.id)}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-white/60 border border-nat-border space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">✨ Key Wins & Highlights</span>
              <p className="text-xs text-nat-text leading-relaxed whitespace-pre-line">{currentReview.wins}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/60 border border-nat-border space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">⚠️ Bottlenecks & Adjustments</span>
              <p className="text-xs text-nat-text leading-relaxed whitespace-pre-line">{currentReview.bottlenecks}</p>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-nat-accent-2 block mb-2">🎯 Next Week Top Priorities</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentReview.nextWeekPriorities.map((pri, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/70 border border-nat-border flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-nat-accent-2 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-nat-text">{pri}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-nat-border text-xs text-nat-text opacity-80">
            <div>Productivity Rating: <span className="font-bold text-nat-accent-2">{currentReview.productivityRating}/5 ⭐</span></div>
            <div>Wellness Rating: <span className="font-bold text-nat-accent-2">{currentReview.wellnessRating}/5 🌿</span></div>
          </div>
        </div>
      ) : (
        <div className="glass p-6 md:p-8 rounded-2xl border border-nat-border shadow-xs">
          {!showNewForm ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-nat-accent-1/20 border border-nat-accent-1/30 flex items-center justify-center text-nat-accent-4 mx-auto mb-4">
                <Edit3 className="w-6 h-6" />
              </div>
              <h3 className="serif text-lg font-medium text-nat-accent-2 mb-1">No Review Saved for {weekLabel}</h3>
              <p className="text-xs opacity-60 max-w-md mx-auto mb-6">
                Take 5 minutes to document your weekly wins, friction points, and focus for the week ahead.
              </p>
              <button
                onClick={() => setShowNewForm(true)}
                className="px-5 py-2.5 rounded-xl bg-nat-accent-2 text-white text-xs font-medium hover:bg-nat-accent-3 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Start Weekly Review</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateReview} className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-nat-border">
                <h2 className="serif text-lg font-medium text-nat-accent-2">Review Form: {weekLabel}</h2>
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="text-xs opacity-60 hover:opacity-100 px-3 py-1 rounded-lg border border-nat-border cursor-pointer hover:bg-white"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-2">
                  1. What were your major wins this week?
                </label>
                <textarea
                  required
                  value={wins}
                  onChange={e => setWins(e.target.value)}
                  placeholder="e.g. Completed the core feature milestones, maintained morning routines..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-nat-border bg-white/70 text-xs text-nat-text focus:border-nat-accent-2 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-2">
                  2. What were the bottlenecks or friction points?
                </label>
                <textarea
                  required
                  value={bottlenecks}
                  onChange={e => setBottlenecks(e.target.value)}
                  placeholder="e.g. Context switching between tasks slowed down afternoon progress..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-nat-border bg-white/70 text-xs text-nat-text focus:border-nat-accent-2 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-2">
                  3. Top 3 Priorities for Next Week
                </label>
                <div className="space-y-2.5">
                  {priorities.map((pri, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-nat-accent-2 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        required
                        value={pri}
                        onChange={e => {
                          const updated = [...priorities];
                          updated[idx] = e.target.value;
                          setPriorities(updated);
                        }}
                        placeholder={`Priority #${idx + 1}...`}
                        className="flex-1 px-3.5 py-2 rounded-lg border border-nat-border bg-white/70 text-xs text-nat-text focus:border-nat-accent-2 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-1">
                    Productivity Rating (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={prodRating}
                    onChange={e => setProdRating(parseInt(e.target.value))}
                    className="w-full accent-nat-accent-2"
                  />
                  <div className="text-[11px] font-bold text-nat-accent-2 mt-1">{prodRating} / 5 Stars</div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-1">
                    Wellness & Balance Rating (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={wellRating}
                    onChange={e => setWellRating(parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="text-[11px] font-bold text-emerald-600 mt-1">{wellRating} / 5 Balance</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-nat-border">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-2 rounded-lg border border-nat-border text-xs font-medium hover:bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-nat-accent-2 text-white text-xs font-medium hover:bg-nat-accent-3 shadow-xs cursor-pointer"
                >
                  Save Weekly Review
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* PAST REVIEWS ARCHIVE */}
      {weeklyReviews.length > 0 && (
        <div className="mt-8 pt-8 border-t border-nat-border">
          <h3 className="serif text-base font-medium text-nat-accent-2 mb-4">Past Reviews Archive ({weeklyReviews.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weeklyReviews.map(r => (
              <div key={r.id} className="p-4 rounded-xl glass border border-nat-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-nat-accent-2">{r.weekLabel}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-nat-accent-1/20 text-nat-accent-4">
                    {r.productivityRating}/5 Prod
                  </span>
                </div>
                <p className="text-xs opacity-70 line-clamp-2 mt-1">Wins: {r.wins}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

