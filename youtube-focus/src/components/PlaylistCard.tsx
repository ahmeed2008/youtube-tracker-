'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Playlist } from '@/types';

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const completedCount = playlist.videos.filter(v => v.completed).length;
  const totalCount = playlist.videos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentVideo = playlist.videos[playlist.currentVideoIndex];

  return (
    <Link href={`/focus/${playlist.id}`}>
      <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 card-hover">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted/20 overflow-hidden">
          <img
            src={playlist.thumbnail}
            alt={playlist.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360/171717/a3a3a3?text=No+Thumbnail';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Progress overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between text-xs text-white/90 mb-2">
              <span>{completedCount}/{totalCount} videos</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-success rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {playlist.title}
          </h3>
          
          {currentVideo && (
            <div className="flex items-start space-x-2 text-sm text-muted">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              <span className="line-clamp-1">
                Next: {currentVideo.title}
              </span>
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-border">
            <span>
              {new Date(playlist.updatedAt).toLocaleDateString()}
            </span>
            <div className="flex items-center space-x-1">
              {progressPercent === 100 ? (
                <>
                  <svg className="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-success font-medium">Completed</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>In Progress</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
