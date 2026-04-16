'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '../context/QuizContext';

export default function Results() {
  const router = useRouter();
  const { questions, userAnswers, studentName, schoolName, selectedLevel } = useQuiz();
  const hasSubmitted = useRef(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center font-headline">
        <button onClick={() => router.push('/')} className="px-6 py-3 bg-primary text-white rounded-xl">Go Home</button>
      </div>
    );
  }

  // Calculate score
  let correctCount = 0;
  const correctIds: string[] = [];
  const wrongIds: string[] = [];
  
  const reports = questions.map((q, idx) => {
    const userSelected = userAnswers[idx] || 'Not answered';
    // Strict equality since now q.answer is the clean string
    const isCorrect = userSelected === q.answer;
    
    // Reconstruct the prefixes based on the index they had in this run's shuffled options
    const userIdx = q.options.indexOf(userSelected);
    const userPrefix = userIdx !== -1 ? `${String.fromCharCode(65 + userIdx)}. ` : '';
    
    const correctIdx = q.options.indexOf(q.answer);
    const correctPrefix = correctIdx !== -1 ? `${String.fromCharCode(65 + correctIdx)}. ` : '';

    if (isCorrect) {
      correctCount++;
      correctIds.push(q.id);
    } else {
      wrongIds.push(q.id);
    }
    return {
      question: q.text,
      userAnswer: userSelected === 'Not answered' ? userSelected : userPrefix + userSelected,
      correctAnswer: correctPrefix + q.answer,
      isCorrect,
      explanation: q.explanation
    };
  });

  // Auto-submit score to leaderboard (only once)
  useEffect(() => {
    if (!studentName || !schoolName || !selectedLevel) return;
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    const payload = {
      name: studentName,
      school: schoolName,
      level: selectedLevel,
      score: correctCount,
      correct_ids: correctIds,
      wrong_ids: wrongIds,
      localDate: new Date().toLocaleDateString('en-CA'),
      localTimestamp: new Date().toISOString()
    };

    fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {}); // fire and forget
  }, [studentName, schoolName, selectedLevel, correctCount]);

  return (
    <>
      <main className="pt-24 pb-32 px-6 max-w-4xl mx-auto min-h-screen flex flex-col">
        
        {/* Summary Card */}
        <div className="glass-panel rounded-[2.5rem] p-8 mb-12 shadow-[0px_24px_48px_rgba(12,58,109,0.06)] border border-white/40 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-primary font-headline mb-2">Expedition Report</h2>
            <p className="text-lg text-on-surface-variant font-medium mb-6">{studentName} • {schoolName}</p>
            
            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-surface-container-high flex items-center justify-center bg-white shadow-inner mb-4 relative"
                   style={{
                     borderColor: correctCount > 6 ? '#2c694e' : correctCount > 3 ? '#a7c8ff' : '#ba1a1a'
                   }}>
                <span className="text-4xl font-extrabold text-primary">{correctCount}<span className="text-xl text-outline">/10</span></span>
              </div>
              <p className="text-xl font-bold text-primary">
                {correctCount > 7 ? 'Excellent Knowledge!' : correctCount > 4 ? 'Good Effort!' : 'Keep Learning!'}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Report */}
        <h3 className="text-2xl font-bold text-primary font-headline mb-6">Detailed Analysis</h3>
        <div className="space-y-6">
          {reports.map((r, idx) => (
            <div key={idx} className={`rounded-xl p-6 border shadow-sm ${r.isCorrect ? 'bg-secondary-fixed/10 border-secondary-fixed-dim/50' : 'bg-error-container/20 border-error/20'}`}>
              <div className="flex gap-3 mb-4 items-start">
                <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${r.isCorrect ? 'bg-secondary' : 'bg-error'}`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>
                    {r.isCorrect ? 'check_circle' : 'cancel'}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-on-surface leading-tight pt-1">
                  {idx + 1}. {r.question}
                </h4>
              </div>

              <div className="flex flex-col gap-2 ml-11">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-bold text-outline-variant shrink-0 uppercase tracking-wider w-24">Your Answer:</span>
                  <span className={`text-base font-semibold ${r.isCorrect ? 'text-secondary' : 'text-error'}`}>{r.userAnswer}</span>
                </div>
                {!r.isCorrect && (
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-bold text-outline-variant shrink-0 uppercase tracking-wider w-24">Correct:</span>
                    <span className="text-base font-semibold text-primary">{r.correctAnswer}</span>
                  </div>
                )}
                {r.explanation && r.explanation !== "No explanation provided." && (
                  <div className="flex items-start gap-2 mt-2 pt-2 border-t border-outline-variant/20">
                    <span className="text-sm font-bold text-outline-variant shrink-0 uppercase tracking-wider w-24">Fact:</span>
                    <span className="text-sm text-on-surface-variant font-medium leading-relaxed">{r.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-full bg-primary text-white font-bold font-label shadow-xl transition hover:bg-primary-container hover:scale-[1.02]">
            Start New Expedition
          </button>
        </div>
      </main>
      
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]"></div>
      </div>
    </>
  );
}
