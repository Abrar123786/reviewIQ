"use client";

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Topnav() {
  return (
    <header className="h-16 border-b border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search insights, features, or reviews..." 
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-electric-indigo/50 text-white placeholder:text-slate-500 rounded-full h-10 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-white/10 rounded-full">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-electric-indigo rounded-full animate-pulse-glow" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10 border border-white/10 shadow-[0_0_15px_rgba(124,92,252,0.2)]">
                <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                <AvatarFallback className="bg-electric-indigo/20 text-electric-indigo font-semibold">HQ</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2 bg-slate-900/95 backdrop-blur-xl border-white/10 text-white" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Hannah Q.</p>
                <p className="text-xs leading-none text-slate-400">
                  hannah@reviewiq.ai
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
