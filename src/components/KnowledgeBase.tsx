import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { BookOpen, Headphones, FileText, MonitorPlay, Plus, Star, Sparkles } from 'lucide-react';
import { MediaType, MediaStatus } from '../types';

export const KnowledgeBase = () => {
  const { mediaLogs, addMediaLog, updateMediaLog, deleteMediaLog } = useData();
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | MediaType>('All');

  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('Book');
  const [status, setStatus] = useState<MediaStatus>('To Read/Watch');
  const [rating, setRating] = useState(0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addMediaLog({ title, type, status, rating, coverImage: '' });
    setTitle('');
    setRating(0);
    setShowForm(false);
  };

  const getIcon = (t: MediaType) => {
    switch (t) {
      case 'Book': return <BookOpen className="w-4 h-4 text-nat-accent-4" />;
      case 'Podcast': return <Headphones className="w-4 h-4 text-amber-600" />;
      case 'Article': return <FileText className="w-4 h-4 text-sky-600" />;
      case 'Course': return <MonitorPlay className="w-4 h-4 text-emerald-600" />;
      case 'Note': return <FileText className="w-4 h-4 text-purple-600" />;
    }
  };

  const displayedLogs = activeFilter === 'All' ? mediaLogs : mediaLogs.filter(m => m.type === activeFilter);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl serif italic tracking-wide text-nat-accent-2">Knowledge Base</h1>
          <p className="text-nat-text opacity-60 mt-1 text-sm">Your second brain: track books, podcasts, articles, and learning notes.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-nat-accent-2 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-nat-accent-3 transition-colors flex items-center gap-2 h-[36px] cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Book', 'Article', 'Podcast', 'Course', 'Note'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === f 
                ? 'bg-nat-accent-2 text-white shadow-xs' 
                : 'bg-white/80 text-nat-text border border-nat-border opacity-70 hover:opacity-100 hover:bg-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass p-6 rounded-2xl mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border border-nat-border shadow-xs">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium opacity-70 mb-1">Title</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full rounded-xl border-nat-border shadow-2xs focus:border-nat-accent-2 focus:ring-1 focus:ring-nat-accent-2 text-sm px-3.5 py-2 border bg-white/70 outline-none" 
              placeholder="Name of book, article, course, etc." 
            />
          </div>
          <div>
            <label className="block text-xs font-medium opacity-70 mb-1">Type</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value as MediaType)} 
              className="w-full rounded-xl border-nat-border shadow-2xs focus:border-nat-accent-2 text-sm px-3 py-2 border bg-white/70 outline-none"
            >
              <option value="Book">Book</option>
              <option value="Article">Article</option>
              <option value="Podcast">Podcast</option>
              <option value="Course">Course</option>
              <option value="Note">Note</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium opacity-70 mb-1">Status</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value as MediaStatus)} 
              className="w-full rounded-xl border-nat-border shadow-2xs focus:border-nat-accent-2 text-sm px-3 py-2 border bg-white/70 outline-none"
            >
              <option value="To Read/Watch">To Read/Watch</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="md:col-span-4 flex justify-end gap-2 mt-2">
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="px-4 py-2 text-xs font-medium opacity-70 hover:opacity-100 hover:bg-white rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-nat-accent-2 text-white px-5 py-2 rounded-xl text-xs font-medium hover:bg-nat-accent-3 transition-colors shadow-xs cursor-pointer"
            >
              Save to Library
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedLogs.map(log => (
          <div key={log.id} className="glass border border-nat-border rounded-2xl p-5 group hover:shadow-md transition-all flex flex-col h-full bg-white/80">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-white/80 border border-nat-border/60 rounded-xl">
                {getIcon(log.type)}
              </div>
              <button 
                onClick={() => deleteMediaLog(log.id)} 
                className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-50 rounded-lg cursor-pointer text-sm"
                title="Delete"
              >
                &times;
              </button>
            </div>
            
            <h3 className="font-medium text-base leading-snug mb-1 line-clamp-2 text-nat-text">{log.title}</h3>
            <p className="text-xs opacity-60 mb-4">{log.type}</p>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-nat-border/50">
               <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                 log.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                 log.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                 'bg-white text-nat-text border border-nat-border opacity-80'
               }`}>
                 {log.status}
               </span>
               <div className="flex items-center gap-0.5">
                 {[1,2,3,4,5].map(star => (
                   <button 
                     key={star}
                     onClick={() => updateMediaLog(log.id, { rating: star })}
                     className="focus:outline-none cursor-pointer"
                   >
                     <Star className={`w-3.5 h-3.5 ${star <= log.rating ? 'fill-nat-accent-4 text-nat-accent-4' : 'text-nat-border'}`} />
                   </button>
                 ))}
               </div>
            </div>
          </div>
        ))}
        {displayedLogs.length === 0 && (
          <div className="col-span-full py-12 text-center opacity-60 bg-white/40 rounded-2xl border border-dashed border-nat-border text-xs">
            No items in your library yet. Add books, articles, or courses above.
          </div>
        )}
      </div>
    </div>
  );
};

