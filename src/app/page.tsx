'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from './context/QuizContext';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { studentName, setStudentName, schoolName, setSchoolName, studyLevel, setStudyLevel } = useQuiz();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName && schoolName && studyLevel) {
      router.push('/level');
    }
  };

  return (
    <>
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-[100px]"></div>
        <div className="w-full max-w-xl relative z-10">
          <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 shadow-[0px_24px_48px_rgba(12,58,109,0.06)] border border-white/40">
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-primary tracking-tight mb-4">
                Begin Your <span className="text-secondary">Flow.</span>
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                Join the national movement to restore and protect the spirit of the Ganges through knowledge.
              </p>
            </header>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="group">
                <label className="block text-label text-[11px] font-bold uppercase tracking-[0.2em] text-outline mb-3 ml-1">
                  Student Name
                </label>
                <div className="relative">
                  <input required value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full bg-surface-container-high/50 border-none rounded-xl px-5 py-4 text-on-surface placeholder:text-outline focus:ring-0 focus:bg-white transition-all duration-300 outline-none shadow-sm group-focus-within:shadow-md" placeholder="E.g. Aarav Sharma" type="text" />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/50">person</span>
                </div>
              </div>

              <div className="group">
                <label className="block text-label text-[11px] font-bold uppercase tracking-[0.2em] text-outline mb-3 ml-1">
                  Institution
                </label>
                <div className="relative">
                  <input required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full bg-surface-container-high/50 border-none rounded-xl px-5 py-4 text-on-surface placeholder:text-outline focus:ring-0 focus:bg-white transition-all duration-300 outline-none shadow-sm group-focus-within:shadow-md" placeholder="Name of your School or College" type="text" />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/50">school</span>
                </div>
              </div>

              <div className="group">
                <label className="block text-label text-[11px] font-bold uppercase tracking-[0.2em] text-outline mb-3 ml-1">
                  Current Study / Level
                </label>
                <div className="relative">
                  <select required value={studyLevel} onChange={(e) => setStudyLevel(e.target.value)} className="w-full bg-surface-container-high/50 border-none rounded-xl px-5 py-4 text-on-surface appearance-none focus:ring-0 focus:bg-white transition-all duration-300 outline-none shadow-sm group-focus-within:shadow-md">
                    <option disabled value="">Select your current level</option>
                    <option value="secondary">Secondary (Class 6-10)</option>
                    <option value="higher_secondary">Higher Secondary (Class 11-12)</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="postgraduate">Postgraduate</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/50 pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full group relative overflow-hidden bg-gradient-to-br from-primary to-primary-container text-white py-5 rounded-2xl font-headline font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-[0.98]" type="submit">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Journey
                    <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <p className="mt-6 text-center text-label text-xs font-medium text-outline-variant tracking-wide">
                  BY PROCEEDING, YOU AGREE TO THE ENVIRONMENTAL PLEDGE.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <div className="fixed bottom-0 left-0 w-full h-24 overflow-hidden pointer-events-none opacity-40">
        <svg className="absolute bottom-0 w-full" fill="none" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40C240 10 480 10 720 40C960 70 1200 70 1440 40V120H0V40Z" fill="url(#river_gradient)"></path>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="river_gradient" x1="720" x2="720" y1="40" y2="120">
              <stop stopColor="#0c3a6d" stopOpacity="0.2"></stop>
              <stop offset="1" stopColor="#2c694e" stopOpacity="0.1"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}
