import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { ScratchpadNote } from '../types';
import { format } from 'date-fns';
import {
  StickyNote,
  Plus,
  Pin,
  Trash2,
  ArrowRightCircle,
  Search,
  Check,
  ClipboardList
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Scratchpad: React.FC = () => {
  const { scratchpadNotes, addScratchpadNote, updateScratchpadNote, deleteScratchpadNote, convertNoteToTask } = useData();
  const [newContent, setNewContent] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [priorityChoice, setPriorityChoice] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const colorPalette = [
    { bg: '#FFFFFF', label: 'Clean White' },
    { bg: '#FEFBF3', label: 'Warm Sand' },
    { bg: '#F4F7F4', label: 'Sage Mint' },
    { bg: '#F8F6FB', label: 'Lavender' },
    { bg: '#FCF6F6', label: 'Soft Rose' }
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    addScratchpadNote(newContent.trim(), selectedColor);
    setNewContent('');
  };

  const filteredNotes = scratchpadNotes.filter(n =>
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Header & Quick Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl serif italic tracking-wide text-nat-accent-2">Quick Capture & Scratchpad</h1>
          <p className="text-nat-text opacity-60 mt-1 text-sm">Instant thoughts, fleeting ideas, and quick task conversions.</p>
        </div>

        {/* Search in clean glass style */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-nat-text opacity-40" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-nat-border glass text-xs text-nat-text focus:border-nat-accent-2 outline-none"
          />
        </div>
      </div>

      {/* QUICK CAPTURE INPUT BOX */}
      <form onSubmit={handleAddNote} className="glass p-5 rounded-2xl border border-nat-border shadow-xs mb-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-nat-accent-2">
          <StickyNote className="w-4 h-4 text-nat-accent-1" />
          <span>Quick Note / Fleeting Idea</span>
        </div>

        <textarea
          rows={2}
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="Capture an idea, quick snippet, fleeting thought, or to-do..."
          className="w-full p-3.5 rounded-xl border border-nat-border bg-white/70 text-xs text-nat-text focus:border-nat-accent-2 outline-none resize-none transition-all"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Color choices */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] opacity-60 font-medium">Card Tint:</span>
            <div className="flex items-center gap-1.5">
              {colorPalette.map(c => (
                <button
                  type="button"
                  key={c.bg}
                  onClick={() => setSelectedColor(c.bg)}
                  className={cn(
                    "w-6 h-6 rounded-full border border-nat-border transition-transform cursor-pointer flex items-center justify-center shadow-2xs",
                    selectedColor === c.bg ? "scale-110 ring-2 ring-nat-accent-2" : "hover:scale-105"
                  )}
                  style={{ backgroundColor: c.bg }}
                  title={c.label}
                >
                  {selectedColor === c.bg && <Check className="w-3 h-3 text-nat-text" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!newContent.trim()}
            className="px-5 py-2 rounded-xl bg-nat-accent-2 text-white text-xs font-medium hover:bg-nat-accent-3 disabled:opacity-40 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Pin to Scratchpad</span>
          </button>
        </div>
      </form>

      {/* NOTES GRID */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 bg-white/40 rounded-2xl border border-dashed border-nat-border">
          <StickyNote className="w-10 h-10 text-nat-accent-1/40 mx-auto mb-2" />
          <p className="text-xs font-medium opacity-60">Scratchpad is empty. Use the box above to capture thoughts instantly.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-3">
                <Pin className="w-3.5 h-3.5 fill-nat-accent-2 text-nat-accent-2" />
                <span>Pinned ({pinnedNotes.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {pinnedNotes.map(n => renderNoteCard(n))}
              </div>
            </div>
          )}

          {/* Regular Notes Section */}
          {otherNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <div className="text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-3">
                  <span>Other Notes ({otherNotes.length})</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {otherNotes.map(n => renderNoteCard(n))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONVERT TO TASK MODAL */}
      {convertingId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-nat-border rounded-2xl p-6 max-w-md w-full shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-nat-accent-2 mb-3">
              <ClipboardList className="w-5 h-5 text-nat-accent-2" />
              <h3 className="serif text-base font-medium">Convert Note to Task</h3>
            </div>
            
            <p className="text-xs opacity-70 mb-4 leading-relaxed">
              Select priority level. This note will be removed from the scratchpad and converted directly into your Action Plan.
            </p>

            <div className="flex gap-2 mb-6">
              {(['Low', 'Medium', 'High'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriorityChoice(p)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer",
                    priorityChoice === p
                      ? "bg-nat-accent-2 text-white border-nat-accent-2 shadow-2xs"
                      : "bg-nat-light-1/60 border-nat-border text-nat-text hover:bg-white"
                  )}
                >
                  {p} Priority
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConvertingId(null)}
                className="px-4 py-2 rounded-xl border border-nat-border text-xs font-medium hover:bg-nat-light-1 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const note = scratchpadNotes.find(n => n.id === convertingId);
                  if (note) {
                    convertNoteToTask(note.id, note.content, priorityChoice);
                  }
                  setConvertingId(null);
                }}
                className="px-5 py-2 rounded-xl bg-nat-accent-2 text-white text-xs font-medium hover:bg-nat-accent-3 shadow-xs cursor-pointer"
              >
                Convert to Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  function renderNoteCard(n: ScratchpadNote) {
    return (
      <div
        key={n.id}
        className="p-5 rounded-2xl border border-nat-border shadow-xs flex flex-col justify-between transition-all hover:shadow-md group"
        style={{ backgroundColor: n.color || '#FFFFFF' }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium opacity-50 text-nat-text">
              {format(new Date(n.createdAt), 'MMM d, h:mm a')}
            </span>
            <button
              onClick={() => updateScratchpadNote(n.id, { pinned: !n.pinned })}
              className={cn(
                "p-1 rounded-lg transition-opacity cursor-pointer",
                n.pinned ? "opacity-100 text-nat-accent-4" : "opacity-30 group-hover:opacity-100 text-nat-text hover:text-nat-accent-2"
              )}
              title={n.pinned ? "Unpin note" : "Pin note to top"}
            >
              <Pin className={cn("w-3.5 h-3.5", n.pinned && "fill-nat-accent-4")} />
            </button>
          </div>

          <p className="text-xs text-nat-text leading-relaxed whitespace-pre-line font-normal">
            {n.content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-3 border-t border-nat-border/50">
          <button
            onClick={() => setConvertingId(n.id)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-nat-accent-2 hover:text-nat-accent-3 transition-colors cursor-pointer"
            title="Convert to Task"
          >
            <ArrowRightCircle className="w-3.5 h-3.5 text-nat-accent-2" />
            <span>To Task</span>
          </button>

          <button
            onClick={() => deleteScratchpadNote(n.id)}
            className="p-1 text-nat-text opacity-40 hover:opacity-100 hover:text-rose-500 transition-opacity cursor-pointer"
            title="Delete Note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }
};

