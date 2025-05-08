# projectbrief.md

## Purpose

Table Read is a modern, accessible web application designed to streamline collaborative script reading. It leverages best-in-class frontend frameworks and integrates with backend and AI-powered services to deliver a seamless experience for creative teams.

## Core Requirements

- Provide an intuitive, performant UI for uploading, editing, and reading scripts.
- Enable collaborative features for multiple users.
- Users can authenticate (Supabase), upload documents (Final Draft, text, PDF, HTML, RTF), and flag uploads as scripts.
- Uploads are securely stored in Supabase Storage with metadata in a `documents` table. Supabase Storage Row Level Security (RLS) policies are now configured to allow uploads from the app with automated tests verifying access.
- System uses API backend with type-safe user identification and error handling.
- Integrate with ElevenLabs for text-to-speech capabilities.
- Ensure accessibility and best-practice UI/UX throughout.

## Goals

- Empower writers, actors, and teams to conduct remote or in-person table reads efficiently.
- Deliver a beautiful, modern, and accessible UI using TypeScript, TailwindCSS, Shadcn, and Radix UI.
- Support script playback with high-quality voice synthesis.

## Scope

**In Scope:**

- Frontend: TypeScript, TailwindCSS, Shadcn, Radix UI
- Backend: FastAPI
- Database/Auth: Supabase
- Text-to-Speech: ElevenLabs
- User authentication, script upload/editing, collaborative features, TTS playback

**Out of Scope:**

- Mobile native apps (initially)
- Advanced AI script analysis (future phase)

## Implementation Notes (2025)

- Authentication service layer and React context/hooks are now implemented and verified against Supabase best practices
