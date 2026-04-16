'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '../context/QuizContext';

export default function Quiz() {
  const router = useRouter();
  const { selectedLevel, questions, setQuestions, userAnswers, setUserAnswers, studentName } = useQuiz();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const totalTime = selectedLevel === 'E' ? 60 : selectedLevel === 'M' ? 45 : selectedLevel === 'H' ? 30 : 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [loading, setLoading] = useState(true);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(totalTime);
  }, [currentIdx, totalTime]);

  // Fetch Questions
  useEffect(() => {
    if (!studentName || !selectedLevel) {
      router.replace('/');
      return;
    }
    fetch(`/api/quiz?level=${selectedLevel}`)
      .then(r => r.json())
      .then(data => {
        if (data.questions) {
          setQuestions(data.questions);
        }
        setLoading(false);
      });
  }, [selectedLevel, studentName, router]);

  // Timer
  useEffect(() => {
    if (loading || questions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentIdx === questions.length - 1) {
            router.push('/results');
            return 0;
          } else {
            setCurrentIdx(i => i + 1);
            return totalTime;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, questions.length, router, currentIdx, totalTime]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-headline text-lg text-primary">Loading your expedition...</div>;
  }

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center font-headline text-lg text-error">Failed to load quiz.</div>;
  }

  const currentQ = questions[currentIdx];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  // Progress Ring
  const strokeDasharray = 364.425;
  const dashOffset = (1 - (timeLeft / totalTime)) * strokeDasharray;

  const handleOptionClick = (opt: string) => {
    setUserAnswers({ ...userAnswers, [currentIdx]: opt });
  };

  const isLast = currentIdx === questions.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.push('/results');
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  return (
    <>
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto flex flex-col min-h-screen flex-grow">
        
        <section className="flex flex-col items-center mb-10">
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32">
              <circle className="text-surface-container-high stroke-current" cx="64" cy="64" fill="transparent" r="58" strokeWidth="6"></circle>
              <circle className="text-primary stroke-current progress-ring__circle" cx="64" cy="64" fill="transparent" r="58" strokeLinecap="round" strokeWidth="6"
                style={{ strokeDasharray, strokeDashoffset: dashOffset }}></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold tracking-tighter text-primary">{timeStr}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mt-1">Remaining</span>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              Question {currentIdx + 1}/{questions.length}
            </span>
          </div>
        </section>

        <div className="relative mb-8 group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-xl blur-2xl opacity-50"></div>
          <article className="glass-panel relative rounded-xl p-8 shadow-[0px_24px_48px_rgba(12,58,109,0.06)] border border-white/40">
            <div className="flex gap-4 mb-6">
              <div className="h-10 w-1 bg-secondary rounded-full shrink-0"></div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface leading-tight">
                {currentQ.text}
              </h2>
            </div>
            
            {/* If there is an image URL in data, we can render it. But our dataset primarily doesn't have images. We'll skip image area to avoid broken links. */}
          </article>
        </div>

        <section className="grid grid-cols-1 gap-4 mb-8">
          {currentQ.options.map((opt: string, i: number) => {
            const isSelected = userAnswers[currentIdx] === opt;
            const letter = String.fromCharCode(65 + i);

            if (isSelected) {
              return (
                <button key={i} onClick={() => handleOptionClick(opt)} className="group flex items-center p-5 rounded-xl bg-primary shadow-lg scale-[1.02] text-left ring-4 ring-primary-container/20">
                  <span className="h-10 w-10 shrink-0 rounded-full bg-white flex items-center justify-center font-bold text-primary mr-4">{letter}</span>
                  <span className="font-semibold text-lg text-white break-words">{opt}</span>
                  <span className="ml-auto material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </button>
              )
            }

            return (
              <button key={i} onClick={() => handleOptionClick(opt)} className="group flex items-center p-5 rounded-xl bg-surface-container-lowest border border-white/60 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 text-left active:scale-[0.98]">
                <span className="h-10 w-10 shrink-0 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">{letter}</span>
                <span className="font-semibold text-lg text-on-surface break-words">{opt}</span>
              </button>
            )
          })}
        </section>

        <div className="flex justify-between items-center mt-auto pb-4">
          <button 
            disabled={currentIdx === 0} 
            onClick={() => setCurrentIdx(i => i - 1)}
            className="px-6 py-3 rounded-full text-secondary font-bold font-label disabled:opacity-50">
            Previous
          </button>
          <button 
            onClick={handleNext}
            className="px-8 py-3 rounded-full bg-primary text-white font-bold font-label shadow-xl transition hover:bg-primary-container hover:scale-[1.02]">
            {isLast ? "Submit Expedition" : "Next"}
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
