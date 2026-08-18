/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DataProvider } from './store/DataContext';
import { SettingsProvider, useSettings } from './store/SettingsContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Goals } from './components/Goals';
import { ProjectsTasks } from './components/ProjectsTasks';
import { Habits } from './components/Habits';
import { Finance } from './components/Finance';
import { KnowledgeBase } from './components/KnowledgeBase';
import { TimeTracker } from './components/TimeTracker';
import { DailyJournal } from './components/DailyJournal';
import { WeeklyReview } from './components/WeeklyReview';
import { Scratchpad } from './components/Scratchpad';
import { Settings } from './components/Settings';
import { Menu, X, ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { cn } from './lib/utils';
import { themeWallpapers, logoImg } from './assets/wallpapers';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSettings();

  const activeWallpaper = themeWallpapers[settings.theme];

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Dashboard';
      case 'journal': return 'Daily Log & Journal';
      case 'goals': return 'Goals & Milestones';
      case 'projects': return 'Projects & Tasks';
      case 'timetracker': return 'Time Tracker';
      case 'habits': return 'Habit Tracker & Vitals';
      case 'finance': return 'Finance';
      case 'review': return 'Weekly Review';
      case 'scratchpad': return 'Quick Capture';
      case 'knowledge': return 'Second Brain';
      case 'settings': return 'Settings & Preferences';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <Dashboard setCurrentTab={setCurrentTab} />;
      case 'journal': return <DailyJournal />;
      case 'goals': return <Goals />;
      case 'projects': return <ProjectsTasks />;
      case 'timetracker': return <TimeTracker setCurrentTab={setCurrentTab} onOpenMenu={() => setIsMobileMenuOpen(true)} />;
      case 'habits': return <Habits />;
      case 'finance': return <Finance />;
      case 'review': return <WeeklyReview />;
      case 'scratchpad': return <Scratchpad />;
      case 'knowledge': return <KnowledgeBase />;
      case 'settings': return <Settings setCurrentTab={setCurrentTab} />;
      default: return <Dashboard setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className={cn(
      "flex h-screen text-nat-text font-sans overflow-hidden selection:bg-nat-accent-1/20 relative app-wallpaper-canvas",
      activeWallpaper ? "bg-transparent" : "bg-nat-bg"
    )}>

      {/* Dynamic Blur Wallpaper Background Layer */}
      {activeWallpaper && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 app-theme-bg-layer"
          style={{
            backgroundImage: `url(${activeWallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            filter: `blur(${settings.bgBlur ?? 0}px)`,
            transform: (settings.bgBlur ?? 0) > 0 ? 'scale(1.05)' : 'none',
            transition: 'filter 0.2s ease, transform 0.2s ease',
          }}
        />
      )}

      {/* Global Persistent Top Header Bar for Desktop & Mobile */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-nat-border bg-white/70 backdrop-blur-md z-40 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(prev => !prev)} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-nat-border rounded-xl text-xs font-semibold text-nat-accent-2 hover:bg-white hover:text-nat-accent-3 shadow-2xs transition-all cursor-pointer"
            aria-label="Toggle Menu"
            title="Open Navigation Menu"
          >
            <Menu className="w-4 h-4 text-nat-accent-2" />
            <span>Menu</span>
          </button>

          <div className="flex items-center gap-2">
            <div 
              onClick={() => setCurrentTab('dashboard')}
              className="cursor-pointer flex items-center gap-2.5 group"
              title="Go to Dashboard"
            >
              <img 
                src={logoImg} 
                alt="Daily Record" 
                className="w-7 h-7 rounded-lg shadow-sm border border-amber-500/40 object-cover group-hover:scale-105 transition-transform" 
              />
              <h1 className="serif tracking-wide uppercase font-semibold text-nat-accent-2 text-sm md:text-[15px] hidden sm:block">
                Daily Record
              </h1>
            </div>

            {currentTab !== 'dashboard' && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-nat-accent-2">
                <span className="text-nat-accent-1">/</span>
                <span className="truncate max-w-[140px] md:max-w-none">{getPageTitle()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Top Actions: Settings Icon & Navigation Controls */}
        <div className="flex items-center gap-2">
          {/* The Iconic Settings Gear Symbol Button */}
          <button
            onClick={() => setCurrentTab(currentTab === 'settings' ? 'dashboard' : 'settings')}
            className={cn(
              "p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shadow-2xs group",
              currentTab === 'settings'
                ? "bg-nat-accent-2 text-white border-nat-accent-2 shadow-xs"
                : "bg-white/90 border-nat-border text-nat-accent-2 hover:bg-nat-light-1 hover:text-nat-accent-3"
            )}
            title="Settings & Appearance"
            aria-label="Open Settings"
          >
            <SettingsIcon className={cn("w-4 h-4 transition-transform duration-300", currentTab === 'settings' ? "rotate-90" : "group-hover:rotate-45")} />
          </button>

          {/* Back Button for Sub-pages */}
          {currentTab !== 'dashboard' && (
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className="p-2.5 rounded-xl bg-white/90 border border-nat-border text-nat-accent-2 hover:bg-nat-light-1 hover:text-nat-accent-3 shadow-2xs transition-all cursor-pointer flex items-center justify-center"
              title="Back to Dashboard"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Sidebar with mobile overlay */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-2xl md:shadow-none w-64 md:w-auto pt-16 md:pt-16",
        activeWallpaper ? "bg-white/70 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none" : "bg-nat-bg",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Mobile close button inside sidebar */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="md:hidden absolute top-20 right-4 p-2 text-nat-text opacity-70 hover:opacity-100 z-50 bg-white/80 rounded-lg border border-nat-border"
        >
          <X className="w-4 h-4" />
        </button>
        
        <Sidebar currentTab={currentTab} setCurrentTab={(tab) => { setCurrentTab(tab); setIsMobileMenuOpen(false); }} />
      </div>
      
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 overflow-y-auto bg-transparent no-scrollbar pt-20 app-main-canvas relative z-10">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </SettingsProvider>
  );
}
