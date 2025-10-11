# Quick Start Guide - CollabDocs

## 🚀 Starting the Application

### Prerequisites
- Node.js 18+ installed
- Dependencies installed: `npm install --legacy-peer-deps`
- Database initialized: `npx prisma generate && npx prisma db push`

### 1. Start Both Servers (Recommended)

```bash
npm run dev:all
```

This will start:
- ✅ Next.js dev server on `http://localhost:3000`
- ✅ WebSocket server on `ws://localhost:1234`

### 2. Or Start Them Separately

**Terminal 1** - Next.js:
```bash
npm run dev
```

**Terminal 2** - WebSocket Server:
```bash
npm run server
```

**Verify Both Are Running:**
- Next.js: Visit [http://localhost:3000](http://localhost:3000)
- WebSocket: Should see "✓ WebSocket server running on ws://localhost:1234" in terminal

## 📝 First Time Setup

1. **Open** [http://localhost:3000](http://localhost:3000)
2. **Click** "Sign up" to create an account
3. **Enter** your name, email, and password (min 6 characters)
4. **Sign in** with your credentials
5. **Create** your first document by clicking "Create New Document"
6. **Start typing!** Your content auto-saves every 2 seconds

## 👥 Testing Real-Time Collaboration

### Method 1: Two Browser Windows

1. **Window 1** (Your account):
   - Create a document and type some content
   - Wait for "Saved" indicator
   - Click **"Share"** button (top-right)
   - Click **"Copy"** to copy the link

2. **Window 2** (Incognito/Private mode):
   - Register a new account with different email
   - Paste the copied link in the browser
   - ✅ You should see the document content!

3. **Test Real-time**:
   - Type in Window 1 → See it appear instantly in Window 2
   - Type in Window 2 → See it appear instantly in Window 1
   - See active users indicator in bottom-right

### Method 2: Email Invitation

1. **Window 1**:
   - Open a document
   - Click **"Share"** button
   - Enter friend's email address
   - Choose permission: **Editor** or **Viewer**
   - Click **"Send Invite"**

2. **Window 2** (Friend's account):
   - Register with the invited email
   - See shared document in dashboard
   - Open and collaborate!

## ✨ Features to Try

### Rich Text Formatting
- **Bold**: Click B button or `Ctrl/Cmd + B`
- **Italic**: Click I button or `Ctrl/Cmd + I`
- **Headings**: Click H1, H2, or H3 buttons
- **Lists**: Bullet points or numbered lists
- **Quotes**: Block quotes for emphasis
- **Code**: Inline code formatting

### Document Sharing
- **Copy Link**: Share view-only access with anyone
- **Invite by Email**: Grant Editor or Viewer permissions
- **Role Management**: Owner can control who accesses documents

### Collaboration Features
- **Real-time Editing**: See changes as they happen
- **Active Users**: See who's editing in bottom-right
- **Auto-save**: Every 2 seconds to database
- **Offline Mode**: Edit without internet, syncs when reconnected
- **Conflict-free**: Yjs CRDT automatically merges edits

### Document Management
- **Create**: New documents from dashboard
- **Rename**: Click pencil icon next to title
- **Delete**: Click trash icon (owner only)
- **Dashboard**: See all your documents with last edited time

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- Use toolbar buttons for other formatting

## 🔧 Troubleshooting

### Real-time Updates Not Working
**Symptoms**: Changes don't appear in other windows
**Solution**:
1. Refresh both browser windows (reconnects WebSocket)
2. Check WebSocket server is running: `npm run server`
3. Check browser console for errors (F12 → Console tab)
4. Verify `.env` has `NEXT_PUBLIC_WS_URL=ws://localhost:1234`

### Shared User Can't See Document Content
**Symptoms**: Document appears empty for shared user
**Solution**:
1. Ensure original document has content and shows "Saved" indicator
2. Refresh the shared user's browser window
3. Check permissions in database: `npx prisma studio` → DocumentPermission table
4. Verify user is logged in with correct email

### WebSocket Connection Issues
**Symptoms**: "Active: 0" or no real-time updates
**Solution**:
1. Check WebSocket server is running on port 1234
2. Kill any stuck processes: `lsof -ti:1234 | xargs kill -9`
3. Restart server: `npm run server`
4. Check `.env` file has correct `NEXT_PUBLIC_WS_URL`

### Database Issues
**Symptoms**: Errors about missing tables or schema
**Solution**:
```bash
npx prisma generate     # Regenerate Prisma client
npx prisma db push      # Sync database schema
npx prisma studio       # View/edit data in GUI
```

### Build/Dependency Issues
**Symptoms**: Build errors or missing modules
**Solution**:
```bash
rm -rf .next                                    # Clear Next.js cache
rm -rf node_modules                             # Remove dependencies
npm install --legacy-peer-deps                  # Reinstall
```

## Architecture

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Editor**: TipTap v2 (ProseMirror wrapper)
- **Real-time**: Yjs CRDT + y-websocket
- **Styling**: Tailwind CSS v3
- **Database**: SQLite + Prisma
- **Auth**: NextAuth.js

## Next Steps

- Explore the [README.md](README.md) for detailed documentation
- Check out the codebase structure
- Deploy to production (see deployment guide in README.md)