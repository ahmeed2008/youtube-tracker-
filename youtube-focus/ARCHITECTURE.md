# FocusTube - Architecture & Design Document

## 📋 Overview

FocusTube is a distraction-free learning tool designed to help users complete YouTube course playlists systematically. This document outlines the complete architecture, user flows, and design decisions.

---

## 🎯 Product Vision

**Problem**: YouTube is designed for discovery and endless watching, not focused learning. Users start courses but rarely finish them due to:
- Endless recommendations and distractions
- No progress tracking
- No accountability mechanism
- Passive consumption without active engagement

**Solution**: A minimal, focused interface that transforms passive watching into active learning with:
- Sequential video flow (one at a time)
- Visual progress tracking
- Built-in note-taking
- Completion-focused UX

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │ Components  │  │   State (Zustand)   │  │
│  │  - Home     │  │ - Header    │  │  - Playlists        │  │
│  │  - Dashboard│  │ - Cards     │  │  - Videos           │  │
│  │  - Focus    │  │ - Forms     │  │  - Progress         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Local Storage (Persistence)                │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Future: API Integration)
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  REST API   │  │   Auth      │  │   YouTube Data API  │  │
│  │  (Next.js)  │  │  (Optional) │  │   (Playlist Fetch)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database (PostgreSQL)                    │
├─────────────────────────────────────────────────────────────┤
│  - users                                                    │
│  - playlists                                                │
│  - videos                                                   │
│  - user_progress                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Models

### MVP (Client-Side with localStorage)

```typescript
interface Video {
  id: string;              // UUID
  playlistId: string;       // Parent playlist ID
  title: string;            // Video title
  videoId: string;          // YouTube video ID
  thumbnail: string;        // Thumbnail URL
  duration?: string;        // Video duration
  order: number;            // Position in playlist
  completed: boolean;       // Completion status
  notes: string;            // User notes
  watchedAt?: Date;         // Completion timestamp
}

interface Playlist {
  id: string;               // UUID
  title: string;            // Playlist title
  url: string;              // Original YouTube URL
  playlistId: string;       // YouTube playlist ID
  thumbnail: string;        // Cover image
  videos: Video[];          // Array of videos
  createdAt: Date;          // Creation timestamp
  updatedAt: Date;          // Last update timestamp
  currentVideoIndex: number; // Current position
}

interface UserProgress {
  totalPlaylists: number;
  totalVideos: number;
  completedVideos: number;
  streak: number;
  lastActiveDate?: Date;
}
```

### Production (Database Schema)

See README.md for complete SQL schema.

---

## 🔄 User Flows

### Flow 1: Add New Playlist

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌───────────┐
│  User    │────▶│  Dashboard  │────▶│  Add Form    │────▶│  Submit   │
└──────────┘     └─────────────┘     └──────────────┘     └───────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Validate URL │
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Extract ID   │
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Fetch Videos │ (Mock/API)
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Save to Store│
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Redirect to  │
                                    │ Dashboard    │
                                    └──────────────┘
```

### Flow 2: Watch Video (Focus Mode)

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌───────────┐
│  User    │────▶│  Click      │────▶│  Focus Mode  │────▶│  Video    │
│          │     │  Playlist   │     │  Page Loads  │     │  Plays    │
└──────────┘     └─────────────┘     └──────────────┘     └───────────┘
                                                               │
                          ┌────────────────────────────────────┘
                          ▼
                   ┌──────────────┐
                   │ Mark Complete│
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Show Success │
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Auto-advance │ (if not last)
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Next Video   │
                   └──────────────┘
```

### Flow 3: Take Notes

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌───────────┐
│  User    │────▶│  Focus Mode │────▶│  Type Notes  │────▶│  Auto-save│
│          │     │  Scroll Down│     │  in Textarea │     │  (1s deb) │
└──────────┘     └─────────────┘     └──────────────┘     └───────────┘
                                                               │
                          ┌────────────────────────────────────┘
                          ▼
                   ┌──────────────┐
                   │ Update State │
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Persist to   │
                   │ localStorage │
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Show Saved   │
                   │ Indicator    │
                   └──────────────┘
```

---

## 🎨 Component Hierarchy

```
App
├── Header
│   ├── Logo
│   └── Navigation
│
├── Pages
│   ├── HomePage
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   ├── How It Works
│   │   └── Footer
│   │
│   ├── DashboardPage
│   │   ├── Stats Overview
│   │   ├── Overall Progress
│   │   ├── Add Playlist Form
│   │   └── Playlist Grid
│   │       └── PlaylistCard (multiple)
│   │
│   └── FocusModePage
│       ├── Progress Bar
│       ├── Video Player Section
│       │   ├── YouTube Embed
│       │   ├── Video Info
│       │   ├── Action Buttons
│       │   └── Next Video Preview
│       └── VideoNotes
│
└── Shared Components
    ├── ProgressBar
    └── AddPlaylistForm
```

---

## 🔧 State Management (Zustand)

### Store Structure

```typescript
interface AppState {
  // Data
  playlists: Playlist[];
  currentPlaylistId: string | null;
  userProgress: UserProgress;
  
  // Actions - Playlist Management
  addPlaylist: (url, title, videos) => void;
  removePlaylist: (playlistId) => void;
  updatePlaylist: (playlistId, updates) => void;
  
  // Actions - Navigation
  setCurrentPlaylist: (playlistId) => void;
  
  // Actions - Video Management
  markVideoComplete: (playlistId, videoId) => void;
  updateVideoNotes: (playlistId, videoId, notes) => void;
  setCurrentVideo: (playlistId, videoIndex) => void;
  
  // Selectors
  getPlaylist: (playlistId) => Playlist | undefined;
  getCurrentPlaylist: () => Playlist | null;
  getCurrentVideo: () => Video | null;
  getNextVideo: () => Video | null;
  getPreviousVideo: () => Video | null;
}
```

### Persistence Strategy

- Uses `zustand/middleware` with `persist`
- Stores data in `localStorage` under key `youtube-focus-storage`
- Automatically serializes/deserializes dates
- Survives page refreshes

---

## 🎯 Key UX Decisions

### 1. Distraction-Free Focus Mode

**Decision**: Hide all YouTube UI elements
- Use embedded player with `?rel=0&modestbranding=1`
- No related videos sidebar
- No comments section
- No recommended videos

**Rationale**: Every additional element is a potential distraction that could pull the user away from learning.

### 2. Sequential Flow

**Decision**: One video at a time, in order
- Show only current video prominently
- "Next" button clearly visible
- Previous button available but de-emphasized
- No jumping ahead (discouraged but allowed via playlist)

**Rationale**: Decision fatigue kills progress. Remove choices, build momentum.

### 3. Auto-Advance on Complete

**Decision**: After marking complete, auto-advance after 800ms
- Gives user satisfaction moment
- Reduces friction to continue
- Can still manually navigate

**Rationale**: Reduce friction points that might cause drop-off.

### 4. Auto-Save Notes

**Decision**: Debounced auto-save (1 second)
- No manual save button needed
- Visual feedback when saved
- Never lose work

**Rationale**: Frictionless note-taking encourages active learning.

### 5. Visual Progress

**Decision**: Multiple progress indicators
- Per-playlist progress bar
- Overall dashboard progress
- Completion percentage everywhere
- Celebratory animation at 100%

**Rationale**: Visible progress triggers dopamine, encourages continuation.

---

## 🚀 Scalability Considerations

### Current (MVP)

- ✅ Client-side state with localStorage
- ✅ No backend required
- ✅ Instant deployment (Vercel, Netlify)
- ⚠️ Data tied to single device/browser
- ⚠️ Mock video data (not real YouTube API)

### Phase 2 (Backend Integration)

- [ ] YouTube Data API integration
- [ ] Real playlist fetching
- [ ] Server-side rendering for SEO
- [ ] API routes for data operations

### Phase 3 (Multi-User)

- [ ] User authentication (NextAuth.js)
- [ ] PostgreSQL database (Supabase/Neon)
- [ ] Cloud sync across devices
- [ ] Shareable playlists

### Phase 4 (Advanced Features)

- [ ] Streak tracking with notifications
- [ ] Export notes (Markdown, PDF)
- [ ] Keyboard shortcuts
- [ ] Mobile app (React Native)
- [ ] Browser extension

---

## 🎨 Design Tokens

### Colors

```css
--background: #0a0a0a;      /* Main background */
--foreground: #fafafa;       /* Main text */
--card: #171717;            /* Card backgrounds */
--card-hover: #262626;      /* Card hover state */
--primary: #3b82f6;         /* Primary actions */
--primary-hover: #2563eb;   /* Primary hover */
--success: #22c55e;         /* Success states */
--muted: #a3a3a3;           /* Secondary text */
--border: #262626;          /* Borders */
```

### Typography

- Font: Inter (system font stack fallback)
- Headings: Bold, tight tracking
- Body: Regular weight, relaxed leading
- Code: Monospace

### Spacing

- Base unit: 4px
- Common: 4, 8, 12, 16, 24, 32, 48, 64
- Container max-width: 1200px

### Animations

- Duration: 200ms (fast), 300ms (normal), 500ms (slow)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Scale interactions: 1.02 (hover), 0.98 (active)

---

## 📈 Success Metrics

### Engagement

- Playlists added per user
- Videos completed per session
- Return rate (daily/weekly)
- Average session duration

### Completion

- Playlist completion rate
- Drop-off points
- Time to first completion

### Learning

- Notes written per video
- Note length average
- Return to notes frequency

---

## 🔒 Security Considerations

### Current (MVP)

- No sensitive data stored
- localStorage only (client-side)
- No authentication
- YouTube embed (Google's security)

### Future

- HTTPS only
- Secure authentication (OAuth, JWT)
- Input sanitization
- Rate limiting on API
- CORS configuration
- Database encryption at rest

---

## 📝 Development Guidelines

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Functional components with hooks
- Named exports for components
- Descriptive variable names

### Testing Strategy (Future)

- Unit tests: Jest + React Testing Library
- E2E tests: Playwright
- Coverage target: 80%

### Git Workflow

- Main branch: `main`
- Feature branches: `feature/description`
- PR reviews required
- Conventional commits

---

## 🎯 Conclusion

FocusTube is designed as a **minimal but powerful** tool that addresses a specific problem: helping people finish YouTube courses they start. 

The MVP focuses on:
1. **Core functionality** over features
2. **User experience** over technical complexity
3. **Behavioral design** over gamification
4. **Local-first** over cloud dependency

This foundation allows for iterative development based on real user feedback while maintaining the core value proposition: **distraction-free learning**.
