'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export default function Header() {
  const { playlists, userProgress } = useAppStore();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-foreground">FocusTube</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-muted hover:text-foreground transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            
            {userProgress.completedVideos > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full">
                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-success">
                  {userProgress.completedVideos} completed
                </span>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
