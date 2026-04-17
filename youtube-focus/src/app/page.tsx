'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import Header from '@/components/Header';
import AddPlaylistForm from '@/components/AddPlaylistForm';

export default function HomePage() {
  const router = useRouter();
  const { playlists } = useAppStore();

  const handleGetStarted = () => {
    if (playlists.length > 0) {
      router.push('/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">Focus Mode Learning</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Complete YouTube Courses
            <br />
            <span className="text-primary">Without Distractions</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted max-w-3xl mx-auto mb-10">
            Transform passive watching into active learning. Track your progress, 
            take notes, and build the discipline to finish what you start.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
            >
              Get Started Free
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-card hover:bg-card-hover text-foreground font-semibold rounded-xl border border-border transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Feature 1 */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Distraction-Free</h3>
            <p className="text-muted leading-relaxed">
              No recommendations, no sidebar, no comments. Just you and the content you need to learn.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Track Progress</h3>
            <p className="text-muted leading-relaxed">
              Visual progress bars and completion tracking keep you motivated to finish every course.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Take Notes</h3>
            <p className="text-muted leading-relaxed">
              Write and save notes for each video. Turn passive watching into active learning.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Sequential Flow</h3>
            <p className="text-muted leading-relaxed">
              Watch videos in order with a clear "Next" button. No decision fatigue, just progress.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Visual Dashboard</h3>
            <p className="text-muted leading-relaxed">
              See all your courses at a glance with progress indicators and quick resume.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 card-hover">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Built for Discipline</h3>
            <p className="text-muted leading-relaxed">
              Every interaction is designed to help you build consistency and finish what you start.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted mb-10 max-w-2xl mx-auto">
            Three simple steps to transform your YouTube learning experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Add Playlist</h3>
              <p className="text-muted">
                Paste any YouTube playlist URL and we'll extract all videos in order.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Watch & Learn</h3>
              <p className="text-muted">
                Focus on one video at a time in our distraction-free player.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Complete & Track</h3>
              <p className="text-muted">
                Mark videos complete, take notes, and watch your progress grow.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-foreground">FocusTube</span>
            </div>
            <p className="text-sm text-muted">
              Built for learners who want to finish what they start.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
