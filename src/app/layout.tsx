import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Namami Gange Quiz Platform",
  description: "A sleek and educational quiz platform for Namami Gange.",
};

import { QuizProvider } from "./context/QuizContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-background font-body text-on-surface water-pattern min-h-screen flex flex-col`}>
        <QuizProvider>
          <Navbar />
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}
