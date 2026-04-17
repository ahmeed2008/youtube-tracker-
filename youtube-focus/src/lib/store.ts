import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Playlist, Video, UserProgress } from '@/types';

interface AppState {
  playlists: Playlist[];
  currentPlaylistId: string | null;
  userProgress: UserProgress;
  
  // Actions
  addPlaylist: (url: string, title: string, videos: Omit<Video, 'id' | 'completed' | 'notes' | 'watchedAt'>[]) => void;
  removePlaylist: (playlistId: string) => void;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
  
  setCurrentPlaylist: (playlistId: string | null) => void;
  
  markVideoComplete: (playlistId: string, videoId: string) => void;
  updateVideoNotes: (playlistId: string, videoId: string, notes: string) => void;
  setCurrentVideo: (playlistId: string, videoIndex: number) => void;
  
  getPlaylist: (playlistId: string) => Playlist | undefined;
  getCurrentPlaylist: () => Playlist | null;
  getCurrentVideo: () => Video | null;
  getNextVideo: () => Video | null;
  getPreviousVideo: () => Video | null;
}

// Helper to extract YouTube playlist ID from URL
export const extractPlaylistId = (url: string): string | null => {
  const patterns = [
    /(?:playlist\?list=)([a-zA-Z0-9_-]+)/,
    /\/list\/([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

// Helper to extract YouTube video ID from URL
export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

// Mock data generator for demo purposes
const generateMockVideos = (playlistId: string, count: number): Omit<Video, 'id' | 'completed' | 'notes' | 'watchedAt'>[] => {
  return Array.from({ length: count }, (_, i) => ({
    playlistId,
    title: `Lesson ${i + 1}: Introduction to Topic ${i + 1}`,
    videoId: `dQw4w9WgXc${i}`,
    thumbnail: `https://img.youtube.com/vi/dQw4w9WgXc${i}/mqdefault.jpg`,
    order: i,
  }));
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      playlists: [],
      currentPlaylistId: null,
      userProgress: {
        totalPlaylists: 0,
        totalVideos: 0,
        completedVideos: 0,
        streak: 0,
      },

      addPlaylist: (url, title, videosData) => {
        const playlistId = uuidv4();
        const now = new Date();
        
        const videos: Video[] = videosData.map((v, index) => ({
          ...v,
          id: uuidv4(),
          completed: false,
          notes: '',
        }));

        const newPlaylist: Playlist = {
          id: playlistId,
          title,
          url,
          playlistId: extractPlaylistId(url) || playlistId,
          thumbnail: videos[0]?.thumbnail || '',
          videos,
          createdAt: now,
          updatedAt: now,
          currentVideoIndex: 0,
        };

        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
          currentPlaylistId: playlistId,
          userProgress: {
            ...state.userProgress,
            totalPlaylists: state.userProgress.totalPlaylists + 1,
            totalVideos: state.userProgress.totalVideos + videos.length,
          },
        }));
      },

      removePlaylist: (playlistId) => {
        set((state) => {
          const playlist = state.playlists.find(p => p.id === playlistId);
          const videoCount = playlist?.videos.length || 0;
          const completedCount = playlist?.videos.filter(v => v.completed).length || 0;
          
          return {
            playlists: state.playlists.filter(p => p.id !== playlistId),
            currentPlaylistId: state.currentPlaylistId === playlistId ? null : state.currentPlaylistId,
            userProgress: {
              ...state.userProgress,
              totalPlaylists: state.userProgress.totalPlaylists - 1,
              totalVideos: state.userProgress.totalVideos - videoCount,
              completedVideos: Math.max(0, state.userProgress.completedVideos - completedCount),
            },
          };
        });
      },

      updatePlaylist: (playlistId, updates) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        }));
      },

      setCurrentPlaylist: (playlistId) => {
        set({ currentPlaylistId: playlistId });
      },

      markVideoComplete: (playlistId, videoId) => {
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id !== playlistId) return p;
            
            const updatedVideos = p.videos.map((v) =>
              v.id === videoId ? { ...v, completed: true, watchedAt: new Date() } : v
            );
            
            const completedCount = updatedVideos.filter(v => v.completed).length;
            
            return {
              ...p,
              videos: updatedVideos,
              updatedAt: new Date(),
            };
          }),
          userProgress: {
            ...state.userProgress,
            completedVideos: state.userProgress.completedVideos + 1,
          },
        }));
      },

      updateVideoNotes: (playlistId, videoId, notes) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  videos: p.videos.map((v) =>
                    v.id === videoId ? { ...v, notes } : v
                  ),
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      setCurrentVideo: (playlistId, videoIndex) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, currentVideoIndex: videoIndex, updatedAt: new Date() } : p
          ),
        }));
      },

      getPlaylist: (playlistId) => {
        return get().playlists.find((p) => p.id === playlistId);
      },

      getCurrentPlaylist: () => {
        const state = get();
        return state.playlists.find((p) => p.id === state.currentPlaylistId) || null;
      },

      getCurrentVideo: () => {
        const state = get();
        const playlist = state.playlists.find((p) => p.id === state.currentPlaylistId);
        if (!playlist) return null;
        return playlist.videos[playlist.currentVideoIndex] || null;
      },

      getNextVideo: () => {
        const state = get();
        const playlist = state.playlists.find((p) => p.id === state.currentPlaylistId);
        if (!playlist) return null;
        const nextIndex = playlist.currentVideoIndex + 1;
        return playlist.videos[nextIndex] || null;
      },

      getPreviousVideo: () => {
        const state = get();
        const playlist = state.playlists.find((p) => p.id === state.currentPlaylistId);
        if (!playlist) return null;
        const prevIndex = playlist.currentVideoIndex - 1;
        return prevIndex >= 0 ? playlist.videos[prevIndex] : null;
      },
    }),
    {
      name: 'youtube-focus-storage',
    }
  )
);
