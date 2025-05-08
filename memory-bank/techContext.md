# techContext.md

## Technologies Used

- TypeScript (strict where possible)
- TailwindCSS for UI
- Shadcn, Radix UI for accessible components
- Supabase (auth, storage, database)
- FastAPI (backend)
- Type augmentation for backend context
- Backend middleware for SSR auth
- SQL migration scripts for DB
- ElevenLabs (text-to-speech API)

## Development Setup

- Node.js and npm required for frontend
- Python 3.9+ and FastAPI for backend
- Supabase project setup with API keys in `.env.local`
- ElevenLabs API key in `.env.local`
- `.env.local` contains Supabase and ElevenLabs API keys for local/dev use.
- Recommended: VSCode with TypeScript and TailwindCSS extensions

## Technical Constraints

- All code must be type-safe (TypeScript, type hints in Python)
- Accessibility is a must for all UI components
- Use only TailwindCSS for styling unless absolutely necessary
- Modular, DRY codebase structure

## Dependencies

- typescript, tailwindcss, shadcn-ui, radix-ui
- fastapi, uvicorn, python-dotenv
- supabase-js
- elevenlabs API client

## Testing

- Automated Vitest test coverage for Supabase storage uploads, including upload, list, and cleanup logic.

## Cloudflare Compatibility Status

The following refactoring has been completed to enable deployment on Cloudflare:

- **API Handlers** (`src/pages/api/*.ts`):
  - All endpoints now use the Fetch API (`Request`, `Response`) instead of Express
  - Express types and middleware dependencies removed
- **TTS Service** (`src/services/elevenlabs.ts`):
  - `synthesizeSpeech` now returns `ArrayBuffer` instead of Node.js `Buffer`
  - Uses native `fetch` API instead of `node-fetch`
  - Environment variables accessed via `import.meta.env.VITE_*`
- **Dependencies**:
  - Node.js-specific dependencies replaced or removed
  - Web API compatible alternatives now used throughout

See `systemPatterns.md` for architectural details. The application is now ready for Cloudflare deployment.
