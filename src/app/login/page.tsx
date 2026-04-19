"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Mail, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  const [view, setView] = useState<'login' | 'forgot_password' | 'otp'>('login');
  const [email, setEmail] = useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      
      {/* LOGO */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-white font-bold text-xl">
        <Brain size={24} className="text-indigo-500" />
        Review<span className="text-indigo-500">IQ</span>
      </Link>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">

          {/* LOGIN */}
          {view === 'login' && (
            <motion.div key="login" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <Card className="border-white/10 shadow-2xl">

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
                  <CardDescription>Login to your dashboard</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <Label>Password</Label>
                      <button
                        onClick={() => setView('forgot_password')}
                        className="text-xs text-indigo-400"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input type="password" />
                  </div>

                  <Link href="/dashboard">
                    <Button className="w-full">
                      Sign In <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </Link>

                </CardContent>

                <CardFooter className="text-center text-sm">
                  Don’t have an account?
                  <button className="ml-1 text-indigo-400">
                    Sign up
                  </button>
                </CardFooter>

              </Card>
            </motion.div>
          )}

          {/* FORGOT PASSWORD */}
          {view === 'forgot_password' && (
            <motion.div key="forgot" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <Card>

                <CardHeader>
                  <button onClick={() => setView('login')} className="text-sm mb-2">
                    ← Back
                  </button>
                  <CardTitle>Reset Password</CardTitle>
                </CardHeader>

                <CardContent>
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Button
                    className="w-full mt-4"
                    onClick={() => setView('otp')}
                  >
                    Send OTP
                  </Button>
                </CardContent>

              </Card>
            </motion.div>
          )}

          {/* OTP */}
          {view === 'otp' && (
            <motion.div key="otp" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              <Card>

                <CardHeader>
                  <button onClick={() => setView('forgot_password')} className="text-sm mb-2">
                    ← Back
                  </button>
                  <CardTitle>Enter OTP</CardTitle>
                  <CardDescription>
                    Sent to {email || "your email"}
                  </CardDescription>
                </CardHeader>

                <CardContent>

                  <div className="flex gap-2">
                    {[...Array(6)].map((_, i) => (
                      <Input key={i} maxLength={1} className="text-center" />
                    ))}
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => setView('login')}
                  >
                    Verify
                  </Button>

                </CardContent>

              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}