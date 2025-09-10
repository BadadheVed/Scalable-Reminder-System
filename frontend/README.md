# Smart Study Reminder App

A modern, responsive Next.js frontend for managing study sessions with email reminders and intelligent scheduling.

## Features

### 🎯 Core Functionality
- **JWT Cookie Authentication** - Secure login/signup with HTTP-only cookies
- **Study Block Management** - Create, edit, and delete study sessions
- **Smart Scheduling** - Prevent conflicts and ensure advance notice
- **Email Reminders** - Automatic notifications 10 minutes before sessions
- **Real-time Status** - Live updates for active, upcoming, and completed sessions

### 🎨 Modern UI/UX
- **Mobile-First Design** - Responsive across all devices
- **Clean Interface** - Focus-friendly design with calming colors
- **Smooth Animations** - Micro-interactions and transitions
- **Loading States** - Skeleton screens and loading indicators
- **Toast Notifications** - User-friendly feedback system

### 🔧 Technical Stack
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **React Hook Form + Zod** validation
- **Date-fns** for date manipulation
- **Lucide React** icons

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Your Express.js backend running on port 3001

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Environment setup:**
Create a `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. **Start development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
npm start
```

## Backend Integration

The app expects your Express.js backend to provide these endpoints:

### Authentication Routes
```typescript
POST /api/auth/login
POST /api/auth/register  
POST /api/auth/logout
GET /api/user/profile
```

### Study Block Routes
```typescript
GET /api/study-blocks
POST /api/study-blocks
PUT /api/study-blocks/:id
DELETE /api/study-blocks/:id
```

### Authentication Flow
- Uses HTTP-only cookies for JWT tokens
- Automatic token refresh handling
- Secure logout with cookie clearing
- Protected route middleware

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── dashboard/         # Main dashboard
│   └── layout.tsx
├── components/            # Reusable components
│   ├── dashboard/         # Dashboard-specific components
│   ├── forms/             # Form components
│   └── ui/                # Shadcn/ui components
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state
├── hooks/                 # Custom React hooks
│   └── useStudyBlocks.ts  # Study block management
├── lib/                   # Utilities
│   ├── api.ts            # API client with cookie auth
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript definitions
    └── index.ts
```

## Key Components

### Authentication System
- **AuthContext**: Manages user state and authentication
- **Login/Signup Pages**: Forms with validation and error handling
- **Protected Routes**: Middleware for route protection

### Dashboard Features
- **TodaySchedule**: Today's study sessions with real-time status
- **UpcomingBlocks**: Next 7 days of scheduled sessions
- **StudyStats**: Overview cards with session statistics
- **StudyBlockForm**: Create/edit sessions with validation

### Form Validation
```typescript
const studyBlockSchema = z.object({
  title: z.string().min(1).max(100),
  startTime: z.string().min(1),
  duration: z.number().min(15).max(480),
  description: z.string().max(500).optional(),
});
```

## API Client

The API client handles cookie-based authentication automatically:

```typescript
// Automatically includes cookies for authentication
const response = await api.get('/study-blocks');
const newBlock = await api.post('/study-blocks', data);
```

## Security Features

- **Input Validation**: Zod schemas for all forms
- **XSS Protection**: Sanitized data display
- **CSRF Protection**: SameSite cookie settings
- **Route Protection**: Middleware for protected pages
- **Error Boundaries**: Graceful error handling

## Performance Optimizations

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js built-in optimization
- **Bundle Analysis**: `npm run build` shows bundle sizes
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

**Study Reminder** - Making study sessions smarter, one block at a time! 📚✨