import React, { useRef, useState } from 'react';
import { useSettings } from '../store/SettingsContext';
import { useData } from '../store/DataContext';
import { ThemeId, FontStyleId, FontSizeId, IconSizeId, EmojiScaleId } from '../types';
import {
  Settings as SettingsIcon,
  Palette,
  Type,
  Maximize2,
  Check,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Download,
  Upload,
  FileSpreadsheet,
  Database,
  AlertTriangle,
  FileJson,
  CheckCircle2,
  Layers,
  LayoutDashboard,
  Target,
  Clock,
  Droplets,
  Zap,
  CheckSquare,
  Sliders,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import { themeWallpapers } from '../assets/wallpapers';

interface SettingsProps {
  setCurrentTab?: (tab: string) => void;
}

interface ThemePreviewData {
  id: ThemeId;
  name: string;
  badge: string;
  desc: string;
  canvasBg: string;
  cardBg: string;
  headerGradient: string;
  accentColor: string;
  subAccent: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  heroText: string;
  tagColor: string;
}

export const Settings: React.FC<SettingsProps> = ({ setCurrentTab }) => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { exportAllDataJSON, importAllDataJSON, exportCSV, resetAllData } = useData();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDownloadJSON = () => {
    const json = exportAllDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily_record_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importAllDataJSON(content);
        if (ok) {
          setImportStatus({ status: 'success', message: 'Backup data imported successfully!' });
        } else {
          setImportStatus({ status: 'error', message: 'Invalid backup file format.' });
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadCSV = (type: 'timeLogs' | 'transactions' | 'tasks') => {
    const csv = exportCSV(type);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenith_${type}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const themes: ThemePreviewData[] = [
    {
      id: 'gildedsilk',
      name: 'Daily Record: Gilded Silk & Obsidian',
      badge: 'Official Reference Theme',
      desc: 'Authentic reproduction of the Daily Record mobile UI with flowing Italian marble, molten liquid gold ribbons, deep obsidian executive cards, and gold medal emblems.',
      canvasBg: '#FAF7F2',
      cardBg: 'rgba(251, 248, 242, 0.95)',
      headerGradient: 'linear-gradient(135deg, #121212 0%, #1E1E1E 50%, #C9A45C 100%)',
      accentColor: '#C9A45C',
      subAccent: '#141414',
      textColor: '#141414',
      mutedTextColor: '#333333',
      borderColor: 'rgba(201, 164, 92, 0.45)',
      heroText: '#FAF7F2',
      tagColor: '#C9A45C'
    },
    {
      id: 'obsidianelite',
      name: 'Obsidian Élite',
      badge: 'Luxury Executive Theme',
      desc: 'Timeless luxury with 50% warm ivory white (#F7F3EA), 35% deep obsidian black (#111111), and 15% champagne gold (#C9A45C) metallic precision.',
      canvasBg: '#F7F3EA',
      cardBg: 'rgba(247, 243, 234, 0.95)',
      headerGradient: 'linear-gradient(135deg, #111111 0%, #1A1A1A 60%, #C9A45C 100%)',
      accentColor: '#C9A45C',
      subAccent: '#111111',
      textColor: '#111111',
      mutedTextColor: '#333333',
      borderColor: 'rgba(201, 164, 92, 0.4)',
      heroText: '#F7F3EA',
      tagColor: '#C9A45C'
    },
    {
      id: 'obsidiansilk',
      name: 'Daily Record (Obsidian Waves & C2 Gilded Silk)',
      badge: 'C2 See-Through Cells',
      desc: 'Exclusive ultra-sheer see-through cells with flowing midnight waves, pure ivory silk, metallic gold ribbons, and Carrara marble.',
      canvasBg: '#FAF8F5',
      cardBg: 'rgba(255, 255, 255, 0.45)',
      headerGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBF0 45%, #E5B525 100%)',
      accentColor: '#B38612',
      subAccent: '#000000',
      textColor: '#000000',
      mutedTextColor: '#18181B',
      borderColor: 'rgba(179, 134, 18, 0.45)',
      heroText: '#000000',
      tagColor: '#B38612'
    },
    {
      id: 'luxurymarble',
      name: 'Daily Record (Luxury Silk & Gold Marble)',
      badge: 'Official Wallpaper Theme',
      desc: 'Flowing Italian Carrara marble, gilded gold ribbons, fine contour waves, and deep midnight obsidian accents with frosted glass cards.',
      canvasBg: '#FAF8F5',
      cardBg: 'rgba(255, 255, 255, 0.92)',
      headerGradient: 'linear-gradient(135deg, #FAF8F5 0%, #E8DFCE 50%, #D4AF37 100%)',
      accentColor: '#B38612',
      subAccent: '#000000',
      textColor: '#000000',
      mutedTextColor: '#18181B',
      borderColor: 'rgba(179, 134, 18, 0.45)',
      heroText: '#000000',
      tagColor: '#B38612'
    },
    {
      id: 'dailyrecord',
      name: 'Daily Record (Signature Obsidian & Gold)',
      badge: 'Dark Obsidian',
      desc: 'The signature dark obsidian navy leather canvas with metallic brushed gold accents, golden orbit ring, and glowing task checkmark.',
      canvasBg: '#070B14',
      cardBg: 'rgba(14, 23, 40, 0.95)',
      headerGradient: 'linear-gradient(135deg, #000000 0%, #0D1628 50%, #D4AF37 100%)',
      accentColor: '#E6C65A',
      subAccent: '#F3CA40',
      textColor: '#FFFFFF',
      mutedTextColor: '#E2E8F0',
      borderColor: 'rgba(230, 198, 90, 0.4)',
      heroText: '#FFFFFF',
      tagColor: '#F3CA40'
    },
    {
      id: 'lanternpeaks',
      name: 'Lantern Peaks Sanctuary',
      badge: 'Ghibli Fantasy',
      desc: 'Floating karst peaks, cobalt blue pagoda roofs, warm hanging paper lanterns, and misty alpine cloud bridges.',
      canvasBg: '#F3F8FB',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      headerGradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 55%, #D97706 100%)',
      accentColor: '#2563EB',
      subAccent: '#D97706',
      textColor: '#1E293B',
      mutedTextColor: '#64748B',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      heroText: '#FFFFFF',
      tagColor: '#F59E0B'
    },
    {
      id: 'solardune',
      name: 'Solar Dune Nomad',
      badge: 'Astral Ochre',
      desc: 'Mystical desert sandstone canvas, midnight silk obsidian robes, glowing solar aperture eye, and molten bronze filigree.',
      canvasBg: '#FAF6F0',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      headerGradient: 'linear-gradient(135deg, #1C1B20 0%, #2B2633 60%, #B87333 100%)',
      accentColor: '#F59E0B',
      subAccent: '#B87333',
      textColor: '#1E1D22',
      mutedTextColor: '#746D65',
      borderColor: 'rgba(184, 115, 51, 0.3)',
      heroText: '#FFFFFF',
      tagColor: '#D97706'
    },
    {
      id: 'auric',
      name: 'Auric Alabaster',
      badge: 'Celestial Gold',
      desc: 'Divine pearlescent white alabaster porcelain, molten gold kintsugi filigree, and radiant golden halos.',
      canvasBg: '#FCFCFA',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      headerGradient: 'linear-gradient(135deg, #B8860B 0%, #D4AF37 50%, #E5B83B 100%)',
      accentColor: '#B8860B',
      subAccent: '#E5B83B',
      textColor: '#18181B',
      mutedTextColor: '#6E6758',
      borderColor: 'rgba(212, 175, 55, 0.35)',
      heroText: '#FFFFFF',
      tagColor: '#F59E0B'
    },
    {
      id: 'oasis',
      name: 'Warm Oasis',
      badge: 'Warm Minimal',
      desc: 'Signature warm cream canvas with sage green header and bronze amber highlights.',
      canvasBg: '#FDFCFB',
      cardBg: 'rgba(255, 255, 255, 0.92)',
      headerGradient: 'linear-gradient(135deg, #8B9A8A 0%, #A3B18A 100%)',
      accentColor: '#8B9A8A',
      subAccent: '#BC6C25',
      textColor: '#333333',
      mutedTextColor: '#777777',
      borderColor: 'rgba(229, 229, 229, 0.9)',
      heroText: '#FFFFFF',
      tagColor: '#D4A373'
    },
    {
      id: 'sand',
      name: 'Minimal Sand',
      badge: 'Earth & Stone',
      desc: 'Warm earthy sandstone and linen canvas with clay bronze and amber stone accents.',
      canvasBg: '#F8F5EE',
      cardBg: 'rgba(255, 253, 248, 0.95)',
      headerGradient: 'linear-gradient(135deg, #82786B 0%, #9F9586 100%)',
      accentColor: '#82786B',
      subAccent: '#C58F5E',
      textColor: '#3D3832',
      mutedTextColor: '#8C8275',
      borderColor: 'rgba(221, 213, 198, 0.9)',
      heroText: '#FFFFFF',
      tagColor: '#C58F5E'
    },
    {
      id: 'forest',
      name: 'Evergreen Forest',
      badge: 'Nature Green',
      desc: 'Serene botanical spruce and pine forest header with fresh eucalyptus glass panels.',
      canvasBg: '#F3F7F3',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      headerGradient: 'linear-gradient(135deg, #34633E 0%, #4D7E57 100%)',
      accentColor: '#34633E',
      subAccent: '#7E9F6E',
      textColor: '#263527',
      mutedTextColor: '#667B67',
      borderColor: 'rgba(207, 223, 205, 0.9)',
      heroText: '#FFFFFF',
      tagColor: '#7E9F6E'
    },
    {
      id: 'lavender',
      name: 'Lavender Twilight',
      badge: 'Calm Violet',
      desc: 'Soft lilac dusk canvas with calming violet header and amethyst focus badges.',
      canvasBg: '#F8F6FB',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      headerGradient: 'linear-gradient(135deg, #6E5CA4 0%, #8C7CBE 100%)',
      accentColor: '#6E5CA4',
      subAccent: '#A78BFA',
      textColor: '#363142',
      mutedTextColor: '#7D7591',
      borderColor: 'rgba(220, 214, 236, 0.9)',
      heroText: '#FFFFFF',
      tagColor: '#A78BFA'
    },
    {
      id: 'rose',
      name: 'Rose Terracotta',
      badge: 'Warm Blush',
      desc: 'Gentle blush sunset canvas with terracotta clay gradient and warm bronze badges.',
      canvasBg: '#FCF6F6',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      headerGradient: 'linear-gradient(135deg, #925864 0%, #AF7682 100%)',
      accentColor: '#925864',
      subAccent: '#E07A5F',
      textColor: '#453436',
      mutedTextColor: '#8E777A',
      borderColor: 'rgba(232, 211, 214, 0.9)',
      heroText: '#FFFFFF',
      tagColor: '#E07A5F'
    },
    {
      id: 'midnight',
      name: 'Midnight Slate',
      badge: 'Dark Mode',
      desc: 'Deep obsidian luxury dark canvas with sapphire blue metrics and gold highlights.',
      canvasBg: '#0F1319',
      cardBg: 'rgba(22, 27, 36, 0.95)',
      headerGradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
      accentColor: '#58A6FF',
      subAccent: '#E5A93C',
      textColor: '#F0F6FC',
      mutedTextColor: '#8B949E',
      borderColor: 'rgba(48, 54, 61, 0.9)',
      heroText: '#FFFFFF',
      tagColor: '#58A6FF'
    },
  ];

  const fontStyles: { id: FontStyleId; name: string; sample: string; desc: string }[] = [
    { id: 'whimsical', name: 'Whimsical Ghibli', sample: 'Quicksand & Jakarta', desc: 'Heartwarming, storybook clarity with rounded grace' },
    { id: 'arcane', name: 'Arcane Nomad', sample: 'Marcellus & Cinzel', desc: 'Mystical desert rune engraving with celestial balance' },
    { id: 'regal', name: 'Celestial Regal', sample: 'Cinzel & Cormorant', desc: 'Sculpted divine serif with molten golden grandeur' },
    { id: 'serif', name: 'Editorial Serif', sample: 'Playfair Display & Georgia', desc: 'Refined, literary editorial feel' },
    { id: 'sans', name: 'Clean Sans-Serif', sample: 'Modern System Sans', desc: 'Crisp, contemporary clarity' },
    { id: 'mono', name: 'Technical Mono', sample: 'JetBrains & Code Mono', desc: 'Clean monospace structure' },
    { id: 'rounded', name: 'Humanist Rounded', sample: 'Soft Modern Rounded', desc: 'Friendly, balanced aesthetic' },
  ];

  const fontSizes: { id: FontSizeId; label: string; px: string; desc: string }[] = [
    { id: 'sm', label: 'Compact', px: '14px', desc: 'High information density' },
    { id: 'base', label: 'Default', px: '16px', desc: 'Balanced standard reading' },
    { id: 'lg', label: 'Large', px: '17.5px', desc: 'Spacious & easy on the eyes' },
    { id: 'xl', label: 'Extra Large', px: '19px', desc: 'Maximum legibility' },
  ];

  const iconSizes: { id: IconSizeId; label: string; scale: string }[] = [
    { id: 'sm', label: 'Compact (80%)', scale: 'Subtle' },
    { id: 'base', label: 'Default (100%)', scale: 'Standard' },
    { id: 'lg', label: 'Prominent (125%)', scale: 'Large' },
  ];

  const emojiScales: { id: EmojiScaleId; label: string; preview: string }[] = [
    { id: 'sm', label: 'Compact (80%)', preview: 'Small' },
    { id: 'base', label: 'Default (100%)', preview: 'Standard' },
    { id: 'lg', label: 'Enlarged (135%)', preview: 'Prominent' },
  ];

  // Miniature Dashboard Interface Mockup Component
  const DashboardMockupImage = ({ theme }: { theme: ThemePreviewData }) => {
    const bgImg = themeWallpapers[theme.id];

    return (
      <div 
        className="w-full rounded-xl overflow-hidden border transition-all duration-300 p-2.5 flex flex-col gap-2 select-none shadow-xs relative"
        style={{ 
          backgroundColor: theme.canvasBg, 
          backgroundImage: bgImg ? `url(${bgImg})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          borderColor: theme.borderColor 
        }}
      >
        {/* Mock Top App Bar */}
        <div 
          className="flex items-center justify-between pb-1.5 border-b"
          style={{ borderColor: theme.borderColor }}
        >
          <div className="flex items-center gap-1.5">
            <div 
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-2xs"
              style={{ backgroundColor: theme.accentColor }}
            >
              O
            </div>
            <span className="text-[10px] font-bold tracking-tight" style={{ color: theme.textColor }}>
              Oasis OS
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <div 
              className="w-10 h-2.5 rounded-md border text-[7px] flex items-center px-1"
              style={{ 
                backgroundColor: theme.cardBg, 
                borderColor: theme.borderColor,
                color: theme.mutedTextColor 
              }}
            >
              Search...
            </div>
            <div 
              className="w-3.5 h-3.5 rounded-md border flex items-center justify-center"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.subAccent }} />
            </div>
          </div>
        </div>

        {/* Mock Hero Quote Banner */}
        <div 
          className="rounded-lg p-2.5 relative overflow-hidden flex flex-col justify-between shadow-2xs"
          style={{ 
            background: theme.headerGradient,
            color: theme.heroText,
            minHeight: '52px'
          }}
        >
          {theme.id === 'lanternpeaks' ? (
            <>
              {/* Floating Lanterns & Suspension Bridge Cloud Mist */}
              <div 
                className="absolute -right-3 -top-3 w-12 h-12 rounded-full border border-amber-300/40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%)' }}
              />
              <div className="absolute right-2 top-1 opacity-90 text-[10px] text-amber-200">
                🏮 ⛩ 🏮
              </div>
              <div className="absolute -right-1 bottom-1 text-[8px] text-sky-200/50">
                ☁ ☁
              </div>
            </>
          ) : theme.id === 'solardune' ? (
            <>
              {/* Astral Disk Hat & Glowing Solar Aperture Eye */}
              <div 
                className="absolute -right-3 -top-2 w-12 h-6 rounded-full border border-amber-400/50 pointer-events-none"
                style={{ transform: 'rotate(-15deg)', background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.3) 0%, transparent 80%)' }}
              />
              <div className="absolute right-2.5 top-1.5 opacity-90 text-[9px] text-amber-300 font-mono">
                ✧ ◉ ✧
              </div>
            </>
          ) : theme.id === 'auric' ? (
            <>
              {/* Celestial Golden Halos from the image */}
              <div 
                className="absolute -right-2 -top-3 w-14 h-14 rounded-full border border-amber-300/60 pointer-events-none"
                style={{ boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)' }}
              />
              <div 
                className="absolute -right-5 -bottom-4 w-20 h-20 rounded-full border border-yellow-200/40 pointer-events-none"
              />
              {/* Golden Hammer / Divine Crest glyph */}
              <div className="absolute right-2 top-1.5 opacity-80 text-[10px] text-amber-200 font-serif">
                ✧ ⚒ ✧
              </div>
            </>
          ) : (
            <div className="absolute right-2 -bottom-1 text-2xl font-serif italic opacity-15 select-none pointer-events-none">
              Oasis
            </div>
          )}
          <div className="text-[8px] opacity-85 italic font-serif">
            {theme.id === 'lanternpeaks' ? 'Cloudspire Sanctuary' : theme.id === 'solardune' ? 'Astral Nomadic Path' : theme.id === 'auric' ? 'Celestial Wisdom' : 'Good morning'}
          </div>
          <div className="text-[10px] font-medium leading-tight font-serif z-10">
            {theme.id === 'lanternpeaks' 
              ? '"Every ascent begins with a lantern and a step across the clouds."' 
              : theme.id === 'solardune'
              ? '"Through shifting dunes, the inner flame guides the ascent."'
              : theme.id === 'auric' 
              ? '"Forge your days with divine purpose & gold."' 
              : '"True productivity is doing what matters."'}
          </div>
        </div>

        {/* Mock 4 Quick Navigation Pills */}
        <div className="grid grid-cols-4 gap-1">
          {['Log', 'Goals', 'Tasks', 'Timer'].map((label, idx) => (
            <div
              key={label}
              className="py-1 px-1 rounded-md border text-center flex flex-col items-center justify-center gap-0.5"
              style={{ 
                backgroundColor: theme.cardBg, 
                borderColor: theme.borderColor,
                color: idx === 0 ? theme.accentColor : theme.mutedTextColor 
              }}
            >
              <div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: idx === 0 ? theme.accentColor : theme.subAccent }} 
              />
              <span className="text-[7px] font-semibold leading-none">{label}</span>
            </div>
          ))}
        </div>

        {/* Mock Dashboard Body: 2 Columns */}
        <div className="grid grid-cols-5 gap-1.5 pt-0.5">
          {/* Left Column: Tasks List */}
          <div 
            className="col-span-3 rounded-lg border p-1.5 flex flex-col gap-1"
            style={{ 
              backgroundColor: theme.cardBg, 
              borderColor: theme.borderColor 
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold" style={{ color: theme.textColor }}>
                Today's Action Plan
              </span>
              <span 
                className="text-[7px] font-bold px-1 rounded" 
                style={{ backgroundColor: theme.canvasBg, color: theme.accentColor }}
              >
                2/3
              </span>
            </div>

            {/* Task rows */}
            <div className="flex items-center gap-1">
              <div 
                className="w-2.5 h-2.5 rounded flex items-center justify-center text-[7px] text-white"
                style={{ backgroundColor: theme.accentColor }}
              >
                ✓
              </div>
              <div className="h-1.5 rounded w-16 opacity-60" style={{ backgroundColor: theme.mutedTextColor }} />
            </div>

            <div className="flex items-center gap-1">
              <div 
                className="w-2.5 h-2.5 rounded flex items-center justify-center text-[7px] text-white"
                style={{ backgroundColor: theme.accentColor }}
              >
                ✓
              </div>
              <div className="h-1.5 rounded w-12 opacity-60" style={{ backgroundColor: theme.mutedTextColor }} />
            </div>

            <div className="flex items-center gap-1">
              <div 
                className="w-2.5 h-2.5 rounded border"
                style={{ borderColor: theme.borderColor }}
              />
              <div className="h-1.5 rounded w-14 opacity-40" style={{ backgroundColor: theme.mutedTextColor }} />
            </div>
          </div>

          {/* Right Column: Vitals & Focus Metric */}
          <div 
            className="col-span-2 rounded-lg border p-1.5 flex flex-col justify-between"
            style={{ 
              backgroundColor: theme.cardBg, 
              borderColor: theme.borderColor 
            }}
          >
            <div className="text-[8px] font-bold" style={{ color: theme.textColor }}>
              Vitals
            </div>

            <div className="space-y-1">
              <div>
                <div className="flex justify-between text-[7px]" style={{ color: theme.mutedTextColor }}>
                  <span>Focus</span>
                  <span className="font-bold" style={{ color: theme.subAccent }}>4.2h</span>
                </div>
                <div className="w-full h-1 rounded-full bg-black/5 overflow-hidden">
                  <div className="h-full rounded-full w-4/5" style={{ backgroundColor: theme.subAccent }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[7px]" style={{ color: theme.mutedTextColor }}>
                  <span>Habits</span>
                  <span className="font-bold" style={{ color: theme.accentColor }}>100%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-black/5 overflow-hidden">
                  <div className="h-full rounded-full w-full" style={{ backgroundColor: theme.accentColor }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          {setCurrentTab && (
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="p-2.5 rounded-xl bg-white/90 border border-nat-border text-nat-accent-2 hover:bg-white hover:text-nat-accent-3 transition-all shadow-xs cursor-pointer flex items-center justify-center"
              title="Back to Dashboard"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="w-10 h-10 rounded-2xl bg-nat-accent-1/20 border border-nat-accent-1/30 flex items-center justify-center text-nat-accent-4">
            <SettingsIcon className="w-5 h-5" />
          </div>

          <div>
            <h1 className="serif text-2xl md:text-3xl text-nat-accent-2 font-medium">Settings & Preferences</h1>
            <p className="text-nat-text opacity-60 text-xs mt-0.5">Customize your themes, typography, display scaling, and workspace backups.</p>
          </div>
        </div>

        <button
          onClick={resetSettings}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-nat-border bg-white text-xs font-medium text-nat-text opacity-70 hover:opacity-100 hover:text-nat-accent-4 hover:bg-white transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="space-y-8">
        
        {/* SECTION 1: THEME & COLOR PALETTE WITH VISUAL DASHBOARD INTERFACE IMAGES */}
        <section className="glass p-6 md:p-8 rounded-2xl border border-nat-border shadow-xs bg-white/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-nat-accent-2" />
              <h2 className="serif text-lg font-medium text-nat-accent-2">Theme & Dashboard Interface</h2>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-nat-accent-4 px-2.5 py-0.5 rounded-full bg-nat-accent-1/20">
              Interactive Live Preview
            </span>
          </div>
          <p className="text-xs opacity-60 mb-6">
            Click on any individual dashboard interface image to apply that theme and color palette across the entire application.
          </p>

          {/* Grid of Theme Mockup Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {themes.map(t => {
              const isSelected = settings.theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => updateSetting('theme', t.id)}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group bg-white hover:shadow-md",
                    isSelected 
                      ? "border-nat-accent-2 ring-2 ring-nat-accent-2/40 shadow-sm" 
                      : "border-nat-border hover:border-nat-accent-2/60"
                  )}
                >
                  {/* Dashboard Preview Image/Mockup */}
                  <div className="mb-3.5">
                    <DashboardMockupImage theme={t} />
                  </div>

                  {/* Theme Info & Selection State */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-nat-text">{t.name}</h4>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-nat-light-1 border border-nat-border text-nat-text opacity-75">
                          {t.badge}
                        </span>
                      </div>

                      {isSelected ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-nat-accent-2 bg-nat-accent-2/10 px-2 py-0.5 rounded-full border border-nat-accent-2/30">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-medium opacity-40 group-hover:opacity-100 group-hover:text-nat-accent-2 transition-opacity">
                          Click to apply
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[11px] opacity-65 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Background Wallpaper Blur Control */}
          <div className="mt-8 pt-6 border-t border-nat-border/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-nat-accent-2" />
                <h3 className="text-sm font-semibold text-nat-accent-2">Background Blur Depth</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-nat-light-1 border border-nat-border text-nat-accent-2">
                  {settings.bgBlur ?? 0}px {settings.bgBlur === 0 ? '(Clear)' : (settings.bgBlur ?? 0) >= 16 ? '(Dreamy)' : '(Soft Focus)'}
                </span>
              </div>
            </div>

            <p className="text-xs opacity-65 mb-4 max-w-2xl">
              Adjust background blur to blur out distracting artwork elements behind your tasks and functions, or blur in for high-definition visual clarity.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-4 bg-nat-light-1/60 p-4 rounded-xl border border-nat-border">
              {/* Slider */}
              <div className="flex-1 w-full flex items-center gap-3">
                <span className="text-[11px] font-medium opacity-60 shrink-0">0px (Sharp)</span>
                <input 
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={settings.bgBlur ?? 0}
                  onChange={(e) => updateSetting('bgBlur', Number(e.target.value))}
                  className="w-full h-2 bg-nat-border rounded-lg appearance-none cursor-pointer accent-nat-accent-1"
                />
                <span className="text-[11px] font-medium opacity-60 shrink-0">24px (Blurry)</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                {[
                  { label: 'Clear', val: 0 },
                  { label: 'Soft', val: 4 },
                  { label: 'Medium', val: 8 },
                  { label: 'Heavy', val: 16 },
                  { label: 'Dreamy', val: 24 }
                ].map(preset => {
                  const isActive = (settings.bgBlur ?? 0) === preset.val;
                  return (
                    <button
                      key={preset.val}
                      onClick={() => updateSetting('bgBlur', preset.val)}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all cursor-pointer",
                        isActive 
                          ? "bg-nat-accent-2 text-white border-nat-accent-2 shadow-2xs font-semibold" 
                          : "bg-white/80 border-nat-border text-nat-text hover:bg-white"
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TYPOGRAPHY & FONT STYLES */}
        <section className="glass p-6 md:p-8 rounded-2xl border border-nat-border shadow-xs bg-white/80">
          <div className="flex items-center gap-2.5 mb-2">
            <Type className="w-4 h-4 text-nat-accent-2" />
            <h2 className="serif text-lg font-medium text-nat-accent-2">Typography & Font Style</h2>
          </div>
          <p className="text-xs opacity-60 mb-6">
            Select the typography style and font sizing that best fits your visual workflow.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {fontStyles.map(f => {
              const isSelected = settings.fontStyle === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => updateSetting('fontStyle', f.id)}
                  className={cn(
                    "p-5 rounded-xl border text-left transition-all cursor-pointer bg-white/70 hover:bg-white",
                    isSelected 
                      ? "border-nat-accent-2 ring-2 ring-nat-accent-2/30 shadow-xs" 
                      : "border-nat-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-nat-accent-2">{f.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-nat-accent-2 stroke-[3]" />}
                  </div>
                  <div className="text-base my-1 font-medium text-nat-text">
                    {f.sample}
                  </div>
                  <p className="text-xs opacity-60">{f.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Font Size Sizer */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-3">
              Application Font Size
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fontSizes.map(s => {
                const isSelected = settings.fontSize === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => updateSetting('fontSize', s.id)}
                    className={cn(
                      "p-3.5 rounded-xl border text-center transition-all cursor-pointer",
                      isSelected 
                        ? "bg-nat-accent-2 text-white border-nat-accent-2 shadow-xs font-medium" 
                        : "bg-white/80 border-nat-border text-nat-text hover:bg-white"
                    )}
                  >
                    <div className="text-xs font-medium">{s.label}</div>
                    <div className="text-[11px] opacity-70 mt-0.5 font-mono">{s.px}</div>
                    <div className="text-[10px] opacity-60 mt-1">{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: ICON, EMOJI & SYMBOL SIZING */}
        <section className="glass p-6 md:p-8 rounded-2xl border border-nat-border shadow-xs bg-white/80">
          <div className="flex items-center gap-2.5 mb-2">
            <Maximize2 className="w-4 h-4 text-nat-accent-2" />
            <h2 className="serif text-lg font-medium text-nat-accent-2">Icon & Symbol Sizing</h2>
          </div>
          <p className="text-xs opacity-60 mb-6">
            Adjust the scale of interface icons, status symbols, and emojis across the platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-3">
                Interface Icons Scale
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {iconSizes.map(i => {
                  const isSelected = settings.iconSize === i.id;
                  return (
                    <button
                      key={i.id}
                      onClick={() => updateSetting('iconSize', i.id)}
                      className={cn(
                        "p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/70 hover:bg-white",
                        isSelected 
                          ? "border-nat-accent-2 ring-2 ring-nat-accent-2/30 shadow-xs" 
                          : "border-nat-border"
                      )}
                    >
                      <Sparkles className={cn(
                        "text-nat-accent-1",
                        i.id === 'sm' && "w-4 h-4",
                        i.id === 'base' && "w-5 h-5",
                        i.id === 'lg' && "w-6 h-6"
                      )} />
                      <span className="text-xs font-medium text-nat-text">{i.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-3">
                Emoji & Symbols Scale
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {emojiScales.map(es => {
                  const isSelected = settings.emojiScale === es.id;
                  return (
                    <button
                      key={es.id}
                      onClick={() => updateSetting('emojiScale', es.id)}
                      className={cn(
                        "p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/70 hover:bg-white",
                        isSelected 
                          ? "border-nat-accent-2 ring-2 ring-nat-accent-2/30 shadow-xs" 
                          : "border-nat-border"
                      )}
                    >
                      <span className={cn(
                        "transition-transform",
                        es.id === 'sm' && "text-base",
                        es.id === 'base' && "text-xl",
                        es.id === 'lg' && "text-2xl"
                      )}>
                        🌟
                      </span>
                      <span className="text-xs font-medium text-nat-text">{es.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: DATA BACKUP, EXPORT & IMPORT */}
        <section className="glass p-6 md:p-8 rounded-2xl border border-nat-border shadow-xs bg-white/80">
          <div className="flex items-center gap-2.5 mb-2">
            <Database className="w-4 h-4 text-nat-accent-2" />
            <h2 className="serif text-lg font-medium text-nat-accent-2">Data Backup, Export & Import</h2>
          </div>
          <p className="text-xs opacity-60 mb-6 leading-relaxed">
            Daily Record is an offline-first workspace. All your data lives securely in your local browser storage. Use these tools to download backups, transfer data between devices, or export reports to CSV.
          </p>

          {importStatus.message && (
            <div className={cn(
              "p-3.5 rounded-xl mb-6 text-xs font-semibold flex items-center justify-between border",
              importStatus.status === 'success'
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            )}>
              <div className="flex items-center gap-2">
                {importStatus.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                <span>{importStatus.message}</span>
              </div>
              <button onClick={() => setImportStatus({ status: 'idle', message: '' })} className="opacity-60 hover:opacity-100 text-xs cursor-pointer">Dismiss</button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* JSON Backup Download */}
            <div className="p-5 rounded-xl bg-white/70 border border-nat-border flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-nat-accent-2 font-medium text-xs mb-1">
                  <FileJson className="w-4 h-4 text-amber-500" />
                  <span>Full JSON Backup</span>
                </div>
                <p className="text-[11px] opacity-60 leading-relaxed">
                  Export all goals, projects, tasks, habits, time logs, micro-journals, and finance logs into a single backup file.
                </p>
              </div>

              <button
                onClick={handleDownloadJSON}
                className="w-full py-2.5 px-4 rounded-xl bg-nat-accent-2 text-white text-xs font-medium hover:bg-nat-accent-3 shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Backup (.json)</span>
              </button>
            </div>

            {/* JSON Restore / Import */}
            <div className="p-5 rounded-xl bg-white/70 border border-nat-border flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-nat-accent-2 font-medium text-xs mb-1">
                  <Upload className="w-4 h-4 text-indigo-500" />
                  <span>Restore from Backup</span>
                </div>
                <p className="text-[11px] opacity-60 leading-relaxed">
                  Upload a previously saved Daily Record JSON file to restore your entire workspace on any device or browser.
                </p>
              </div>

              <label className="w-full py-2.5 px-4 rounded-xl border border-nat-border bg-white text-nat-text text-xs font-medium hover:bg-nat-light-1 shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Select Backup File</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,application/json"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* CSV Exports */}
          <div className="pt-4 border-t border-nat-border">
            <label className="block text-xs font-bold uppercase tracking-wider text-nat-accent-2 mb-3">
              Export Spreadsheets (CSV)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleDownloadCSV('timeLogs')}
                className="p-3 rounded-xl border border-nat-border bg-white text-nat-text hover:bg-nat-light-1 text-xs font-medium flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
                <span>Time Logs CSV</span>
              </button>

              <button
                onClick={() => handleDownloadCSV('transactions')}
                className="p-3 rounded-xl border border-nat-border bg-white text-nat-text hover:bg-nat-light-1 text-xs font-medium flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>Finance Ledger CSV</span>
              </button>

              <button
                onClick={() => handleDownloadCSV('tasks')}
                className="p-3 rounded-xl border border-nat-border bg-white text-nat-text hover:bg-nat-light-1 text-xs font-medium flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-sky-500" />
                <span>Tasks CSV</span>
              </button>
            </div>
          </div>

          {/* DANGER ZONE / RESET */}
          <div className="mt-8 pt-6 border-t border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-rose-600">Reset Local Workspace</h4>
              <p className="text-[11px] opacity-60">Restore factory sample data and clear all local modifications.</p>
            </div>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-600 text-xs font-medium hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Reset All Data
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-xl border border-nat-border text-xs opacity-70 hover:opacity-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetAllData();
                    setShowResetConfirm(false);
                    setImportStatus({ status: 'success', message: 'Workspace reset to default sample data.' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 shadow-xs cursor-pointer transition-colors"
                >
                  Confirm Reset
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};


