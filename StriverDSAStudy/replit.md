# Overview

DSA Master is a comprehensive Data Structures and Algorithms learning platform built for tracking progress through Striver's complete A2Z DSA Course. The application provides an interactive dashboard where users can track their problem-solving progress across all 18 steps (455+ problems), maintain daily study streaks, plan customized study schedules, and navigate through structured DSA topics with problems from multiple platforms including LeetCode, GeeksforGeeks, and TakeUForward.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React SPA**: Built with React 18 using TypeScript for type safety
- **Styling**: Tailwind CSS with a custom dark theme and shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state management and local state with React hooks
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Server Framework**: Express.js with TypeScript running in ESM mode
- **API Design**: RESTful endpoints for progress tracking and streak management
- **Storage Layer**: Abstract storage interface with in-memory implementation (MemStorage)
- **Development Setup**: Vite middleware integration for seamless full-stack development

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM configured for type-safe database operations
- **Schema**: User authentication, progress tracking, and daily streak tables
- **Local Storage**: Browser localStorage for client-side progress persistence
- **Migration System**: Drizzle Kit for database schema migrations

## Core Features
- **Complete A2Z Course**: All 18 steps from Striver's A2Z DSA course with 455+ problems
- **Progress Tracking**: Mark problems as complete/incomplete with timestamps and streak tracking
- **Study Calendar**: Visual calendar showing daily activity, streaks, and planned study sessions
- **Study Planner**: Customizable daily study planning with topic selection and goal setting
- **Multi-Platform Links**: Direct links to problems on LeetCode, GeeksforGeeks, TakeUForward, and YouTube
- **Problem Categorization**: Easy, Medium, Hard difficulty levels with color-coded badges
- **Hierarchical Navigation**: Individual dropdowns for each step and lecture/subtopic
- **Search & Filter**: Problem search functionality with difficulty filtering
- **Random Problem Picker**: Algorithm to select random uncompleted problems
- **Export Functionality**: JSON export of progress data and study plans

## UI/UX Design Patterns
- **Component System**: Radix UI primitives with custom styling via class-variance-authority
- **Responsive Design**: Mobile-first approach with adaptive sidebar and layouts
- **Dark Theme**: Consistent dark mode design with CSS custom properties matching TakeUForward branding
- **Interactive Elements**: Hover states, animations, smooth transitions, and non-closing dropdowns
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support, and dialog descriptions
- **Study Planning UI**: Calendar-based interface with date selection and plan customization
- **Multi-Platform Integration**: External link buttons with platform-specific styling and icons

# External Dependencies

## UI Libraries
- **Radix UI**: Comprehensive set of accessible component primitives
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## Backend Services
- **Neon Database**: Serverless PostgreSQL database provider
- **Drizzle ORM**: Type-safe database toolkit with schema validation

## Development Tools
- **Replit Integration**: Vite plugins for Replit-specific development features
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds

## Data Management
- **React Query**: Server state synchronization and caching
- **Zod**: Runtime type validation and schema parsing
- **React Hook Form**: Form state management with validation

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx/twMerge**: Conditional CSS class management
- **nanoid**: Unique ID generation for client-side operations