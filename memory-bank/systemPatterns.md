# systemPatterns.md

## System Architecture

- Frontend: TypeScript, TailwindCSS, Shadcn, Radix UI for accessible, modern UI
- Backend: FastAPI for API endpoints and orchestration
- Database/Auth: Supabase for user management and data storage
- Text-to-Speech: ElevenLabs API for high-quality script playback

## Key Technical Decisions

- Use modern static-first frontend stack (TypeScript, TailwindCSS, Shadcn, Radix UI)
- TailwindCSS for utility-first styling; Shadcn & Radix UI for accessible components
- Supabase chosen for seamless auth and real-time database integration
- ElevenLabs selected for advanced TTS capabilities
- TypeScript enforced throughout for safety and maintainability

## Design Patterns in Use

- Modular, DRY, and type-safe code organization
- Early returns in functions for clarity
- Accessibility-first approach for all interactive elements
- Separation of concerns: service files for API/Supabase/ElevenLabs logic
- API endpoints for backend logic (e.g., /api/upload-text)
- Supabase Storage for file storage; Postgres for metadata
- Type augmentation for custom backend context
- Backend middleware for user extraction from Supabase JWT
- tsconfig includes src and supabase for type discovery
- SQL migrations for schema changes
- Automated storage upload testing using Vitest with real Supabase credentials and cleanup logic.
- Supabase Storage RLS policies must be configured to allow app uploads (public/anon for dev/testing; restrict for prod).

## Cloudflare Deployment Patterns (Implemented)

- API endpoints now use Fetch API (`Request`, `Response`) interface throughout
- All service logic (e.g., ElevenLabs TTS) uses web platform types (`ArrayBuffer`, `Uint8Array`)
- Node.js-specific dependencies have been replaced with web-compatible alternatives
- Environment variables accessed via Vite import.meta.env instead of process.env
- Binary data handled with ArrayBuffer for cross-platform compatibility
- Error responses properly formatted with appropriate status codes and content types

## Component Relationships

- UI components interact with services (Supabase, ElevenLabs) via well-defined interfaces
- Authentication and user state managed globally and injected into relevant components
- Scripts and playback managed through a combination of backend API and frontend state

## Authentication Patterns (2025)

- Authentication service layer (`src/services/auth.ts`) and React context/hooks (`src/hooks/useAuth.tsx`) are implemented
- Patterns follow Supabase and React best practices for modularity, error handling, and state management
