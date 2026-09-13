import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import OnboardingModal from "@/components/layout/OnboardingModal";

export const metadata: Metadata = {
  title: "Senior 6 Mechanics Master Lab",
  description:
    "An interactive Senior 6 Mechanics learning platform for Uganda's Advanced Secondary Curriculum — learn, visualise, practise and master mechanics.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <NavBar />
        <OnboardingModal />
        <div className="mx-auto min-h-[calc(100vh-64px)] max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          🚀 Senior 6 Mechanics Master Lab — Understand the Physics. Master the Mathematics. Conquer the Exam.
        </footer>
      </body>
    </html>
  );
}
