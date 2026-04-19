"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Users, Copy, CheckCircle2, Shield, Settings2, Webhook } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Settings() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400">Manage your workspace, API keys, and team members.</p>
      </div>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-slate-900/50 p-1 border border-white/5">
          <TabsTrigger value="api" className="data-[state=active]:bg-electric-indigo/20 data-[state=active]:text-electric-indigo data-[state=active]:border data-[state=active]:border-electric-indigo/50">
            <Key className="w-4 h-4 mr-2" /> API & Integrations
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-electric-indigo/20 data-[state=active]:text-electric-indigo data-[state=active]:border data-[state=active]:border-electric-indigo/50">
            <Users className="w-4 h-4 mr-2" /> Team Management
          </TabsTrigger>
        </TabsList>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6 mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="mr-2 text-electric-indigo" size={20} /> REST API Keys
              </CardTitle>
              <CardDescription>Use these keys to authenticate your ingestion scripts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-white/10 bg-slate-900/30 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium mb-1">Production Key</h4>
                    <p className="text-xs text-slate-500 font-mono">sk_live_8f92j...49xk2</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-slate-800 border-white/10 text-white hover:bg-slate-700" onClick={() => handleCopy('prod', 'sk_live_8f92jxyz49xk2')}>
                      {copiedKey === 'prod' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">Revoke</Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-slate-900/30 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium mb-1">Test Key</h4>
                    <p className="text-xs text-slate-500 font-mono">sk_test_1m49n...92pq1</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-slate-800 border-white/10 text-white hover:bg-slate-700" onClick={() => handleCopy('test', 'sk_test_1m49nxyz92pq1')}>
                      {copiedKey === 'test' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">Revoke</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-900/50 border-t border-white/5">
              <Button className="bg-electric-indigo hover:bg-electric-indigo/90 text-white">Generate New Key</Button>
            </CardFooter>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Webhook className="mr-2 text-electric-indigo" size={20} /> Webhooks
              </CardTitle>
              <CardDescription>Receive real-time alerts for Critical Anomalies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Endpoint URL</Label>
                <Input placeholder="https://api.yourdomain.com/webhooks/reviewiq" className="bg-slate-900/50 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Secret Signer (for payload verification)</Label>
                <div className="flex gap-2">
                  <Input readOnly value="whsec_k92mx84jfn29xj4" className="bg-slate-900/50 border-white/10 text-slate-500 font-mono" />
                  <Button variant="outline" className="bg-slate-800 border-white/10 text-white" onClick={() => handleCopy('whsec', 'whsec_k92mx84jfn29xj4')}>
                    {copiedKey === 'whsec' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-900/50 border-t border-white/5">
              <Button className="bg-white text-slate-900 hover:bg-slate-200">Save Webhook</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="team" className="space-y-6 mt-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center">
                  <Users className="mr-2 text-electric-indigo" size={20} /> Team Members
                </CardTitle>
                <CardDescription>Invite and manage access levels.</CardDescription>
              </div>
              <Button className="bg-electric-indigo hover:bg-electric-indigo/90 text-white">Invite Member</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Hannah Q.', email: 'hannah@reviewiq.ai', role: 'Admin', active: true },
                  { name: 'Alex M.', email: 'alex@reviewiq.ai', role: 'Product Manager', active: true },
                  { name: 'Sarah J.', email: 'sarah@reviewiq.ai', role: 'Viewer', active: false },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-slate-900/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-electric-indigo/20 text-electric-indigo flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{user.name}</h4>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={`
                        ${user.role === 'Admin' ? 'border-electric-indigo text-electric-indigo bg-electric-indigo/10' : 'border-white/10 text-slate-300'}
                      `}>
                        {user.role}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Settings2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <Shield className="mr-2" size={20} /> Danger Zone
              </CardTitle>
              <CardDescription className="text-slate-400">Destructive actions for your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <div>
                  <h4 className="text-white font-medium mb-1">Delete Workspace</h4>
                  <p className="text-xs text-slate-500">Permanently delete this workspace and all associated data.</p>
                </div>
                <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
