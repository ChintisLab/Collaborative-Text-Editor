# Collaborative Text Editor (CollabDocs)

A production-ready, real-time collaborative text editor built with Next.js, TipTap, and Yjs. Features include multi-cursor presence, offline support, autosave, and role-based document sharing with a modern, beautiful UI.

## ✨ Features

- **✅ Real-time Collaboration**: Multiple users can edit documents simultaneously with conflict-free merges using Yjs CRDT
- **✅ Document Sharing**: Share via link or invite by email with granular permissions (Owner/Editor/Viewer)
- **✅ Multi-cursor Presence**: See active collaborators and their cursor positions in real-time
- **✅ Offline Support**: Continue editing when offline with IndexedDB persistence - syncs automatically when reconnected
- **✅ Autosave**: Changes are automatically saved to database every 2 seconds
- **✅ Role-based Permissions**: Full control over who can view, edit, or manage your documents
- **✅ Rich Text Editing**: Full formatting toolbar (bold, italic, headings, lists, quotes, code blocks)
- **✅ Beautiful Modern UI**: Gradient designs, smooth animations, and intuitive interface
- **✅ Secure Authentication**: User authentication with NextAuth.js and bcrypt password hashing

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Editor**: TipTap v2 (ProseMirror wrapper) with collaboration extensions
- **Real-time**: Yjs CRDT + y-websocket v2 protocol
- **Styling**: Tailwind CSS v3 with custom design system
- **Database**: SQLite with Prisma ORM (production: PostgreSQL)
- **Authentication**: NextAuth.js with JWT sessions
- **WebSocket Server**: Custom Node.js + ws + y-websocket

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd "Collaborative Text Editor"
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development servers:
```bash
npm run dev:all
```

This will start:
- Next.js dev server on `http://localhost:3000`
- WebSocket server on `ws://localhost:1234`

Alternatively, run them separately:
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run server
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating an Account

1. Navigate to [http://localhost:3000/register](http://localhost:3000/register)
2. Enter your name, email, and password
3. Click "Sign Up"

### Creating a Document

1. Log in to your account
2. Click "Create New Document" on the dashboard
3. Enter a document title
4. Start editing!

### Sharing Documents

1. Open a document you own
2. Click the **"Share"** button in the top-right corner
3. Choose your sharing method:
   - **Copy Link**: Anyone with the link can view (read-only access)
   - **Invite by Email**: Send invite with specific permissions:
     - **Editor**: Can edit and collaborate in real-time
     - **Viewer**: Can only view (read-only)
4. Recipients must have an account to access shared documents

### Real-time Collaboration

1. Share a document with another user
2. Both users open the document
3. Edit simultaneously - see changes appear instantly
4. See active collaborators in the bottom-right corner
5. Changes auto-save every 2 seconds

### Keyboard Shortcuts

- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- Format using toolbar buttons for headings, lists, quotes, and code

## Project Structure

```
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── dashboard/        # Dashboard page
│   ├── document/[id]/    # Editor page
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── providers.tsx     # Client providers
├── components/
│   ├── editor/           # Editor components
│   ├── ui/               # UI components
│   └── shared/           # Shared components
├── lib/
│   ├── db/               # Database client
│   ├── auth/             # Auth configuration
│   ├── yjs/              # Yjs utilities
│   └── utils/            # Utility functions
├── server/
│   └── websocket-server.js  # WebSocket server
├── prisma/
│   └── schema.prisma     # Database schema
└── types/                # TypeScript types
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth.js handler (sign in/out)

### Documents
- `GET /api/documents` - Get all user documents with permissions
- `POST /api/documents` - Create new document
- `GET /api/documents/[id]` - Get document by ID with access control
- `PATCH /api/documents/[id]` - Update document (title/content)
- `DELETE /api/documents/[id]` - Delete document (owner only)
- `POST /api/documents/[id]/share` - Share document with user by email

## Database Schema

### User
- id, name, email, password, image, timestamps

### Document
- id, title, content, ownerId, timestamps

### DocumentPermission
- id, documentId, userId, role (owner/editor/viewer)

## Deployment

### Prerequisites
- PostgreSQL database (replace SQLite in production)
- WebSocket server hosting
- Next.js hosting (Vercel, AWS, etc.)

### Steps

1. Update database provider in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set production environment variables:
```bash
DATABASE_URL="your-postgres-connection-string"
NEXTAUTH_SECRET="your-secure-random-secret"
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_WS_URL="wss://your-websocket-server.com"
```

3. Deploy WebSocket server separately (AWS EC2, DigitalOcean, etc.)

4. Deploy Next.js app to Vercel:
```bash
npm run build
vercel --prod
```

## Performance Optimizations

- **CRDT**: Conflict-free replicated data type for efficient collaboration
- **Debounced Autosave**: Saves every 2 seconds to reduce server load
- **IndexedDB**: Local persistence for instant loading and offline support
- **Lazy Loading**: Components and routes are code-split automatically

## Security Features

- Password hashing with bcrypt
- JWT-based session management
- Role-based access control
- CSRF protection with NextAuth
- SQL injection prevention with Prisma

## 📊 Data Storage & Security

### Current Setup (Development)

**Database**: SQLite file at `prisma/dev.db`
- Stores users, documents, and permissions
- Access with: `npx prisma studio`
- **⚠️ Important**: This is a local file - not shared across deployments

**WebSocket Server**: In-memory state
- Keeps Yjs CRDT state for 1 hour after last user disconnects
- Lost on server restart (documents reload from database)

**Browser**: IndexedDB cache
- Local copy for offline editing
- Auto-syncs when reconnected

### Security Notes

✅ **Protected**:
- Passwords hashed with bcrypt
- JWT session tokens
- Role-based access control
- `.gitignore` prevents committing database

⚠️ **Development Limitations**:
- SQLite database is a file (can be copied)
- No encryption at rest
- WebSocket has basic authentication
- For production, use PostgreSQL + proper auth

## Troubleshooting

### Real-time Updates Not Working
- Refresh both browser windows to reconnect WebSocket
- Check WebSocket server is running: `npm run server`
- Check browser console for connection errors
- Verify `NEXT_PUBLIC_WS_URL=ws://localhost:1234` in `.env`

### Shared Users Can't See Content
- Ensure you've saved the document (wait for "Saved" indicator)
- Refresh the shared user's browser
- Check they have proper permissions in database: `npx prisma studio`

### WebSocket Connection Failed
- Ensure the WebSocket server is running on port 1234
- Kill existing process: `lsof -ti:1234 | xargs kill -9`
- Restart: `npm run server`
- Check firewall settings

### Database Errors
- Regenerate Prisma client: `npx prisma generate`
- Sync schema: `npx prisma db push`
- View data: `npx prisma studio`

### Build Errors
- Clear build cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install --legacy-peer-deps`
- Check Node.js version (requires 18+)

## License

Rachana Anugandula

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions, please open a GitHub issue.