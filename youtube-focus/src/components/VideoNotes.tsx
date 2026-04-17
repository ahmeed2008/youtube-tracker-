'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

interface VideoNotesProps {
  playlistId: string;
  videoId: string;
}

export default function VideoNotes({ playlistId, videoId }: VideoNotesProps) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const updateVideoNotes = useAppStore((state) => state.updateVideoNotes);
  const getPlaylist = useAppStore((state) => state.getPlaylist);

  // Load existing notes when component mounts or video changes
  useEffect(() => {
    const playlist = getPlaylist(playlistId);
    const video = playlist?.videos.find(v => v.id === videoId);
    if (video) {
      setNotes(video.notes);
    }
  }, [playlistId, videoId, getPlaylist]);

  // Auto-save notes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes) {
        saveNotes();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [notes]);

  const saveNotes = async () => {
    setIsSaving(true);
    try {
      updateVideoNotes(playlistId, videoId, notes);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Your Notes</span>
        </h3>
        
        <div className="flex items-center space-x-2 text-xs">
          {isSaving ? (
            <span className="text-muted flex items-center space-x-1">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Saving...</span>
            </span>
          ) : lastSaved ? (
            <span className="text-success flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Notes Textarea */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here... Key takeaways, questions, insights, etc."
        className="w-full h-48 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none leading-relaxed"
      />

      {/* Tips */}
      <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border">
        <p className="text-xs text-muted">
          <strong className="text-foreground">💡 Tip:</strong> Write down key concepts, timestamps for important moments, 
          and any questions you want to revisit later. Your notes are automatically saved.
        </p>
      </div>
    </div>
  );
}
