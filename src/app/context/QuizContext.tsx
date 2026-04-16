'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuizContextType {
  studentName: string;
  setStudentName: (name: string) => void;
  schoolName: string;
  setSchoolName: (name: string) => void;
  studyLevel: string;
  setStudyLevel: (level: string) => void;
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  questions: any[];
  setQuestions: (q: any[]) => void;
  userAnswers: { [key: number]: string };
  setUserAnswers: (ans: { [key: number]: string }) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [studyLevel, setStudyLevel] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});

  return (
    <QuizContext.Provider value={{
      studentName, setStudentName,
      schoolName, setSchoolName,
      studyLevel, setStudyLevel,
      selectedLevel, setSelectedLevel,
      questions, setQuestions,
      userAnswers, setUserAnswers
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
