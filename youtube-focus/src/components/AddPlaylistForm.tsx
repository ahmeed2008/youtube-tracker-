'use client';

import { useState } from 'react';
import { useAppStore, extractPlaylistId } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function AddPlaylistForm() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [videoCount, setVideoCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const addPlaylist = useAppStore((state) => state.addPlaylist);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a YouTube playlist URL');
      return;
    }

    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      setError('Invalid YouTube playlist URL. Please check the format.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for this playlist');
      return;
    }

    setIsLoading(true);

    // Simulate API call to fetch playlist data
    // In production, this would call a backend service to fetch real YouTube data
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock videos for demo
    const mockVideos = Array.from({ length: videoCount }, (_, i) => ({
      playlistId: url,
      title: `${title} - Lesson ${i + 1}`,
      videoId: `dQw4w9WgXc${i}`,
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXc${i}/mqdefault.jpg`,
      order: i,
    }));

    try {
      addPlaylist(url, title, mockVideos);
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to add playlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Input */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-muted mb-2">
          YouTube Playlist URL
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/playlist?list=..."
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-muted mb-2">
          Playlist Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Complete React Course 2024"
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Video Count (for demo) */}
      <div>
        <label htmlFor="videoCount" className="block text-sm font-medium text-muted mb-2">
          Number of Videos (Demo)
        </label>
        <input
          type="number"
          id="videoCount"
          value={videoCount}
          onChange={(e) => setVideoCount(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
          max="100"
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-muted">
          * In production, this will auto-detect from YouTube
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-primary hover:bg-primary-hover disabled:bg-muted disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Adding Playlist...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Playlist</span>
          </>
        )}
      </button>
    </form>
  );
}
