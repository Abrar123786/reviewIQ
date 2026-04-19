"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  Play,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const pipelineSteps = [
  "Data Ingestion",
  "Parsing & Structuring",
  "Deduplication",
  "Bot/Spam Flagging",
  "AI Sentiment Analysis",
];

export default function IngestionEngine() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [manualText, setManualText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // 🔥 BACKEND CALL
  const processReviews = async (reviews: string[]) => {
    try {
      setIsProcessing(true);
      setActiveStep(0);
      setLogs(["[SYSTEM] Starting pipeline..."]);
      setAnalysisResult(null);

      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviews }),
      });

      const data = await res.json();
      console.log("BACKEND RESULT:", data);
      setAnalysisResult(data);

      let step = 0;
      const interval = setInterval(() => {
        step++;
        setActiveStep(step);
        setLogs((prev) => [
          ...prev,
          `[PIPELINE] Completed: ${pipelineSteps[step - 1]}`,
        ]);

        if (step === pipelineSteps.length) {
          clearInterval(interval);
          setIsProcessing(false);
          setLogs((prev) => [
            ...prev,
            "[SYSTEM] Done. Reviews processed successfully.",
          ]);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Backend error");
      setIsProcessing(false);
    }
  };

  // 🔥 FILE UPLOAD (FIXED + CSV SAFE)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      alert("No file selected");
      return;
    }

    console.log("FILE:", file.name);

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = reader.result as string;
        console.log("RAW FILE:", text);

        let reviews: string[] = [];

        // 🔥 SIMPLE CSV SUPPORT
        if (text.includes(",")) {
          reviews = text
            .split("\n")
            .map((line) => line.split(",").pop()?.trim())
            .filter((r) => r && r.length > 0) as string[];
        } else {
          reviews = text
            .split("\n")
            .map((r) => r.trim())
            .filter((r) => r.length > 0);
        }

        console.log("PARSED REVIEWS:", reviews);

        if (reviews.length === 0) {
          alert("File is empty or invalid");
          return;
        }

        processReviews(reviews);
      } catch (err) {
        console.error(err);
        alert("File parsing failed");
      }
    };

    reader.onerror = () => {
      alert("File read error");
    };

    reader.readAsText(file);
  };

  // 🔥 MANUAL ENTRY
  const handleManual = () => {
    if (!manualText.trim()) {
      alert("Enter reviews");
      return;
    }

    const reviews = manualText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    processReviews(reviews);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white">
        Ingestion Engine
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="upload">
            <TabsList className="grid grid-cols-3 bg-slate-900 p-1 rounded-xl">
              <TabsTrigger value="upload">File Upload</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="api">Live API</TabsTrigger>
            </TabsList>

            {/* FILE UPLOAD (FIXED) */}
            <TabsContent value="upload">
              <Card>
                <CardContent className="flex flex-col items-center py-20">
                  <UploadCloud size={40} className="mb-4" />

                  <p className="text-slate-400 mb-4">
                    Upload .txt or .csv (one review per line)
                  </p>

                  {/* 🔥 IMPORTANT: DIRECT INPUT */}
                  <input
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    className="mt-4"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* MANUAL */}
            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Entry</CardTitle>
                </CardHeader>

                <CardContent>
                  <Textarea
                    value={manualText}
                    onChange={(e) =>
                      setManualText(e.target.value)
                    }
                    placeholder="Enter reviews line by line..."
                    className="min-h-[150px]"
                  />
                </CardContent>

                <CardContent>
                  <Button onClick={handleManual}>
                    Analyze <Play className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API */}
            <TabsContent value="api">
              <Card>
                <CardContent>
                  <Button
                    onClick={() =>
                      processReviews([
                        "Battery is good",
                        "Packaging is bad",
                        "Delivery was late",
                      ])
                    }
                  >
                    Trigger API <Play className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* PIPELINE */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Processing Pipeline</CardTitle>
            </CardHeader>

            <CardContent>
              {pipelineSteps.map((step, i) => {
                const done = i < activeStep;
                const active = i === activeStep;

                return (
                  <div key={i} className="flex items-center mb-3">
                    {done ? (
                      <CheckCircle2 className="text-green-500 mr-2" />
                    ) : active ? (
                      <RefreshCw className="animate-spin mr-2" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-500 rounded mr-2" />
                    )}
                    {step}
                  </div>
                );
              })}

              <div className="mt-4 text-xs bg-black p-2 rounded h-32 overflow-auto">
                {logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 🔥 REAL OUTPUT */}
      {analysisResult && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Analysis Output
          </h2>

          <div className="bg-slate-900 p-4 rounded mb-4">
            Total Reviews: {analysisResult.total_reviews}
          </div>

          <div className="space-y-4">
            {analysisResult.results.map((r: any, i: number) => (
              <div key={i} className="bg-slate-800 p-4 rounded">
                <p className="text-white">{r.summary}</p>

                <p className="text-sm text-slate-400 mt-1">
                  Sentiment: {r.overall_sentiment}
                </p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {Object.entries(r.features).map(
                    ([k, v]: any) => (
                      <span
                        key={k}
                        className="text-xs bg-black px-2 py-1 rounded"
                      >
                        {k}: {v}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-slate-900 p-4 rounded">
            <h3 className="font-bold mb-2">Insights</h3>
            {analysisResult.insights.map((ins: string, i: number) => (
              <p key={i}>• {ins}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}