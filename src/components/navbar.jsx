'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const isQuizPage = pathname?.startsWith('/quiz');

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl flex items-center justify-between px-8 h-20 shadow-[0px_24px_48px_rgba(12,58,109,0.06)]">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">waves</span>
                <span className="font-headline font-extrabold text-2xl tracking-tight text-primary">
                    <Link href="/">
                        Namami Gange
                    </Link>
                </span>
            </div>
            <div className="flex items-center gap-6">
                {!isQuizPage && (
                    <Link
                        href="/leaderboard"
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                    >
                        <span
                            className="material-symbols-outlined text-primary text-xl transition-transform group-hover:scale-110"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            emoji_events
                        </span>
                        <span className="hidden sm:inline text-sm font-bold text-primary tracking-wide">
                            Leaderboard
                        </span>
                    </Link>
                )}
                <span className="hidden md:flex items-center text-label text-sm font-semibold tracking-widest text-secondary">QUIZ EXPEDITION 2026</span>
            </div>
        </nav>
    );
}