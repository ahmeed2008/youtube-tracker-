# FocusTube - YouTube Course Completion Tool

A clean, minimal, and highly focused web application that helps users complete YouTube course playlists in a structured and distraction-free way.

## 🎯 Core Idea

This is **not** a video platform. This is a **learning discipline tool**.

Users can:
- Add a YouTube playlist via URL
- Automatically extract all videos in order
- Watch videos one by one (sequential flow)
- Mark videos as completed
- Track overall progress
- Write personal notes for each video

## 🧩 Core Features

### 1. Playlist Management
- Paste a YouTube playlist URL
- System extracts video titles, order, and thumbnails
- Playlist is saved to user dashboard

### 2. Focus Mode (Most Important Feature)
- Show ONLY the current video
- Hide all distractions (no recommendations, no sidebar)
- Clear "Next Video" button
- Strong focus on completion

### 3. Progress Tracking
- Visual progress bar (e.g., 7/20 videos completed)
- Each video can be marked as completed
- Visual feedback for progress

### 4. Notes System
- Each video has its own note section
- Users can write and edit notes
- Notes are auto-saved and linked to the video

### 5. Dashboard
- List all added playlists
- Show title, progress %, and last watched video

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd youtube-focus
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
youtube-focus/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard page
│   │   └── focus/[playlistId]/
│   │       └── page.tsx          # Focus mode page
│   ├── components/
│   │   ├── Header.tsx            # Navigation header
│   │   ├── PlaylistCard.tsx      # Playlist card component
│   │   ├── ProgressBar.tsx       # Progress indicator
│   │   ├── VideoNotes.tsx        # Notes editor
│   │   └── AddPlaylistForm.tsx   # Add playlist form
│   ├── lib/
│   │   └── store.ts              # Zustand state management
│   ├── styles/
│   │   └── globals.css           # Global styles
│   └── types/
│       └── index.ts              # TypeScript types
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🧠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Icons**: Heroicons (inline SVG)

## 🎨 UI Design Principles

- Minimal and distraction-free design
- Dark mode by default
- Card-based layout
- Smooth transitions
- Inspired by productivity apps, not entertainment platforms

## 🎮 Behavioral Design

Light gamification elements:
- Progress bars with percentage
- Completion satisfaction animations
- Visual feedback for actions
- Streak tracking (planned)

## 📊 Database Schema (for Production)

For production use with a backend database:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlists table
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  youtube_playlist_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  current_video_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  youtube_video_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  thumbnail_url TEXT,
  duration VARCHAR(50),
  video_order INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT DEFAULT '',
  watched_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE user_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  total_playlists INTEGER DEFAULT 0,
  total_videos INTEGER DEFAULT 0,
  completed_videos INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_active_date DATE
);

-- Indexes for performance
CREATE INDEX idx_videos_playlist_id ON videos(playlist_id);
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_videos_completed ON videos(completed);
```

## 🔌 API Integration (Planned)

For production, integrate with YouTube Data API v3:

```typescript
// Example API endpoint structure
GET /api/playlists/:id/videos
POST /api/playlists
DELETE /api/playlists/:id
PUT /api/videos/:id/notes
PUT /api/videos/:id/complete
```

## 🚀 Future Enhancements

1. **YouTube API Integration**: Real playlist fetching
2. **User Authentication**: Sign up/login functionality
3. **Cloud Sync**: Save progress across devices
4. **Streak System**: Daily learning tracking
5. **Export Notes**: Download notes as Markdown/PDF
6. **Keyboard Shortcuts**: Space to complete, N for next
7. **Mobile App**: React Native version
8. **Browser Extension**: Quick add from YouTube

## 📝 License

MIT License - feel free to use this for your learning!

---

Built for learners who want to finish what they start. 🎯
