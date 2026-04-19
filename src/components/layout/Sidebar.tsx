"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Database, 
  LineChart, 
  TrendingUp, 
  Lightbulb, 
  GitCompare, 
  Settings,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ingestion Engine', href: '/dashboard/ingestion', icon: Database },
  { name: 'Sentiment Analysis', href: '/dashboard/sentiment', icon: LineChart },
  { name: 'Trends & Anomalies', href: '/dashboard/trends', icon: TrendingUp },
  { name: 'Recommendations', href: '/dashboard/recommendations', icon: Lightbulb },
  { name: 'Comparison', href: '/dashboard/comparison', icon: GitCompare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-900/40 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-electric-indigo/20 rounded-lg border border-electric-indigo/50 text-electric-indigo">
          <BrainCircuit size={24} />
        </div>
        <span className="text-xl font-bold tracking-wider text-white">Review<span className="text-electric-indigo">IQ</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group",
                isActive ? "text-white bg-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-sidebar-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-electric-indigo rounded-r-full shadow-[0_0_10px_rgba(124,92,252,0.8)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={20} className={cn("transition-colors duration-300", isActive ? "text-electric-indigo" : "group-hover:text-electric-indigo/70")} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Link 
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
            pathname === '/dashboard/settings' ? "text-white bg-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings size={20} className={pathname === '/dashboard/settings' ? "text-electric-indigo" : ""} />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
