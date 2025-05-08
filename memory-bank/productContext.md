# productContext.md

## Why This Project Exists

Table Read exists to make collaborative script reading accessible, efficient, and enjoyable for creative teams, writers, and actors. Traditional table reads are often limited by physical presence, lack of accessibility, or cumbersome tools. This project solves those issues with a modern, web-based solution.

## Problems It Solves

- Difficulty collaborating on scripts remotely or asynchronously
- Lack of accessible, user-friendly tools for script reading/playback
- Manual and error-prone script sharing/editing workflows
- Limited options for high-quality voice playback of scripts
- Problem: Users need to upload and interact with scripts or text documents for text-to-speech and practice.
- Solution: Unified upload flow supporting Final Draft and text formats, with script flag for interactive features.
- UX: Simple, accessible upload with clear feedback, script checkbox, and robust backend handling.

## How It Should Work

- Users can sign up, authenticate, and manage their scripts
- Upload, edit, and organize scripts in a clean UI
- Assign parts/roles and collaborate in real time or asynchronously
- Play back scripts using ElevenLabs TTS
- All features are accessible and optimized for usability

## User Experience Goals

- Simple, beautiful, and intuitive interface
- Fast, reliable performance
- Seamless collaboration and sharing
- High accessibility (keyboard, screen reader, etc.)
- Delightful, modern design using TailwindCSS, Shadcn, and Radix UI

## Implementation Notes (2025)

- Authentication service layer and React context/hooks are now implemented and verified against Supabase best practices
