"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Filter, Search, ChevronRight, AlertTriangle, Zap, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  Body,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody
} from "@/components/ui/table";

const features = [
  { name: 'Battery Life', sentiment: 42, trend: '-12%', sparkline: [60, 55, 50, 48, 45, 42] },
  { name: 'UI Navigation', sentiment: 88, trend: '+5%', sparkline: [70, 75, 80, 85, 87, 88] },
  { name: 'Pricing', sentiment: 35, trend: '-2%', sparkline: [40, 38, 37, 36, 35, 35] },
  { name: 'Customer Support', sentiment: 92, trend: '+18%', sparkline: [50, 60, 70, 85, 90, 92] },
];

const reviews = [
  { id: '1', text: "Oh great, another update that drains my battery in 2 hours. Just what I wanted.", sentiment: 'Negative', flags: ['Sarcasm', 'Battery'], date: '2h ago' },
  { id: '2', text: "The new interface is okay, I guess. Not sure if I like it better than the old one.", sentiment: 'Neutral', flags: ['Ambiguity', 'UI'], date: '5h ago' },
  { id: '3', text: "Support was incredibly fast! Fixed my billing issue in 5 minutes.", sentiment: 'Positive', flags: ['Support', 'Billing'], date: '1d ago' },
  { id: '4', text: "It works.", sentiment: 'Neutral', flags: ['Ambiguity'], date: '1d ago' },
  { id: '5', text: "Phone gets literally hot enough to fry an egg when playing games.", sentiment: 'Negative', flags: ['Hyperbole', 'Hardware'], date: '2d ago' },
];

export default function SentimentAnalysis() {
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const renderSparkline = (data: number[], isPositive: boolean) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - ((val - min) / range) * 100}`).join(' ');

    return (
      <svg className="w-16 h-8" viewBox="0 -5 100 110" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? '#22c55e' : '#ef4444'}
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Granular Sentiment</h1>
        <p className="text-slate-400">Deep dive into feature-level sentiment and flagged reviews.</p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        {features.map((feature) => {
          const isPositiveTrend = feature.trend.startsWith('+');
          const isGoodSentiment = feature.sentiment > 60;
          return (
            <Card key={feature.name} className="glass-card hover:border-electric-indigo/30 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-white">{feature.name}</h3>
                  <div className={`text-xs font-medium flex items-center ${isPositiveTrend ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositiveTrend ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {feature.trend}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className={`text-2xl font-bold ${isGoodSentiment ? 'text-green-400' : 'text-red-400'}`}>
                    {feature.sentiment} <span className="text-sm font-normal text-slate-500">score</span>
                  </div>
                  {renderSparkline(feature.sparkline, isPositiveTrend)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Review Table & Side Panel */}
      <div className="flex gap-6 flex-1 min-h-0">
        <Card className="glass-card flex-1 flex flex-col min-w-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg text-white">Analyzed Reviews</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <Input placeholder="Search reviews..." className="pl-8 h-8 w-[200px] bg-slate-900/50 border-white/10 text-xs" />
              </div>
              <Badge variant="outline" className="cursor-pointer hover:bg-white/5 border-white/10 text-slate-300">
                <Filter size={14} className="mr-1" /> Filter
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <Table>
              <TableHeader className="bg-slate-900/50 sticky top-0 border-b border-white/10 z-10">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-slate-400 font-medium">Feedback</TableHead>
                  <TableHead className="text-slate-400 font-medium w-[120px]">Sentiment</TableHead>
                  <TableHead className="text-slate-400 font-medium w-[200px]">AI Flags</TableHead>
                  <TableHead className="text-slate-400 font-medium text-right w-[100px]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow 
                    key={review.id} 
                    className={`border-b border-white/5 cursor-pointer transition-colors ${selectedReview?.id === review.id ? 'bg-electric-indigo/10 border-l-2 border-l-electric-indigo' : 'hover:bg-slate-800/30'}`}
                    onClick={() => setSelectedReview(review)}
                  >
                    <TableCell className="text-white max-w-[300px] truncate">{review.text}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full bg-opacity-10 ${
                        review.sentiment === 'Positive' ? 'text-green-400 bg-green-500' :
                        review.sentiment === 'Negative' ? 'text-red-400 bg-red-500' : 'text-yellow-400 bg-yellow-500'
                      }`}>
                        {review.sentiment}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {review.flags.map(flag => (
                          <Badge key={flag} variant="outline" className={`text-[10px] py-0 px-1 border-opacity-30 ${
                            flag === 'Sarcasm' ? 'border-orange-500 text-orange-400 bg-orange-500/10' :
                            flag === 'Ambiguity' ? 'border-blue-500 text-blue-400 bg-blue-500/10' :
                            'border-slate-500 text-slate-300'
                          }`}>
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-slate-500 text-xs">{review.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Side Panel for Deep Dive */}
        <AnimatePresence>
          {selectedReview && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex-shrink-0"
            >
              <Card className="glass-card h-full flex flex-col border-electric-indigo/20 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                  <h3 className="font-semibold text-white flex items-center">
                    <Zap className="mr-2 text-electric-indigo" size={16} /> Deep Dive Analysis
                  </h3>
                  <button onClick={() => setSelectedReview(null)} className="text-slate-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Original Text</h4>
                    <p className="text-white text-sm leading-relaxed p-3 bg-slate-800/50 rounded-lg border border-white/5">
                      &quot;{selectedReview.text}&quot;
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">AI Interpretation</h4>
                    <div className="space-y-3">
                      {selectedReview.flags.includes('Sarcasm') && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                          <AlertTriangle className="text-orange-400 shrink-0 mt-0.5" size={16} />
                          <div>
                            <p className="text-orange-400 font-medium text-sm">Sarcasm Detected</p>
                            <p className="text-slate-300 text-xs mt-1">Text explicitly states "great update" but context implies extreme frustration regarding battery performance.</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-3 rounded-lg bg-slate-800/30 border border-white/5 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Core Emotion</span>
                          <span className="text-white">Frustration (85%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Primary Entity</span>
                          <span className="text-white">Battery</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Actionability</span>
                          <span className="text-electric-indigo">High (Hardware/Dev)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex gap-2">
                    <Button className="flex-1 bg-electric-indigo hover:bg-electric-indigo/90 text-xs">Route to Issue</Button>
                    <Button variant="outline" className="flex-1 border-white/10 text-xs">Tag</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
