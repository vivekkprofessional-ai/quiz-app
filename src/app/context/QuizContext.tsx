'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [studentName, setStudentNameState] = useState('');
  const [schoolName, setSchoolNameState] = useState('');
  const [studyLevel, setStudyLevelState] = useState('');
  const [selectedLevel, setSelectedLevelState] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStudent = sessionStorage.getItem('studentName');
      const savedSchool = sessionStorage.getItem('schoolName');
      const savedStudy = sessionStorage.getItem('studyLevel');
      const savedSelected = sessionStorage.getItem('selectedLevel');

      if (savedStudent) setStudentNameState(savedStudent);
      if (savedSchool) setSchoolNameState(savedSchool);
      if (savedStudy) setStudyLevelState(savedStudy);
      if (savedSelected) setSelectedLevelState(savedSelected);
    }
  }, []);

  const setStudentName = (name: string) => {
    setStudentNameState(name);
    if (typeof window !== 'undefined') sessionStorage.setItem('studentName', name);
  };

  const setSchoolName = (school: string) => {
    setSchoolNameState(school);
    if (typeof window !== 'undefined') sessionStorage.setItem('schoolName', school);
  };

  const setStudyLevel = (level: string) => {
    setStudyLevelState(level);
    if (typeof window !== 'undefined') sessionStorage.setItem('studyLevel', level);
  };

  const setSelectedLevel = (level: string) => {
    setSelectedLevelState(level);
    if (typeof window !== 'undefined') sessionStorage.setItem('selectedLevel', level);
  };

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
