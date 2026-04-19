"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Clock, 
  GitCompare, 
  LayoutPanelLeft, 
  Send,
  CheckCircle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// 🔥 IMPORT BACKEND API
import { analyzeReviews } from "@/lib/api";

const heatmapData = [
  { feature: 'Battery Life', productA: 42, productB: 85, competitor: 70 },
  { feature: 'Camera Quality', productA: 92, productB: 88, competitor: 95 },
  { feature: 'UI Design', productA: 88, productB: 65, competitor: 80 },
  { feature: 'Build Quality', productA: 75, productB: 90, competitor: 85 },
  { feature: 'Value for Money', productA: 60, productB: 82, competitor: 75 },
];

export default function ComparisonReporting() {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  // 🔥 NEW STATE
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getHeatmapColor = (score: number) => {
    if (score >= 85) return 'bg-green-500/80 text-white px-2 rounded';
    if (score >= 70) return 'bg-green-500/40 text-white px-2 rounded';
    if (score >= 50) return 'bg-yellow-500/40 text-white px-2 rounded';
    if (score >= 30) return 'bg-red-500/50 text-white px-2 rounded';
    return 'bg-red-500/80 text-white px-2 rounded';
  };

  // 🔥 GENERATE FUNCTION
  const handleGenerate = async () => {
    try {
      setLoading(true);

      const reviews = [
        "Battery is excellent",
        "Packaging is terrible",
        "Delivery was very late"
      ];

      const data = await analyzeReviews(reviews);
      setResult(data);

    } catch (error) {
      console.error(error);
      alert("Check console for error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 EXPORT FUNCTION
  const handleExport = () => {
    if (!result) {
      alert("No data to export");
      return;
    }

    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Comparison & Reporting</h1>
        <p className="text-slate-400">Benchmarking and automated report generation.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* HEATMAP */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GitCompare className="text-indigo-500" size={20} />
              Product Benchmarking Heatmap
            </CardTitle>
            <CardDescription>Feature comparison</CardDescription>
          </CardHeader>

          <CardContent>
            {heatmapData.map((row, i) => (
              <div key={i} className="flex justify-between mb-2">
                <span>{row.feature}</span>
                <span className={getHeatmapColor(row.productA)}>{row.productA}</span>
                <span className={getHeatmapColor(row.productB)}>{row.productB}</span>
                <span className={getHeatmapColor(row.competitor)}>{row.competitor}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* REPORT BUILDER */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <LayoutPanelLeft size={20} />
              Report Builder
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* MODULES */}
            {['KPI Snapshot', 'Top Issues', 'Heatmap', 'Strategy Queue'].map((mod) => (
              <div key={mod} className="flex items-center p-3 border border-white/10 rounded-lg">
                <CheckCircle size={12} className="text-white mr-2" />
                <span className="text-sm text-slate-300">{mod}</span>
              </div>
            ))}

            {/* SWITCH */}
            <div className="flex items-center justify-between">
              <span className="text-white">Auto Send</span>
              <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
            </div>

          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button onClick={handleGenerate}>
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate"}
            </Button>
          </CardFooter>

        </Card>

      </div>

      {/* 🔥 SHOW RESULT */}
      {result && (
        <div className="bg-black text-green-400 p-4 rounded-lg text-xs overflow-auto">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

    </div>
  );
}