"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function MotionBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-deep-charcoal">
      {/* Dynamic gradient orb 1 */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(124,92,252,0.8) 0%, rgba(13,15,20,0) 70%)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Dynamic gradient orb 2 */}
      <motion.div
        className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[150px]"
        style={{
          background: 'radial-gradient(circle, rgba(65,105,225,0.8) 0%, rgba(13,15,20,0) 70%)',
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Dynamic gradient orb 3 */}
      <motion.div
        className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full opacity-15 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(138,43,226,0.8) 0%, rgba(13,15,20,0) 70%)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Grid Overlay for technical feel */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
