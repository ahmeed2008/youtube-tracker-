// Types for the YouTube Focus application

export interface Video {
  id: string;
  playlistId: string;
  title: string;
  videoId: string; // YouTube video ID
  thumbnail: string;
  duration?: string;
  order: number;
  completed: boolean;
  notes: string;
  watchedAt?: Date;
}

export interface Playlist {
  id: string;
  title: string;
  url: string;
  playlistId: string; // YouTube playlist ID
  thumbnail: string;
  videos: Video[];
  createdAt: Date;
  updatedAt: Date;
  currentVideoIndex: number;
}

export interface UserProgress {
  totalPlaylists: number;
  totalVideos: number;
  completedVideos: number;
  streak: number;
  lastActiveDate?: Date;
}

export type PageRoute = '/' | '/dashboard' | '/focus/[playlistId]';
