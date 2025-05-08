# Table Read Development Guide

## Build/Test Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `vitest run` - Run all tests
- `vitest run <test-file>` - Run specific test file
- `vitest run --grep="<pattern>"` - Run tests matching pattern

## Code Style Guidelines

- **TypeScript Imports**: Use absolute imports with `@/*` alias
- **Naming**: Use camelCase for variables/functions, PascalCase for components/types
- **Components**: Prefer functional components with shadcn UI conventions
- **State Management**: Use React Query for API data, React hooks for local state
- **CSS**: Use Tailwind utility classes and extend theme in tailwind.config.ts
- **Error Handling**: Use try/catch for async operations, toast for user feedback
- **API Patterns**: Use Supabase for data storage and authentication
- **File Structure**: Group related components, hooks, and utilities together
- **Testing**: Use Vitest for unit tests focusing on component functionality

## API Guidelines

- **Web API Compatibility**: Use standard Web APIs (Fetch API, Request/Response) instead of Express/Node.js APIs
- **Data Types**: Use ArrayBuffer/Uint8Array instead of Node.js Buffer for binary data
- **Environment Variables**: Use import.meta.env.VITE\_\* for environment variables
- **Error Handling**: Return properly formatted Response objects with appropriate status codes and headers

## Supabase Integration

- **Auth**: Use middleware.ts to extract user from auth token
- **Storage**: Use documents bucket for file storage with proper RLS policies
- **Document API**: Use getUserDocuments(), getDocumentById(), getDocumentUrl() functions
- **Error Handling**: Always check for errors in Supabase responses

## ElevenLabs TTS Integration

- Use synthesizeSpeech({ text, voiceId, ...options }) for text-to-speech
- Clean up audio URLs with URL.revokeObjectURL() when done
- Handle API errors gracefully with toast notifications
- Implement playback controls (speed, volume) for better user experience

## Task Master Integration

- Initialize tasks: `task-master init` or `task-master parse-prd --input=<file>`
- View tasks: `task-master list` or `task-master next`
- Update tasks: `task-master set-status --id=<id> --status=done`
