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
import { getAnalysisData } from "@/lib/getAnalysis";



const analysis = getAnalysisData();
console.log("RECOMMENDATION ANALYSIS:", analysis);
const recommendationMap: Record<string, any> = {
  battery: {
    title: "Improve Battery Performance",
    description: "Users are reporting battery-related issues. Investigate battery optimization and power consumption.",
    impact: "High Impact",
    priority: "Critical",
    icon: Zap,
  },

  camera: {
    title: "Enhance Camera Quality",
    description: "Negative feedback detected for camera performance. Review image processing and camera tuning.",
    impact: "High Impact",
    priority: "High",
    icon: Target,
  },

  delivery: {
    title: "Improve Delivery Process",
    description: "Customers are unhappy with delivery experience. Review logistics and shipping timelines.",
    impact: "Medium Impact",
    priority: "High",
    icon: Box,
  },

  packaging: {
    title: "Improve Packaging Quality",
    description: "Packaging complaints detected. Strengthen packaging materials and quality checks.",
    impact: "Medium Impact",
    priority: "High",
    icon: Box,
  },

  performance: {
    title: "Optimize Application Performance",
    description: "Performance issues detected. Investigate lag, crashes, and responsiveness.",
    impact: "High Impact",
    priority: "Critical",
    icon: Zap,
  },

  display: {
    title: "Review Display Experience",
    description: "Users reported display-related concerns. Investigate brightness, colors, and visibility.",
    impact: "Medium Impact",
    priority: "Medium",
    icon: Target,
  },

  price: {
    title: "Review Pricing Strategy",
    description: "Customers are expressing concerns about value for money.",
    impact: "Business Impact",
    priority: "Medium",
    icon: Target,
  },

  quality: {
    title: "Improve Product Quality",
    description: "Quality-related complaints detected from customer reviews.",
    impact: "High Impact",
    priority: "Critical",
    icon: Zap,
  },
};

const strategyQueue =
  Object.entries(
    analysis?.feature_percentages || {}
  )
    .filter(
      ([_, data]: any) =>
        data.negative > data.positive
    )
    .map(([feature]) => ({
      id: feature,
      ...recommendationMap[feature],
    }));

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

        {strategyQueue.length === 0 && (
          <div className="flex justify-center">
            <Card className="w-full max-w-2xl p-10">
              <p className="text-green-400 text-lg font-semibold text-center">
                No critical recommendations. Customer feedback is largely positive.
              </p>
            </Card>
          </div>
        )}

        {strategyQueue.map((strategy: any) => {
          const isAssigned = assigned.includes(strategy.id);

          return (
            <motion.div key={strategy.id} variants={itemVariants}>

              <Card className="p-6 flex gap-4 items-center justify-between">

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

              </Card>

            </motion.div>
          );
        })}
      </motion.div>

    </div>
  );
}