"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeReviews } from "../lib/api";

export default function LandingPage() {
  const [reviewCount, setReviewCount] = useState(18492);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    try {
      setLoading(true);

      const reviews = [
        "Battery is good",
        "Packaging is bad",
        "Delivery was late"
      ];

      const data = await analyzeReviews(reviews);
      setResult(data);

    } catch (error) {
      console.error("API ERROR:", error);
      alert("Backend not connected.");
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <main className="flex-1 w-full max-w-7xl mx-auto px-6">

        {/* 🔥 BUTTON */}
        <div className="mb-10 text-center">
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Run AI Analysis"}
          </Button>
        </div>

        {/* 🔥 CLEAN RESULT UI */}
        {result && (
          <div className="mb-10 space-y-6">

            {/* 🚨 MAIN ISSUE */}
            <div className="bg-red-500/10 border border-red-500 p-4 rounded-xl text-center">
              <h2 className="text-xl font-bold text-red-400">
                🚨 MAIN ISSUE: {result.insights[result.insights.length - 1]}
              </h2>
            </div>

            {/* 💡 INSIGHTS */}
            <div className="bg-white/5 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-2">💡 Insights</h3>
              <ul className="text-slate-300 space-y-1">
                {result.insights.map((item: string, idx: number) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            {/* 📊 FEATURE SUMMARY */}
            <div className="bg-white/5 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-2">📊 Feature Summary</h3>
              <div className="text-slate-300 text-sm">
                {Object.entries(result.feature_percentages).map(([feature, values]: any) => (
                  <div key={feature} className="mb-2">
                    <strong className="capitalize">{feature}</strong> →
                    {" "}Neg: {values.negative}% |
                    {" "}Neu: {values.neutral}% |
                    {" "}Pos: {values.positive}%
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* HERO */}
        <section className="py-20 flex flex-col items-center text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-8">
              <Sparkles size={16} />
              <span>The Next Generation of Customer Intelligence</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Turn <span className="text-indigo-400">1,000</span> reviews into <span className="text-indigo-400">5</span> decisions.
          </motion.h1>

          <motion.p
            className="text-xl text-slate-400 mb-10 max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            ReviewIQ transforms fragmented customer feedback into actionable insights.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Link href="/dashboard">
              <Button size="lg">
                Explore Dashboard
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </motion.div>

          {/* 🔥 LIVE COUNTER */}
          <div className="mt-10 text-white text-lg">
            Reviews Processed: <span className="text-green-400">{reviewCount}</span>
          </div>
        </section>

      </main>
    </div>
  );
}