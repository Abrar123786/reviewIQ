"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, MessageSquare, Star, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const sentimentData = [
  { name: 'Positive', value: 65, color: '#22c55e' },
  { name: 'Neutral', value: 20, color: '#eab308' },
  { name: 'Negative', value: 15, color: '#ef4444' },
];

const emergingIssues = [
  { id: 1, feature: 'Battery Life', sentiment: 'Negative', change: '-12%', impact: 'High', status: 'Investigating' },
  { id: 2, feature: 'Bluetooth Pairing', sentiment: 'Negative', change: '-8%', impact: 'High', status: 'Open' },
  { id: 3, feature: 'App UI Navigation', sentiment: 'Neutral', change: '-3%', impact: 'Medium', status: 'Monitoring' },
  { id: 4, feature: 'Fast Charging', sentiment: 'Positive', change: '+15%', impact: 'Low', status: 'Resolved' },
  { id: 5, feature: 'Water Resistance', sentiment: 'Neutral', change: '-1%', impact: 'Low', status: 'Monitoring' },
];

export default function CommandCenter() {
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
              <div className="text-3xl font-bold text-white">78/100</div>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3" /> +2.5% from last week
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
              <div className="text-3xl font-bold text-white">18,492</div>
              <p className="text-xs text-emerald-400 flex items-center mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3" /> +1,204 today
              </p>
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
              <div className="text-3xl font-bold text-white">3</div>
              <p className="text-xs text-red-400 flex items-center mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3" /> +1 new anomaly detected
              </p>
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
              <div className="text-3xl font-bold text-white">4.2</div>
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
                  Top 5 Emerging Issues
                </CardTitle>
                <CardDescription className="text-slate-400">Features seeing the fastest drop in sentiment.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergingIssues.map((issue) => (
                  <div key={issue.id} className="group flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/50 hover:border-electric-indigo/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${issue.impact === 'High' ? 'bg-red-500/10 text-red-500' :
                          issue.impact === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                        }`}>
                        {issue.impact === 'High' ? <AlertTriangle size={20} /> : <TrendingUp size={20} />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-electric-indigo transition-colors">{issue.feature}</h4>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <span className={`${issue.sentiment === 'Negative' ? 'text-red-400' :
                              issue.sentiment === 'Positive' ? 'text-green-400' : 'text-yellow-400'
                            }`}>{issue.sentiment} Sentiment</span>
                          <span className="text-slate-500">•</span>
                          <span className={`flex items-center ${issue.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {issue.change.startsWith('+') ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                            {issue.change}
                          </span>
                        </div>
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
