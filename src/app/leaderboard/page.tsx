'use client'

import React, { useState, useEffect, useCallback } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface LeaderboardEntry {
  name: string;
  school: string;
  level: string;
  score: number;
  timestamp: string;
  rank?: number;
  correct_ids?: string[];
  wrong_ids?: string[];
}

function getLevelLabel(level: string) {
  switch (level) {
    case 'E': return 'Easy';
    case 'M': return 'Medium';
    case 'H': return 'Hard';
    default: return level;
  }
}

function getLevelColor(level: string) {
  switch (level) {
    case 'E': return 'bg-green-100 text-green-700';
    case 'M': return 'bg-blue-100 text-blue-700';
    case 'H': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getRankDisplay(rank: number) {
  if (rank === 1) return { emoji: '🥇', bg: 'bg-amber-50 border-amber-200' };
  if (rank === 2) return { emoji: '🥈', bg: 'bg-gray-50 border-gray-200' };
  if (rank === 3) return { emoji: '🥉', bg: 'bg-orange-50 border-orange-200' };
  return { emoji: `${rank}`, bg: 'bg-surface-container-low border-white/40' };
}

export default function Leaderboard() {
  const today = new Date();
  const localTodayStr = today.toLocaleDateString('en-CA');
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(localTodayStr);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [datesWithData, setDatesWithData] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);
  const [selectedReport, setSelectedReport] = useState<LeaderboardEntry | null>(null);
  const [detailedQuestions, setDetailedQuestions] = useState<any[] | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleOpenReport = (entry: LeaderboardEntry) => {
    setSelectedReport(entry);
    setDetailedQuestions(null);
    setLoadingDetails(false);
  };

  const handleFetchDetails = async () => {
    if (!selectedReport) return;
    const ids = [];
    if (selectedReport.correct_ids) ids.push(...selectedReport.correct_ids);
    if (selectedReport.wrong_ids) ids.push(...selectedReport.wrong_ids);
    
    if (ids.length === 0) {
      alert("Detailed data is not available for this older entry.");
      return;
    }
    
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/quiz/details?ids=${ids.join(',')}`);
      const data = await res.json();
      
      if (data.questions) {
        const correctSet = new Set(selectedReport.correct_ids || []);
        const mapped = data.questions.map((q: any) => ({
          ...q,
          isCorrect: correctSet.has(q.id)
        }));
        setDetailedQuestions(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch which dates have data
  useEffect(() => {
    fetch('/api/leaderboard?allDates=true')
      .then(r => r.json())
      .then(data => {
        if (data.dates) {
          setDatesWithData(new Set(data.dates));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch leaderboard for selected date and page
  const fetchLeaderboard = useCallback(async (date: string, search: string, page: number) => {
    setLoading(true);
    try {
      let url = `/api/leaderboard?date=${date}&page=${page}&limit=10`;
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setEntries(data.entries || []);
      setTotalPages(data.totalPages || 1);
      setTotalEntries(data.totalEntries || 0);
      setCurrentPage(data.currentPage || 1);
    } catch {
      setEntries([]);
      setTotalPages(1);
      setTotalEntries(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchLeaderboard(selectedDate, searchQuery, currentPage);
      setAnimateKey(prev => prev + 1);
    }
  }, [selectedDate, searchQuery, currentPage, fetchLeaderboard]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Calendar helpers
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${m}-${d}`;
    setSelectedDate(dateStr);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const todayStr = localTodayStr;

  // Format selected date for display
  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;
  const formattedDate = selectedDateObj
    ? selectedDateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <>
      <main className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen flex flex-col">

        {/* Page Header */}
        <div className="text-center mb-10 relative z-10">
          <span className="inline-block px-4 py-1.5 mb-4 text-[11px] uppercase tracking-widest font-bold text-secondary bg-secondary-fixed/30 rounded-full">
            Daily Rankings
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tighter mb-3 leading-tight font-headline">
            Expedition <span className="text-secondary">Leaderboard</span>
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Select a date to view the top performers. Search for any participant by name.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 relative z-10">

          {/* ─── Calendar Panel ─── */}
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 shadow-[0px_24px_48px_rgba(12,58,109,0.06)] border border-white/40 self-start">

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="w-10 h-10 rounded-full bg-surface-container-high/50 hover:bg-surface-container-high flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-xl">chevron_left</span>
              </button>
              <h2 className="text-lg font-bold text-primary font-headline tracking-tight">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={nextMonth}
                className="w-10 h-10 rounded-full bg-surface-container-high/50 hover:bg-surface-container-high flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-xl">chevron_right</span>
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[11px] font-bold uppercase tracking-wider text-outline py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for offset */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-11" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const m = String(currentMonth + 1).padStart(2, '0');
                const d = String(day).padStart(2, '0');
                const dateStr = `${currentYear}-${m}-${d}`;
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === todayStr;
                const hasData = datesWithData.has(dateStr);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      relative h-11 w-full rounded-xl text-sm font-semibold transition-all duration-200
                      flex items-center justify-center
                      ${isSelected
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : isToday
                          ? 'bg-primary/10 text-primary ring-2 ring-primary/30 hover:bg-primary/20'
                          : 'text-on-surface hover:bg-surface-container-high/70 active:scale-95'
                      }
                    `}
                  >
                    {day}
                    {hasData && !isSelected && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Leaderboard Panel ─── */}
          <div className="flex flex-col gap-6">

            {/* Search Bar */}
            <div className="glass-panel rounded-2xl p-2 shadow-sm border border-white/40">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/50 text-xl">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by participant name..."
                  className="w-full bg-surface-container-high/50 border-none rounded-xl pl-12 pr-5 py-4 text-on-surface placeholder:text-outline focus:ring-0 focus:bg-white transition-all duration-300 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-outline/10 flex items-center justify-center hover:bg-outline/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-outline text-base">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Date Label & Summary */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-secondary text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  calendar_today
                </span>
                <div>
                  <h3 className="text-xl font-bold text-primary font-headline">{formattedDate}</h3>
                  <p className="text-sm text-outline">
                    {searchQuery
                      ? `Showing results for "${searchQuery}"`
                      : totalEntries > 0
                        ? `Daily Rankings (${totalEntries} Participants)`
                        : 'Top Performers'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div
              key={animateKey}
              className="glass-panel rounded-[2rem] overflow-hidden shadow-[0px_24px_48px_rgba(12,58,109,0.06)] border border-white/40 leaderboard-animate-in flex flex-col justify-between min-h-[350px]"
            >
              <div>
                {/* Header Row */}
                <div className="bg-gradient-to-r from-primary to-primary-container px-6 py-4">
                  <div className="grid grid-cols-[50px_1fr_1fr_80px_70px] md:grid-cols-[60px_1.5fr_1.5fr_100px_80px] gap-2 text-[11px] font-bold uppercase tracking-widest text-white/80">
                    <span>Rank</span>
                    <span>Name</span>
                    <span>Institution</span>
                    <span>Level</span>
                    <span className="text-right">Score</span>
                  </div>
                </div>

                {/* Entries */}
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
                      <span className="text-sm text-outline font-medium">Loading results...</span>
                    </div>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6">
                    <span
                      className="material-symbols-outlined text-5xl text-outline/30 mb-4"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      sentiment_neutral
                    </span>
                    <p className="text-lg font-bold text-on-surface-variant mb-1">
                      {searchQuery ? 'No matching participants' : 'No results yet'}
                    </p>
                    <p className="text-sm text-outline text-center max-w-xs">
                      {searchQuery
                        ? `No one named "${searchQuery}" took the quiz on this date.`
                        : 'No quiz attempts were recorded on this date. Try selecting another day!'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-outline-variant/10">
                    {entries.map((entry, idx) => {
                      const rank = entry.rank || idx + 1;
                      const { emoji, bg } = getRankDisplay(rank);
                      return (
                        <div
                          key={`${entry.name}-${entry.timestamp}-${idx}`}
                          onClick={() => handleOpenReport(entry)}
                          className={`
                            grid grid-cols-[50px_1fr_1fr_80px_70px] md:grid-cols-[60px_1.5fr_1.5fr_100px_80px]
                            gap-2 items-center px-6 py-4
                            hover:bg-surface-container-high/30 transition-colors duration-200
                            leaderboard-row cursor-pointer
                          `}
                          style={{ animationDelay: `${idx * 60}ms` }}
                        >
                          {/* Rank */}
                          <div className="flex items-center justify-center">
                            {rank <= 3 ? (
                              <span className="text-2xl">{emoji}</span>
                            ) : (
                              <span className={`w-8 h-8 rounded-full ${bg} border flex items-center justify-center text-sm font-bold text-on-surface-variant`}>
                                {emoji}
                              </span>
                            )}
                          </div>

                          {/* Name */}
                          <div className="min-w-0">
                            <p className="font-bold text-on-surface truncate">{entry.name}</p>
                          </div>

                          {/* School */}
                          <div className="min-w-0">
                            <p className="text-sm text-on-surface-variant truncate">{entry.school}</p>
                          </div>

                          {/* Level */}
                          <div>
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${getLevelColor(entry.level)}`}>
                              {getLevelLabel(entry.level)}
                            </span>
                          </div>

                          {/* Score */}
                          <div className="text-right">
                            <span className="text-xl font-black text-primary">{entry.score}</span>
                            <span className="text-xs text-outline font-medium">/10</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-surface-container-high/20 border-t border-outline-variant/10 mt-auto">
                  <span className="text-xs font-semibold text-outline">
                    Showing page {currentPage} of {totalPages} ({totalEntries} total)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 disabled:opacity-40 disabled:hover:bg-primary/10 transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                            pageNum === currentPage
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-surface-container-high/50 text-on-surface-variant hover:bg-primary/10'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 disabled:opacity-40 disabled:hover:bg-primary/10 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* Background blurs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]"></div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedReport(null)}>
          <div 
            className={`glass-panel w-full ${detailedQuestions ? 'max-w-2xl max-h-[90vh] overflow-y-auto' : 'max-w-md'} rounded-[2.5rem] p-8 shadow-2xl border border-white/40 text-center relative animate-in fade-in zoom-in duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-high/50 hover:bg-surface-container-high flex items-center justify-center transition-colors z-20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-outline text-xl hover:text-primary">close</span>
            </button>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/10 pointer-events-none"></div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 mb-4 text-[10px] uppercase tracking-widest font-bold text-secondary bg-secondary-fixed/50 rounded-full border border-secondary/10">
                {selectedDateObj ? selectedDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
              </span>
              <h2 className="text-3xl font-black text-primary font-headline mb-2">Expedition Report</h2>
              <p className="text-lg text-on-surface-variant font-bold mb-1">{selectedReport.name}</p>
              <p className="text-sm text-outline font-medium mb-6">{selectedReport.school}</p>
              
              <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-surface-container-high flex items-center justify-center bg-white shadow-inner mb-4 relative"
                    style={{
                      borderColor: selectedReport.score > 6 ? '#2c694e' : selectedReport.score > 3 ? '#a7c8ff' : '#ba1a1a'
                    }}>
                  <span className="text-4xl font-extrabold text-primary">{selectedReport.score}<span className="text-xl text-outline">/10</span></span>
                </div>
                <p className="text-xl font-bold text-primary mb-3">
                  {selectedReport.score > 7 ? 'Excellent Knowledge!' : selectedReport.score > 4 ? 'Good Effort!' : 'Keep Learning!'}
                </p>
                <div className="flex gap-2 justify-center mt-2 mb-6">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${getLevelColor(selectedReport.level)}`}>
                    {getLevelLabel(selectedReport.level)}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-surface-container-low text-on-surface-variant flex items-center gap-1 border border-outline/10">
                    Rank: {selectedReport.rank || 'N/A'}
                  </span>
                </div>

                {!detailedQuestions && (
                  <button 
                    onClick={handleFetchDetails}
                    disabled={loadingDetails || (!selectedReport.correct_ids && !selectedReport.wrong_ids)}
                    className="px-6 py-2.5 rounded-full bg-secondary text-white font-bold text-sm shadow-md transition hover:bg-secondary-container hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2"
                  >
                    {loadingDetails ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                        View Detailed Analysis
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Detailed Analysis View */}
              {detailedQuestions && (
                <div className="mt-10 pt-8 border-t border-outline/10 text-left w-full">
                  <h3 className="text-2xl font-bold text-primary font-headline mb-6 text-center">Detailed Analysis</h3>
                  <div className="space-y-4">
                    {detailedQuestions.map((q, idx) => {
                      const correctOptionStr = q.options.find((o: string) => o.startsWith(q.answer)) || q.answer;
                      return (
                        <div key={idx} className={`rounded-xl p-5 border shadow-sm ${q.isCorrect ? 'bg-secondary-fixed/10 border-secondary-fixed-dim/50' : 'bg-error-container/20 border-error/20'}`}>
                          <div className="flex gap-3 mb-3 items-start">
                            <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white ${q.isCorrect ? 'bg-secondary' : 'bg-error'}`}>
                              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '16px' }}>
                                {q.isCorrect ? 'check_circle' : 'cancel'}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-on-surface leading-tight pt-0.5">
                              {idx + 1}. {q.text}
                            </h4>
                          </div>

                          <div className="flex flex-col gap-1.5 ml-9">
                            <div className="flex items-start gap-2">
                              <span className="text-[12px] font-bold text-outline-variant shrink-0 uppercase tracking-wider w-20">Your Answer:</span>
                              <span className={`text-sm font-semibold ${q.isCorrect ? 'text-secondary' : 'text-error'}`}>
                                {q.isCorrect ? correctOptionStr : 'Incorrect'}
                              </span>
                            </div>
                            {!q.isCorrect && (
                              <div className="flex items-start gap-2">
                                <span className="text-[12px] font-bold text-outline-variant shrink-0 uppercase tracking-wider w-20">Correct:</span>
                                <span className="text-sm font-semibold text-primary">{correctOptionStr}</span>
                              </div>
                            )}
                            {q.explanation && (
                              <div className="flex items-start gap-2 mt-1.5 pt-1.5 border-t border-outline-variant/20">
                                <span className="text-[12px] font-bold text-outline-variant shrink-0 uppercase tracking-wider w-20">Fact:</span>
                                <span className="text-sm text-on-surface-variant font-medium leading-normal">{q.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
