'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '../context/QuizContext';

export default function LevelSelection() {
  const router = useRouter();
  const { setSelectedLevel } = useQuiz();

  const handleSelect = (level: string) => {
    setSelectedLevel(level);
    router.push('/quiz');
  };

  return (
    <>
      <main className="relative pt-24 pb-32 px-6 max-w-7xl mx-auto overflow-hidden flex-grow flex flex-col justify-center">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-[11px] uppercase tracking-widest font-bold text-secondary bg-secondary-fixed/30 rounded-full">
              Step 1: Choose Your Flow
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter mb-4 leading-tight">
              Select Your Challenge Level
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              Choose a difficulty that matches your knowledge of the holy Ganges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          {/* E Card */}
          <div onClick={() => handleSelect('E')} className="glass-panel rounded-[2.5rem] p-8 group cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-[0px_24px_48px_rgba(12,58,109,0.06)] border border-white/40 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-primary text-3xl">child_care</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3 font-headline">Easy</h3>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                  Perfect for young explorers or those starting their journey to understand the river's basics.
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-semibold text-primary/60">60s/Q • 10 Qs</span>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* M Card */}
          <div onClick={() => handleSelect('M')} className="glass-panel rounded-[2.5rem] p-8 group cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-[0px_24px_48px_rgba(12,58,109,0.06)] border border-white/40 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-primary text-3xl">waves</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3 font-headline">Medium</h3>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                  Dive deeper into the environmental aspects and historical significance of the Namami Gange mission.
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-semibold text-primary/60">45s/Q • 10 Qs</span>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* H Card */}
          <div onClick={() => handleSelect('H')} className="glass-panel rounded-[2.5rem] p-8 group cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-[0px_24px_48px_rgba(12,58,109,0.06)] border border-white/40 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3 font-headline">Hard</h3>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                A balanced challenge focusing on biodiversity, sewage treatment plants, and river conservation data.
              </p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-semibold text-primary/60">30s/Q • 10 Qs</span>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
