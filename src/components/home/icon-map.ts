import React from 'react';
import {
  Code2,
  Smartphone,
  Palette,
  Cpu,
  TrendingUp,
  Video,
  Layers,
  Search,
  CheckCircle2,
  Zap,
  Users,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Mail,
  MessageCircle,
  LucideIcon,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/icons';

export const ICON_MAP: Record<string, LucideIcon | React.ComponentType<{ className?: string }>> = {
  Code2,
  Smartphone,
  Palette,
  Cpu,
  TrendingUp,
  Video,
  Layers,
  Search,
  CheckCircle2,
  Zap,
  Users,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Mail,
  MessageCircle,
  Linkedin: LinkedinIcon,
};

export const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

