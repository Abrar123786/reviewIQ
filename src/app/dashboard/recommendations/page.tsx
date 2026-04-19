"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Target, 
  Box,
  TrendingUp
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const strategyQueue = [
  {
    id: 'strat_1',
    priority: 'Critical',
    title: 'Rollback v2.4.1 or Hotfix Battery Drain',
    description: 'Battery drain mentions have spiked 400% since the last update.',
    impact: '+4.2 Sentiment Score',
    icon: Zap
  },
  {
    id: 'strat_2',
    priority: 'High',
    title: 'Revamp Unboxing Experience',
    description: 'Users are complaining about packaging issues.',
    impact: '+1.5 Sentiment Score',
    icon: Box
  },
  {
    id: 'strat_3',
    priority: 'Medium',
    title: 'Highlight Fast Charging',
    description: 'Fast charging is highly appreciated.',
    impact: '+12% Conversion',
    icon: Target
  }
];

export default function Recommendations() {

  // 🔥 TRACK ASSIGNED ITEMS
  const [assigned, setAssigned] = useState<string[]>([]);

  const handleAssign = (id: string) => {
    if (assigned.includes(id)) return;

    // simulate backend call
    console.log("Assigned:", id);

    setAssigned((prev) => [...prev, id]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold text-white">Strategy Queue</h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {strategyQueue.map((strategy) => {
          const isAssigned = assigned.includes(strategy.id);

          return (
            <motion.div key={strategy.id} variants={itemVariants}>

              <Card className="p-6 flex gap-4 items-center">

                {/* ICON */}
                <div className="p-3 bg-slate-800 rounded-lg">
                  <strategy.icon size={24} />
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    {strategy.title}
                  </h3>

                  <p className="text-slate-400 text-sm">
                    {strategy.description}
                  </p>
                </div>

                {/* IMPACT */}
                <div className="text-emerald-400 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {strategy.impact}
                </div>

                {/* 🔥 WORKING BUTTON */}
                <Button
                  size="sm"
                  onClick={() => handleAssign(strategy.id)}
                  disabled={isAssigned}
                  className={isAssigned ? "bg-green-600 cursor-not-allowed" : ""}
                >
                  {isAssigned ? "Assigned ✓" : "Assign"}
                  {!isAssigned && <ArrowRight size={14} className="ml-1" />}
                </Button>

              </Card>

            </motion.div>
          );
        })}
      </motion.div>

    </div>
  );
}