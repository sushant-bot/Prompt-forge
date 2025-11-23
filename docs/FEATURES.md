# PromptForge Features Overview

## Core Features (Always Available)

### 🎨 Prompt Generation
- **Dual Mode System**: Switch between General and Coding modes
- **Live Preview**: See your prompt update in real-time
- **Smart Templates**: Access built-in templates for common use cases
- **Custom Templates**: Create and save your own templates
- **Dark/Light Mode**: Toggle between themes
- **Copy to Clipboard**: One-click copy with visual feedback

### 📚 Built-in Template Library
- **Study Templates**: Research papers, essay writing, exam prep
- **Viva/Interview Templates**: Thesis defense, technical interviews
- **Coding Templates**: Bug fixing, code review, refactoring
- **Writing Templates**: Blog posts, technical docs, creative writing

## Cloud Sync Features (Optional - Requires Supabase)

### 🔐 Authentication
- **Email/Password**: Simple sign up and sign in
- **OAuth**: Sign in with Google or GitHub
- **Secure**: Protected with Row Level Security (RLS)
- **Session Management**: Stay signed in across sessions

### ☁️ Cloud Storage
- **Template Sync**: Save templates to cloud, access from any device
- **History Tracking**: Keep track of all generated prompts
- **Cross-Device**: Access your data anywhere
- **Automatic Sync**: Data syncs seamlessly when connected

### 📊 Real-time Status
- **Sync Indicator**: Visual feedback of sync status
  - 🟢 "Synced" - Data is up to date
  - 🔵 "Syncing..." - Currently uploading changes
  - ⚪ "Offline" - Using local storage
- **User Profile**: See who's logged in
- **Quick Logout**: Sign out with one click

## How It Works

### Without Supabase (Default)
```
User creates template → Saved to localStorage → Available on this device only
```

### With Supabase (Optional)
```
User signs in → Local templates sync to cloud → Available on all devices
User creates template → Saved to Supabase + localStorage → Synced everywhere
```

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 19 with shadcn/ui components
- **Styling**: Tailwind CSS 4 with glassmorphism
- **Animations**: Framer Motion
- **State**: React Context for auth

### Backend (Optional)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email + OAuth)
- **Storage**: Supabase tables with RLS
- **API**: Supabase Client SDK

### Data Flow
```
┌─────────────┐
│   Browser   │
│ (React App) │
└──────┬──────┘
       │
       ├── No Auth ──→ localStorage
       │
       └── With Auth ─→ Supabase ──→ PostgreSQL
                         (+ localStorage cache)
```

## Security

### Row Level Security (RLS)
Every Supabase query is protected:
- Users can only read their own data
- Users can only write to their own data
- No way to access other users' data
- Enforced at database level

### Environment Variables
- Credentials never in source code
- `.env.local` file (gitignored)
- Safe to expose anon key (RLS protects data)

## Benefits

### For Users
- ✅ Works immediately without setup
- ✅ Optional cloud sync when needed
- ✅ No vendor lock-in
- ✅ Data always accessible (localStorage fallback)
- ✅ Free to use (Supabase free tier available)

### For Developers
- ✅ Clean separation of concerns
- ✅ Type-safe throughout
- ✅ Easy to extend
- ✅ Well-documented
- ✅ No breaking changes

## Future Enhancements

Possible additions:
- 📱 Export/import templates
- 🔍 Search through history
- 📈 Usage analytics
- 🤝 Share templates with others
- 🎯 Favorites/starred templates
- 🏷️ Custom categories
- 🔄 Sync conflicts resolution

## Performance

- **Build Size**: ~239 KB (First Load JS)
- **Load Time**: < 2s on fast connection
- **Offline**: Works fully offline with localStorage
- **Sync**: Real-time updates when online

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ⚠️ Requires JavaScript enabled
- ⚠️ Requires localStorage support

## Getting Started

### Basic Usage (No Setup Required)
1. Open the app
2. Start creating prompts
3. Templates saved locally

### With Cloud Sync (Optional)
1. Follow `SUPABASE_SETUP.md`
2. Create Supabase project
3. Run SQL schema
4. Add credentials
5. Sign up in app
6. Data syncs automatically!

## Support

- 📖 Documentation: See `docs/` folder
- 🐛 Issues: GitHub Issues
- 💬 Questions: GitHub Discussions
- 📧 Contact: Repository owner

---

**Note**: Cloud sync is completely optional. PromptForge works perfectly without any backend setup using localStorage.
