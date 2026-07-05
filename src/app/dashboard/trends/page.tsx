"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertOctagon, TrendingDown, TrendingUp, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { getAnalysisData } from "@/lib/getAnalysis";



const analysisData = getAnalysisData();

const timeSeriesData = Object.entries(
  analysisData?.feature_percentages || {}
).map(([feature, data]: any) => ({
  feature,
  positive: data.positive,
}));
console.log("INSIGHTS:", analysisData?.insights);
const anomalies =
  analysisData?.insights
    ?.filter(
      (insight: string) =>
        insight.toLowerCase().includes("issue") ||
        insight.toLowerCase().includes("complaint") ||
        insight.toLowerCase().includes("dissatisfaction")
    )
    .map((insight: string, index: number) => ({
      id: index + 1,
      feature: insight,
    })) || [];

export default function TrendsAnomalies() {
  const [activeAnomaly, setActiveAnomaly] = useState<number | null>(1);
  const analysis = getAnalysisData();
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

      {/* Graph */}
      <div className="lg:col-span-2">
        <Card className="glass-card h-full">
          <CardHeader>
            <CardTitle className="text-white">Trend Summary</CardTitle>
            <CardDescription>
              Feature-wise positive sentiment from analyzed reviews.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timeSeriesData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="feature"
                    stroke="rgba(255,255,255,0.3)"
                    tick={{
                      fill: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    stroke="rgba(255,255,255,0.3)"
                    tick={{
                      fill: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15,23,42,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="positive"
                    name="Positive Sentiment %"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Diagnosis */}
      <div className="lg:col-span-1">
        <AnimatePresence mode="wait">
          {anomalies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="bg-electric-indigo/10 border-electric-indigo/30 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-16 h-16 text-electric-indigo" />
                </div>

                <CardHeader>
                  <CardTitle className="text-electric-indigo flex items-center">
                    <Zap size={16} className="mr-2" />
                    AI Diagnosis
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {anomalies.length > 0
                     ? anomalies.map((a:any) => a.feature).join(" ")
                      : "No anomaly insights available."}
                  </p>

                  <Button className="w-full mt-4 bg-electric-indigo hover:bg-electric-indigo/90 text-white">
                    Review Insights
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>

    {/* Anomaly Feed */}
    <div className="mt-6">
      <Card className="glass-card">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertOctagon className="text-orange-500" size={20} />
            Anomaly Feed
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {anomalies.length === 0 ? (
            <div className="p-5 text-slate-400">
              No anomalies detected in current review data.
            </div>
          ) : (
            anomalies.map((anomaly: any) => (
              <div
                key={anomaly.id}
                className="p-5 border-b border-white/5"
              >
                <div className="flex gap-2 items-center mb-2">
                  <Badge
                    variant="outline"
                    className="border-red-500 text-red-400 bg-red-500/10"
                  >
                    Trend Alert
                  </Badge>

                  <span className="text-xs text-slate-500">
                    Live Analysis
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white capitalize">
                  {anomaly.feature}
                </h4>

                <div className="flex items-center gap-2 mt-2 text-red-400">
                  <TrendingDown size={16} />
                  {anomaly.trend}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
