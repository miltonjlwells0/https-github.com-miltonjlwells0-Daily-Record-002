import React from 'react';
import {
  Home,
  Target,
  Briefcase,
  Activity,
  DollarSign,
  BookOpen,
  Timer,
  Settings as SettingsIcon,
  BookMarked,
  Award,
  StickyNote
} from 'lucide-react';
import { cn } from '../lib/utils';
import { logoImg } from '../assets/wallpapers';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const navGroups = [
    {
      group: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'journal', label: 'Daily Journal', icon: BookMarked },
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'projects', label: 'Projects & Tasks', icon: Briefcase },
        { id: 'timetracker', label: 'Time Tracker', icon: Timer },
        { id: 'habits', label: 'Habits & Vitals', icon: Activity },
        { id: 'finance', label: 'Finance', icon: DollarSign },
      ]
    },
    {
      group: 'Thinking & Review',
      items: [
        { id: 'review', label: 'Weekly Review', icon: Award },
        { id: 'scratchpad', label: 'Quick Capture', icon: StickyNote },
        { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
      ]
    },
    {
      group: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-nat-bg md:bg-transparent border-r border-nat-border h-screen flex flex-col p-4 md:p-6 shrink-0 no-scrollbar relative z-10 overflow-y-auto">
      <div className="flex items-center gap-3 px-2 py-3 mb-2">
        <img 
          src={logoImg} 
          alt="Daily Record Logo" 
          className="w-10 h-10 rounded-xl shadow-md border border-amber-500/40 object-cover shrink-0" 
        />
        <div>
          <h1 className="serif text-lg tracking-wide uppercase font-semibold text-nat-accent-2 leading-none">Daily Record</h1>
          <p className="text-[9px] uppercase tracking-widest text-nat-accent-1 font-semibold mt-1 opacity-85">Track • Reflect • Grow</p>
        </div>
      </div>

      <nav className="flex flex-col gap-5 flex-1 py-2">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="px-3 pb-1.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-nat-accent-2">{group.group}</h2>
            </div>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer",
                      isActive 
                        ? "bg-nat-light-1 text-nat-accent-2 font-bold shadow-2xs" 
                        : "text-nat-text hover:bg-nat-light-1/80 hover:text-nat-accent-2"
                    )}
                  >
                    <span className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      isActive ? "bg-nat-accent-1 scale-110 ring-2 ring-nat-accent-1/30" : "bg-nat-border border border-nat-border"
                    )} />
                    <Icon className="w-4 h-4 shrink-0 text-nat-accent-2" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-3 border-t border-nat-border text-[10px] font-medium opacity-50 uppercase tracking-widest text-center">
        Offline-First • 2026
      </div>
    </aside>
  );
};

