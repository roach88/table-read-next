# Table Read Next

A modern, accessible web application for collaborative script reading. Built with Next.js, TypeScript, TailwindCSS, Shadcn UI, and Radix UI. Integrates Supabase for authentication/storage and ElevenLabs for text-to-speech.

## Project Goals

- Streamline collaborative script reading for creative teams
- Provide a beautiful, accessible, and performant UI
- Support real-time and asynchronous collaboration
- Enable high-quality voice playback of scripts

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 3. Linting & Formatting

- Lint: `npm run lint`
- Format: `npx prettier --write .`

### 4. Build for production

```bash
npm run build
```

## Shadcn UI Usage

- Scaffold new UI components with:

  ```bash
  npx shadcn@latest add <component>
  ```

- See [Shadcn UI docs](https://ui.shadcn.com/docs/cli) for details.

## Contribution Guidelines

- Use Prettier for formatting (`.prettierrc` is provided)
- Use ESLint for code quality
- Keep components modular and accessible
- Document new features and patterns in the memory-bank/

## Environment Variables

- Configure Supabase and ElevenLabs API keys in `.env.local`

## Git & GitHub

- Initialize a new git repo for this codebase
- Create a new GitHub repository (do not reuse the old app repo)
- Push your code and use feature branches for new work

## Deployment

- Designed for deployment on Vercel or Cloudflare
- See `memory-bank/` for architecture and deployment notes

---

For more details, see the memory-bank/ documentation and tasks/tasks.json for the current implementation plan.
