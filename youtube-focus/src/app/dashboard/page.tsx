'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import Header from '@/components/Header';
import PlaylistCard from '@/components/PlaylistCard';
import AddPlaylistForm from '@/components/AddPlaylistForm';
import ProgressBar from '@/components/ProgressBar';

export default function DashboardPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { playlists, userProgress } = useAppStore();

  const totalVideos = playlists.reduce((sum, p) => sum + p.videos.length, 0);
  const completedVideos = playlists.reduce(
    (sum, p) => sum + p.videos.filter(v => v.completed).length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted">
            Track your learning progress and stay focused on completing your courses.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Playlists */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted">Total Playlists</p>
                <p className="text-2xl font-bold text-foreground">{playlists.length}</p>
              </div>
            </div>
          </div>

          {/* Total Videos */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted">Total Videos</p>
                <p className="text-2xl font-bold text-foreground">{totalVideos}</p>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted">Completed Videos</p>
                <p className="text-2xl font-bold text-foreground">{completedVideos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        {totalVideos > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">Overall Progress</h2>
            <ProgressBar current={completedVideos} total={totalVideos} size="lg" />
          </div>
        )}

        {/* Playlists Section */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Your Playlists
            </h2>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Playlist</span>
              </button>
            )}
          </div>

          {/* Add Playlist Form */}
          {showAddForm && (
            <div className="bg-card border border-border rounded-xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Add New Playlist</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AddPlaylistForm />
            </div>
          )}

          {/* Playlist Grid */}
          {playlists.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No playlists yet</h3>
              <p className="text-muted mb-6">
                Add your first YouTube playlist to start tracking your learning progress.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Your First Playlist</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
