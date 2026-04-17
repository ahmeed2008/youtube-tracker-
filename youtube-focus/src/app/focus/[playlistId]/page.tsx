'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import VideoNotes from '@/components/VideoNotes';

export default function FocusModePage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.playlistId as string;

  const { 
    getPlaylist, 
    markVideoComplete, 
    setCurrentVideo, 
    getCurrentVideo,
    getNextVideo,
    getPreviousVideo 
  } = useAppStore();

  const playlist = getPlaylist(playlistId);
  const currentVideo = playlist ? playlist.videos[playlist.currentVideoIndex] : null;
  const nextVideo = playlist ? playlist.videos[playlist.currentVideoIndex + 1] : null;
  const prevVideo = playlist ? playlist.videos[playlist.currentVideoIndex - 1] : null;
  
  const completedCount = playlist?.videos.filter(v => v.completed).length || 0;
  const totalCount = playlist?.videos.length || 0;
  const isLastVideo = playlist ? playlist.currentVideoIndex === playlist.videos.length - 1 : true;
  const isCompleted = currentVideo?.completed;

  const handleMarkComplete = () => {
    if (currentVideo && playlist) {
      markVideoComplete(playlist.id, currentVideo.id);
      
      // Auto-advance to next video after a short delay
      if (!isLastVideo) {
        setTimeout(() => {
          setCurrentVideo(playlist.id, playlist.currentVideoIndex + 1);
        }, 800);
      }
    }
  };

  const handleNextVideo = () => {
    if (playlist && !isLastVideo) {
      setCurrentVideo(playlist.id, playlist.currentVideoIndex + 1);
    }
  };

  const handlePreviousVideo = () => {
    if (playlist && playlist.currentVideoIndex > 0) {
      setCurrentVideo(playlist.id, playlist.currentVideoIndex - 1);
    }
  };

  if (!playlist || !currentVideo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted">Loading playlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Focus Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar current={completedCount} total={totalCount} size="lg" />
        </div>

        {/* Video Player Section */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
          {/* YouTube Embed - Distraction Free */}
          <div className="aspect-video bg-black relative">
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={currentVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            />
          </div>

          {/* Video Info & Controls */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {currentVideo.title}
              </h1>
              <p className="text-sm text-muted">
                Video {playlist.currentVideoIndex + 1} of {totalCount}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              {/* Previous Button */}
              <button
                onClick={handlePreviousVideo}
                disabled={playlist.currentVideoIndex === 0}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>

              {/* Complete Button */}
              <button
                onClick={handleMarkComplete}
                disabled={isCompleted}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95 ${
                  isCompleted
                    ? 'bg-success/20 text-success cursor-default'
                    : 'bg-primary hover:bg-primary-hover text-white'
                }`}
              >
                {isCompleted ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Completed!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Mark as Complete</span>
                  </>
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextVideo}
                disabled={isLastVideo}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span>Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Next Video Preview */}
            {!isLastVideo && nextVideo && (
              <div 
                onClick={handleNextVideo}
                className="mt-4 p-4 bg-background/50 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={nextVideo.thumbnail}
                    alt={nextVideo.title}
                    className="w-32 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/320x180/171717/a3a3a3?text=No+Thumbnail';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted mb-1">Up Next</p>
                    <h4 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {nextVideo.title}
                    </h4>
                  </div>
                  <svg className="w-5 h-5 text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )}

            {/* Completion Message */}
            {isLastVideo && isCompleted && (
              <div className="mt-6 p-6 bg-success/10 border border-success/20 rounded-xl text-center">
                <div className="flex items-center justify-center space-x-2 text-success mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg font-semibold">Playlist Completed!</span>
                </div>
                <p className="text-muted">
                  Congratulations! You've finished all videos in this playlist.
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="mt-4 px-6 py-2.5 bg-success hover:bg-success/80 text-white font-medium rounded-lg transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <VideoNotes playlistId={playlist.id} videoId={currentVideo.id} />
      </main>
    </div>
  );
}
