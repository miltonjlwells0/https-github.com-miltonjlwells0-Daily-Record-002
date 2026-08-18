import React from 'react';
import { useSettings } from '../store/SettingsContext';
import { cn } from '../lib/utils';
import {
  Sparkles,
  Heart,
  Droplets,
  BookOpen,
  Laptop,
  Coins,
  Salad,
  Target,
  Dumbbell,
  Moon,
  Brain,
  Palette,
  Leaf,
  Coffee,
  FileText,
  Bike,
  Activity,
  Flame,
  Award,
  Sun,
  Smile,
  Compass,
  CheckCircle2,
  Clock,
  Zap,
  Music,
  Shield,
  Star,
  FolderHeart
} from 'lucide-react';

interface EmojiOrImageProps {
  emoji: string;
  className?: string;
  size?: 'sm' | 'base' | 'lg' | 'xl';
  fallbackText?: string;
  customImage?: string;
}

// Map common emojis to beautiful icon graphics / color palettes
const EMOJI_GRAPHIC_MAP: Record<string, { icon: React.ComponentType<{ className?: string }>; bg: string; color: string; label: string }> = {
  '🌟': { icon: Star, bg: 'bg-amber-100 dark:bg-amber-900/40', color: 'text-amber-500', label: 'Star' },
  '⭐': { icon: Star, bg: 'bg-amber-100 dark:bg-amber-900/40', color: 'text-amber-500', label: 'Star' },
  '🧘': { icon: Activity, bg: 'bg-teal-100 dark:bg-teal-900/40', color: 'text-teal-600 dark:text-teal-400', label: 'Meditation' },
  '🏃': { icon: Zap, bg: 'bg-orange-100 dark:bg-orange-900/40', color: 'text-orange-500', label: 'Running' },
  '💧': { icon: Droplets, bg: 'bg-sky-100 dark:bg-sky-900/40', color: 'text-sky-500', label: 'Water' },
  '📚': { icon: BookOpen, bg: 'bg-indigo-100 dark:bg-indigo-900/40', color: 'text-indigo-500', label: 'Reading' },
  '💻': { icon: Laptop, bg: 'bg-blue-100 dark:bg-blue-900/40', color: 'text-blue-500', label: 'Coding' },
  '💰': { icon: Coins, bg: 'bg-emerald-100 dark:bg-emerald-900/40', color: 'text-emerald-600 dark:text-emerald-400', label: 'Finance' },
  '💵': { icon: Coins, bg: 'bg-emerald-100 dark:bg-emerald-900/40', color: 'text-emerald-600 dark:text-emerald-400', label: 'Money' },
  '🥗': { icon: Salad, bg: 'bg-green-100 dark:bg-green-900/40', color: 'text-green-600 dark:text-green-400', label: 'Healthy Eating' },
  '🎯': { icon: Target, bg: 'bg-rose-100 dark:bg-rose-900/40', color: 'text-rose-500', label: 'Goal' },
  '🏋️': { icon: Dumbbell, bg: 'bg-violet-100 dark:bg-violet-900/40', color: 'text-violet-500', label: 'Workout' },
  '🏋️‍♂️': { icon: Dumbbell, bg: 'bg-violet-100 dark:bg-violet-900/40', color: 'text-violet-500', label: 'Workout' },
  '😴': { icon: Moon, bg: 'bg-purple-100 dark:bg-purple-900/40', color: 'text-purple-500', label: 'Sleep' },
  '🌙': { icon: Moon, bg: 'bg-slate-100 dark:bg-slate-800', color: 'text-indigo-400', label: 'Night' },
  '🧠': { icon: Brain, bg: 'bg-pink-100 dark:bg-pink-900/40', color: 'text-pink-500', label: 'Brain' },
  '🎨': { icon: Palette, bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/40', color: 'text-fuchsia-500', label: 'Art' },
  '🌿': { icon: Leaf, bg: 'bg-emerald-100 dark:bg-emerald-900/40', color: 'text-emerald-500', label: 'Nature' },
  '🌱': { icon: Leaf, bg: 'bg-emerald-100 dark:bg-emerald-900/40', color: 'text-emerald-500', label: 'Growth' },
  '☕': { icon: Coffee, bg: 'bg-amber-100 dark:bg-amber-900/40', color: 'text-amber-700 dark:text-amber-400', label: 'Coffee' },
  '📝': { icon: FileText, bg: 'bg-yellow-100 dark:bg-yellow-900/40', color: 'text-yellow-600 dark:text-yellow-400', label: 'Notes' },
  '🚴': { icon: Bike, bg: 'bg-cyan-100 dark:bg-cyan-900/40', color: 'text-cyan-500', label: 'Cycling' },
  '🔥': { icon: Flame, bg: 'bg-orange-100 dark:bg-orange-900/40', color: 'text-orange-500', label: 'Streak' },
  '🏆': { icon: Award, bg: 'bg-yellow-100 dark:bg-yellow-900/40', color: 'text-yellow-600', label: 'Trophy' },
  '☀️': { icon: Sun, bg: 'bg-amber-100 dark:bg-amber-900/40', color: 'text-amber-500', label: 'Sun' },
  '❤️': { icon: Heart, bg: 'bg-rose-100 dark:bg-rose-900/40', color: 'text-rose-500', label: 'Love' },
  '✨': { icon: Sparkles, bg: 'bg-amber-100 dark:bg-amber-900/40', color: 'text-amber-500', label: 'Sparkles' },
  '🎵': { icon: Music, bg: 'bg-purple-100 dark:bg-purple-900/40', color: 'text-purple-500', label: 'Music' },
  '🛡️': { icon: Shield, bg: 'bg-blue-100 dark:bg-blue-900/40', color: 'text-blue-500', label: 'Shield' },
  '🧭': { icon: Compass, bg: 'bg-teal-100 dark:bg-teal-900/40', color: 'text-teal-500', label: 'Explore' },
};

export const EmojiOrImage: React.FC<EmojiOrImageProps> = ({
  emoji,
  className,
  size = 'base',
  fallbackText,
  customImage
}) => {
  const { settings } = useSettings();
  const { useImagesForEmojis, emojiScale, iconSize, emojiImageStyle } = settings;

  // Size mappings
  const containerSizeClasses = {
    sm: 'w-5 h-5 min-w-[20px] text-xs',
    base: 'w-7 h-7 min-w-[28px] text-sm',
    lg: 'w-9 h-9 min-w-[36px] text-base',
    xl: 'w-12 h-12 min-w-[48px] text-xl',
  }[size];

  const iconDimensionClasses = {
    sm: 'w-3 h-3',
    base: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }[size];

  const emojiTextSizeClasses = {
    sm: 'text-sm',
    base: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  // Scale multiplier classes
  const emojiScaleClasses = {
    sm: 'scale-90',
    base: 'scale-100',
    lg: 'scale-125',
  }[emojiScale];

  // If custom image is provided directly
  if (customImage) {
    return (
      <div className={cn("inline-flex items-center justify-center overflow-hidden rounded-lg", containerSizeClasses, className)}>
        <img src={customImage} alt={fallbackText || emoji} className="w-full h-full object-cover" />
      </div>
    );
  }

  // Check if string is already a URL or image path
  const isImageSrc = emoji && (emoji.startsWith('http://') || emoji.startsWith('https://') || emoji.startsWith('data:image/'));
  if (isImageSrc) {
    return (
      <div className={cn("inline-flex items-center justify-center overflow-hidden rounded-lg shadow-2xs", containerSizeClasses, className)}>
        <img src={emoji} alt={fallbackText || "Icon"} className="w-full h-full object-cover" />
      </div>
    );
  }

  // If user has chosen to use Images in place of Emojis
  if (useImagesForEmojis) {
    const graphic = EMOJI_GRAPHIC_MAP[emoji.trim()];
    
    if (graphic) {
      const GraphicIcon = graphic.icon;
      
      if (emojiImageStyle === 'minimal') {
        return (
          <span className={cn(
            "inline-flex items-center justify-center rounded-md border border-nat-border/60 bg-white/70 dark:bg-black/20 text-nat-accent-2",
            containerSizeClasses,
            className
          )}>
            <GraphicIcon className={cn(iconDimensionClasses, "transition-transform")} />
          </span>
        );
      }

      if (emojiImageStyle === 'badge') {
        return (
          <span className={cn(
            "inline-flex items-center justify-center rounded-full shadow-2xs border border-white/40",
            graphic.bg,
            graphic.color,
            containerSizeClasses,
            className
          )}>
            <GraphicIcon className={iconDimensionClasses} />
          </span>
        );
      }

      // Default: 'illustrated' rich badge style
      return (
        <span className={cn(
          "inline-flex items-center justify-center rounded-xl shadow-2xs transition-transform hover:scale-105 border border-white/50 dark:border-white/10",
          graphic.bg,
          graphic.color,
          containerSizeClasses,
          className
        )}>
          <GraphicIcon className={iconDimensionClasses} />
        </span>
      );
    }

    // Fallback illustrated badge for any unmapped emoji or symbol
    return (
      <span className={cn(
        "inline-flex items-center justify-center rounded-xl bg-nat-light-1/80 border border-nat-border text-nat-accent-2 shadow-2xs",
        containerSizeClasses,
        className
      )}>
        <Sparkles className={iconDimensionClasses} />
      </span>
    );
  }

  // Standard Emoji Display with dynamic scale
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center select-none transition-transform",
        emojiTextSizeClasses,
        emojiScaleClasses,
        className
      )}
      role="img"
      aria-label={fallbackText || emoji}
    >
      {emoji}
    </span>
  );
};
