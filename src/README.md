# Source Code

This folder contains all the source code for Cognita AI, organized into logical modules and components.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui component library
│   ├── Header.tsx      # Navigation header component
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   └── StudySession.tsx # Study session component
├── pages/              # Application pages/routes
│   ├── Landing.tsx     # Public landing page
│   ├── Home.tsx        # Authenticated home page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Auth.tsx        # Authentication page
│   ├── Upload.tsx      # PDF upload page
│   ├── Quiz.tsx        # Quiz interface
│   ├── StudySession.tsx # Study session page
│   └── NotFound.tsx    # 404 error page
├── hooks/              # Custom React hooks
│   ├── useUserStats.ts # User statistics hook
│   └── use-mobile.tsx  # Mobile detection hook
├── integrations/       # External service integrations
│   └── supabase/       # Supabase configuration
│       ├── client.ts   # Supabase client setup
│       └── types.ts    # TypeScript type definitions
├── lib/                # Utility libraries
│   └── utils.ts        # Common utility functions
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
├── App.css             # Global application styles
├── index.css           # Global CSS and Tailwind imports
└── main.tsx            # Application entry point
```

## Architecture Overview

### Frontend Framework
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Fast build tool and development server

### UI Framework
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn/ui**: Reusable component library built on Radix UI
- **Framer Motion**: Animation library for smooth interactions

### State Management
- **React Hooks**: useState, useEffect, useContext for state management
- **Custom Hooks**: Reusable stateful logic (useUserStats, use-mobile)
- **Context API**: Global state management where needed

### Routing
- **React Router DOM**: Client-side routing and navigation
- **Protected Routes**: Authentication-based route protection
- **Lazy Loading**: Code splitting for better performance

### Backend Integration
- **Supabase**: Backend-as-a-Service for database and authentication
- **PostgreSQL**: Relational database for data storage
- **Row Level Security**: Database-level security policies

### AI Integration
- **Google Gemini API**: AI-powered content generation
- **PDF Processing**: Document analysis and content extraction
- **JSON Parsing**: Structured data extraction from AI responses

## Key Components

### Pages
- **Landing**: Public marketing page with feature showcase
- **Home**: Authenticated user dashboard with feature cards
- **Dashboard**: Main application interface with stats and flashcards
- **Auth**: User authentication (sign up/sign in)
- **Upload**: PDF upload and AI processing interface
- **Quiz**: Interactive quiz interface with progress tracking
- **StudySession**: Spaced repetition study interface

### Components
- **Header**: Navigation header with user controls
- **ProtectedRoute**: Route wrapper for authentication
- **StudySession**: Reusable study session component
- **UI Components**: Shadcn/ui component library

### Hooks
- **useUserStats**: Manages user statistics and progress tracking
- **use-mobile**: Detects mobile devices for responsive behavior

## Development Guidelines

### Code Standards
- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow configured linting rules
- **Prettier**: Consistent code formatting
- **Naming**: Use descriptive, camelCase naming conventions

### Component Structure
```typescript
// Component template
import React from 'react';
import { ComponentProps } from './types';

interface Props {
  // Define props interface
}

const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default Component;
```

### File Organization
- **One component per file**: Keep components focused and modular
- **Co-located styles**: Use Tailwind classes for styling
- **Type definitions**: Define interfaces for props and data structures
- **Export patterns**: Use default exports for components

### State Management
- **Local state**: Use useState for component-specific state
- **Global state**: Use context or custom hooks for shared state
- **Server state**: Use Supabase client for data fetching
- **Form state**: Use controlled components with useState

### Error Handling
- **Try-catch blocks**: Wrap async operations
- **Error boundaries**: Catch and handle React errors
- **User feedback**: Show meaningful error messages
- **Logging**: Log errors for debugging

## Testing

### Unit Testing
- **Component testing**: Test individual components
- **Hook testing**: Test custom hooks
- **Utility testing**: Test utility functions

### Integration Testing
- **API integration**: Test Supabase integration
- **User flows**: Test complete user journeys
- **Error scenarios**: Test error handling

## Performance Optimization

### Code Splitting
- **Route-based splitting**: Lazy load pages
- **Component splitting**: Lazy load heavy components
- **Bundle analysis**: Monitor bundle size

### Caching
- **API caching**: Cache Supabase responses
- **Asset caching**: Optimize static assets
- **Browser caching**: Use appropriate cache headers

## Security

### Authentication
- **Supabase Auth**: Secure user authentication
- **Route protection**: Protect authenticated routes
- **Token management**: Handle auth tokens securely

### Data Protection
- **Input validation**: Validate all user inputs
- **SQL injection**: Use parameterized queries
- **XSS prevention**: Sanitize user content

## Deployment

### Build Process
- **Vite build**: Optimized production build
- **Asset optimization**: Minified and compressed assets
- **Environment variables**: Secure configuration

### Hosting
- **Static hosting**: Deploy to Vercel, Netlify, or similar
- **CDN**: Use CDN for global performance
- **SSL**: Ensure HTTPS for security

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

### Code Review
- **Pull requests**: All changes via pull requests
- **Code review**: Peer review required
- **Testing**: Include tests for new features
- **Documentation**: Update documentation as needed

## Contact

For questions about the source code or development, contact [your.email@example.com].
