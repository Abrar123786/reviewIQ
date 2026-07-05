"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, MessageSquare, Star, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getAnalysisData } from "@/lib/getAnalysis";


export default function CommandCenter() {

  const analysis = getAnalysisData();

  console.log("ANALYSIS DATA:", analysis);

  const positive =
    analysis?.results?.filter(
      (r: any) => r.overall_sentiment === "positive"
    ).length || 0;

  const negative =
    analysis?.results?.filter(
      (r: any) => r.overall_sentiment === "negative"
    ).length || 0;

  const neutral =
    analysis?.results?.filter(
      (r: any) => r.overall_sentiment === "neutral"
    ).length || 0;

  const sentimentData = [
    {
      name: "Positive",
      value: positive,
      color: "#22c55e",
    },
    {
      name: "Neutral",
      value: neutral,
      color: "#eab308",
    },
    {
      name: "Negative",
      value: negative,
      color: "#ef4444",
    },
  ];
  const emergingIssues =
  analysis?.insights?.slice(0, 5).map(
    (item: string, index: number) => ({
      id: index,
      feature: item,
      status:
        item.toLowerCase().includes("critical")
          ? "Critical"
          : item.toLowerCase().includes("increasing")
          ? "Warning"
          : "Info",
    })
  ) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-slate-400">Live intelligence overview for your products.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 border border-white/10 rounded-lg p-1">
          <Badge variant="outline" className="bg-electric-indigo/20 text-electric-indigo border-electric-indigo/30">Last 24h</Badge>
          <Badge variant="ghost" className="text-slate-400 hover:text-white">7 Days</Badge>
          <Badge variant="ghost" className="text-slate-400 hover:text-white">30 Days</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-400">Global Sentiment Score</CardTitle>
              <Activity className="h-4 w-4 text-electric-indigo" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {analysis?.total_reviews
                  ? Math.round(
                      (
                        (positive * 100 +
                          neutral * 50 +
                          negative * 0) /
                        analysis.total_reviews
                      )
                    )
                  : 0}/100
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Based on analyzed reviews
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-400">Total Reviews Analyzed</CardTitle>
              <MessageSquare className="h-4 w-4 text-electric-indigo" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {analysis?.total_reviews || 0}
              </div>
              
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-400">Active Critical Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {analysis?.insights?.filter(
                  (item: string) =>
                    item.toLowerCase().includes("critical")
                ).length || 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Star className="h-20 w-20 text-electric-indigo" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
              <CardTitle className="text-sm font-medium text-slate-400">Avg. Star Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white">
                {analysis?.total_reviews
                  ? (
                      (
                        positive * 5 +
                        neutral * 3 +
                        negative * 1
                      ) /
                      analysis.total_reviews
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <p className="text-xs text-slate-400 flex items-center mt-1">
                Based on verified purchases
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Distribution */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="glass-card h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg text-white">Sentiment Distribution</CardTitle>
              <CardDescription className="text-slate-400">Overall breakdown of customer feelings.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="rgba(255,255,255,0.1)"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Emerging Issues */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Zap className="text-electric-indigo" size={20} />
                  Top Emerging Feedback Insights 
                </CardTitle>
                <CardDescription className="text-slate-400">Summary of notable patterns and observations from analyzed reviews.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergingIssues.map((issue: any) => (
                  <div key={issue.id} className="group flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/50 hover:border-electric-indigo/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-electric-indigo transition-colors">{issue.feature}</h4>
                        
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`
                        ${issue.status === 'Investigating' ? 'border-red-500/30 text-red-400' :
                          issue.status === 'Open' ? 'border-yellow-500/30 text-yellow-400' :
                            issue.status === 'Monitoring' ? 'border-electric-indigo/30 text-electric-indigo' :
                              'border-green-500/30 text-green-400'}
                      `}>
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
