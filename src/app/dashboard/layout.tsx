"use client";

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topnav } from '@/components/layout/Topnav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Topnav />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
