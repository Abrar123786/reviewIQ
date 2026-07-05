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
import { getAnalysisData } from "@/lib/getAnalysis";


export default function ComparisonReporting() {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const analysis = getAnalysisData();
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
  const handleGenerate = () => {
    const data = getAnalysisData();
    
    console.log("GENERATED DATA:", data);
    if (!data) {
      alert("No review analysis data found");
      return;
    }

    setResult(data);
  };

  // 🔥 EXPORT FUNCTION
  const handleExport = () => {

      if (!result) {
        alert("No data to export");
        return;
      }

      let report = `
    AI REVIEW ANALYSIS REPORT
    =========================

    Total Reviews Analyzed: ${result.total_reviews}

    KEY INSIGHTS
    ------------
    `;

      result.insights?.forEach((item: string) => {
        report += `• ${item}\n`;
      });

      report += `

    TRENDS
    ------
    `;

      Object.entries(result.trend || {}).forEach(
        ([feature, trend]: any) => {
          report += `${feature}: ${trend}\n`;
        }
      );

      report += `

    REVIEW SUMMARIES
    ----------------
    `;

      result.results?.forEach((review: any, index: number) => {
        report += `
    Review ${index + 1}

    Sentiment: ${review.overall_sentiment}

    Summary:
    ${review.summary}

    `;
      });

      const blob = new Blob([report], {
        type: "text/plain",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "AI_Review_Report.txt";
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
            Feature Sentiment Summary
          </CardTitle>

          <CardDescription>
            Feature-wise sentiment extracted from uploaded reviews
          </CardDescription>
          </CardHeader>

          <CardContent>
            {Object.entries(
              analysis?.feature_percentages || {}
            ).map(([feature, data]: any, i) => (
              <div
                key={i}
                className="flex justify-between mb-3 border-b border-slate-700 pb-2"
              >
                <span className="capitalize font-medium">
                  {feature}
                </span>

                <span className="text-green-400">
                  + {data.positive}%
                </span>

                <span className="text-yellow-400">
                  = {data.neutral}%
                </span>

                <span className="text-red-400">
                  - {data.negative}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* REPORT BUILDER */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <LayoutPanelLeft size={20} />
              Analysis Report Generator
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* MODULES */}
            {[
              'Review Summary',
              'Feature Sentiment Analysis',
              'Trend Analysis',
              'AI Generated Insights'
            ].map((mod) => (
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
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Generated Report</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <div>
              <h3 className="font-semibold">Total Reviews</h3>
              <p>{result.total_reviews}</p>
            </div>

            <div>
              <h3 className="font-semibold">Key Insights</h3>

              <ul className="list-disc pl-5">
                {result.insights?.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Detected Trends</h3>

              <ul className="list-disc pl-5">
                {Object.entries(result.trend || {}).map(
                  ([feature, trend]: any) => (
                    <li key={feature}>
                      {feature}: {trend}
                    </li>
                  )
                )}
              </ul>
            </div>

          </CardContent>
        </Card>
      )}

    </div>
  );
}