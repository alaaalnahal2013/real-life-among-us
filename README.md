# 🌐 Real-Time Multiplayer & Database Foundation

A clean, modern, multi-device multiplayer room and database foundation ready for building your new web application or game.

Built with **Supabase Real-Time**, **Postgres Database**, and **Supabase Auth / Profiles**.

---

## 🚀 Features Included

### 1. 🔄 Real-Time Multi-Device Room Engine
- **Host a Room**: Generate custom room codes (`ROOM-XXXX`), set max players, and manage room settings.
- **Join by Code / URL**: Share room links directly with friends using URL hash parameters (`#room=ROOM-XXXX`).
- **Waiting Lobby**: Real-time synced player list with connection status, radar pulse animation, and ready checks.
- **Live Session Sync**: Bi-directional real-time state synchronization across all connected phones, tablets, and PCs using Supabase `postgres_changes`.
- **Live Room Chat**: Built-in real-time chat and activity feed for all room members.
- **Room Lifecycle**: Start session, reset session, or disband room across all connected clients simultaneously.

### 2. 🗄️ Database & Authentication (Supabase)
- **Supabase Client**: Configured in `supabase-config.js` with real-time websocket support.
- **User Authentication**: Email/Password Sign Up, Log In, and Log Out.
- **User Profiles**: Synced with the Supabase `profiles` table (`username`, `avatar_url`, `updated_at`).
- **Avatar Storage**: Upload custom profile avatars directly to the Supabase `avatars` storage bucket.
- **Guest Mode**: Play immediately as a guest without creating an account (with local session persistence).
- **Game Rooms Storage**: Persistent state stored and queried from the `game_rooms` table.

---

## 🛠️ How to Extend for Your New Project

1. **Add Custom Game/App Logic**:
   - `MultiplayerManager.state.sharedData` is available for custom room-wide state.
   - Use `MultiplayerManager.broadcastStateUpdate()` to sync any custom data to all connected devices in milliseconds.
2. **Handle Events**:
   - Listen to `handleRemoteSync(data)` in `app.js` to trigger custom animations, turns, game boards, or interactions.
3. **Customize the UI**:
   - Modify `index.html`'s `#mainProjectArea` to render your game canvas, board, quiz, or dashboard.
   - Customize theme variables in `style.css`.

---

## 🌐 Deploy to Web (100% Free)

### Netlify Drop
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop this project folder.
3. Your multiplayer app is live instantly!

### Vercel
1. Run `vercel` or link your GitHub repo on [Vercel](https://vercel.com/).
2. Deploys instantly with `vercel.json` routing.

### GitHub Pages
1. Push this repository to GitHub.
2. Under **Settings -> Pages**, set source to `main` branch.
