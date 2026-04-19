"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertOctagon, TrendingDown, TrendingUp, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

const timeSeriesData = [
  { date: 'Oct 01', battery: 85, ui: 78, price: 60, support: 90 },
  { date: 'Oct 05', battery: 82, ui: 79, price: 60, support: 92 },
  { date: 'Oct 10', battery: 80, ui: 82, price: 58, support: 91 },
  { date: 'Oct 15', battery: 78, ui: 85, price: 59, support: 89 },
  { date: 'Oct 20', battery: 45, ui: 86, price: 58, support: 85 }, // Anomaly!
  { date: 'Oct 25', battery: 42, ui: 88, price: 58, support: 92 },
  { date: 'Oct 30', battery: 40, ui: 88, price: 58, support: 94 },
];

const anomalies = [
  { 
    id: 1, 
    date: 'Oct 20', 
    feature: 'Battery Life', 
    drop: '-43%', 
    severity: 'Systemic', 
    cause: 'v2.4.1 Firmware Update', 
    status: 'Investigating' 
  },
  { 
    id: 2, 
    date: 'Oct 15', 
    feature: 'Customer Support', 
    drop: '-6%', 
    severity: 'Isolated', 
    cause: 'Holiday staffing shortage', 
    status: 'Resolved' 
  },
];

export default function TrendsAnomalies() {
  const [activeAnomaly, setActiveAnomaly] = useState<number | null>(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Trends & Anomalies</h1>
          <p className="text-slate-400">Time-series tracking and automated anomaly detection.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white bg-slate-900/50">
            <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
          </Button>
          <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white bg-slate-900/50">
            <Filter className="mr-2 h-4 w-4" /> Features
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Time-Series Chart */}
        <div className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-white">Sentiment Trajectory</CardTitle>
              <CardDescription>Compare how feature sentiment evolves over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    {activeAnomaly === 1 && (
                      <ReferenceArea x1="Oct 15" x2="Oct 25" fill="rgba(239, 68, 68, 0.1)" strokeOpacity={0} />
                    )}
                    <Line type="monotone" dataKey="battery" name="Battery Life" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="ui" name="UI Navigation" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="price" name="Pricing" stroke="#eab308" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="support" name="Support" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anomaly Feed */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card flex-1">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertOctagon className="text-orange-500" size={20} />
                Anomaly Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {anomalies.map((anomaly) => (
                <div 
                  key={anomaly.id} 
                  className={`p-5 border-b border-white/5 cursor-pointer transition-colors ${activeAnomaly === anomaly.id ? 'bg-orange-500/5 relative overflow-hidden' : 'hover:bg-slate-800/30'}`}
                  onClick={() => setActiveAnomaly(anomaly.id)}
                >
                  {activeAnomaly === anomaly.id && (
                    <motion.div layoutId="active-anomaly-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className={`border-opacity-30 ${anomaly.severity === 'Systemic' ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-yellow-500 text-yellow-400 bg-yellow-500/10'}`}>
                        {anomaly.severity}
                      </Badge>
                      <span className="text-xs text-slate-500">{anomaly.date}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-1">{anomaly.feature}</h4>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded">
                      <TrendingDown size={16} className="mr-1" /> {anomaly.drop}
                    </div>
                    <div className="text-sm text-slate-400">
                      <span className="text-slate-500">Suspected:</span> {anomaly.cause}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Insight Snippet */}
          <AnimatePresence mode="wait">
            {activeAnomaly === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="bg-electric-indigo/10 border-electric-indigo/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="w-16 h-16 text-electric-indigo" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-electric-indigo text-sm flex items-center">
                      <Zap size={16} className="mr-2" /> AI Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                      We detected a sudden 43% negative sentiment spike related to &quot;Battery&quot; beginning Oct 20. NLP flags indicate hyperbole related to &quot;heat&quot; and &quot;drain&quot;. 
                      <br /><br />
                      <strong>Correlation:</strong> 89% of these reviews mention updating to v2.4.1 within the last 48 hours.
                    </p>
                    <Button className="w-full mt-4 bg-electric-indigo hover:bg-electric-indigo/90 text-white shadow-[0_0_15px_rgba(124,92,252,0.3)]">
                      Create Urgent Jira Ticket
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
