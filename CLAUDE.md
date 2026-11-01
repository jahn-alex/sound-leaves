# Sound Leaves

Music sheet and audio organizer for one band. React + Mantine on Cloudflare Pages, Supabase, Cloudflare R2.

- Requirements: [docs/_technical_docs.md](docs/_technical_docs.md)
- Architecture rules: [docs/architecture.md](docs/architecture.md). Read before writing code.

Key rules:

- Organize code by feature in `src/features/<feature>/`; move code to `src/shared/` only once 2+ features use it.
- Components never import `supabase`: API calls go in `xApi.ts`, wrapped by TanStack Query hooks in `useX.ts`.
- Code and database names are in English; UI text is in German, written directly in components.
- No `any`. Database types are generated with `supabase gen types`.
- Comments explain why, not what. No commented-out code.
- Tests (Vitest) cover logic only and sit next to the code.
- Update the documentation as changes are made.
