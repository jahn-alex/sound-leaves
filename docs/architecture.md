# Architecture Principles

These rules keep the code readable for humans. Every change should follow them.
For what the app does, see [_technical_docs.md](_technical_docs.md).

## 1. Folder Structure: by Feature

```
src/
  app/            App.tsx (providers + routes), AppLayout.tsx, navigation.ts
  features/
    auth/         login
    home/
    songs/        components, songsApi.ts, useSongs.ts, types.ts
    instruments/
    sheets/
    upload/
    library/      Data View: browse sheets/audio by song or instrument
    completion/
    playing/
  shared/
    components/   reusable UI used by 2+ features (e.g. PagePlaceholder)
    lib/          supabase.ts, filesApi.ts (R2 via /api/files)
functions/        Cloudflare Pages Functions (server side, R2 access)
supabase/         migrations
```

- A feature keeps everything for one area together: components, data calls, hooks, types.
- Code moves to `shared/` only once **two or more** features use it.
- Features don't import from inside other features. If they need the same code, it moves to `shared/`.

## 2. Data Access: API Files + TanStack Query

Three layers, each with one job:

| Layer         | File          | Job                                                     |
| ------------- | ------------- | ------------------------------------------------------- |
| API function  | `songsApi.ts` | Calls Supabase or `/api/files`. Throws on error. No React. |
| Hook          | `useSongs.ts` | Wraps API functions in `useQuery` / `useMutation`.       |
| Component     | `SongList.tsx`| Uses hooks only. Never imports `supabase` directly.      |

```ts
// features/songs/songsApi.ts
export async function fetchSongs(): Promise<Song[]> {
  const { data, error } = await supabase.from('songs').select('*').order('number');
  if (error) throw error;
  return data;
}

// features/songs/useSongs.ts
export function useSongs() {
  return useQuery({ queryKey: ['songs'], queryFn: fetchSongs });
}

// features/songs/SongList.tsx
const { data: songs, isLoading } = useSongs();
```

## 3. Language

- **Code is English**: identifiers, file names, database tables/columns, comments.
- **UI is German**: text is written directly in components (no i18n library).

```tsx
<TextInput label="Text & Musik" {...form.getInputProps('lyricsAndMusic')} />
```

Song fields: `number` (Nummer), `title` (Titel), `lyrics_and_music` (Text & Musik),
`arrangement` (Arrangement), `artist` (Artist), `genres` (Genre/s), `tempo_bpm` (Tempo).

## 4. Libraries

| Purpose      | Library         |
| ------------ | --------------- |
| UI           | Mantine         |
| Forms        | Mantine Form    |
| Routing      | React Router    |
| Server data  | TanStack Query  |
| Database     | Supabase JS     |
| Tests        | Vitest          |

New libraries are added only for a clear need. Add them to this table with the reason.

## 5. Readability Rules

- **Formatting**: Prettier formats everything. Formatting is not discussed in reviews.
- **Types**: strict TypeScript. `any` is a lint error. Database types are generated from the
  Supabase schema (`supabase gen types`) and never written by hand.
- **Comments** explain *why*, not *what*. No commented-out code.

  ```ts
  // Bad:  increment version count
  // Good: R2 keys use the version id, so re-uploads never overwrite the original scan
  ```

- **Naming**:
  - Components: `PascalCase.tsx` (`SongList.tsx`)
  - Hooks: `useX.ts` (`useSongs.ts`)
  - API files: `xApi.ts` (`songsApi.ts`)
  - Descriptive names, no abbreviations except common ones (`id`, `url`).
    `instrument`, not `instr`; `sheetVersion`, not `sv`.

## 6. Testing

- Vitest for **logic only**, e.g. completion matrix calculation, R2 key building.
- Test files sit next to the code: `completionMatrix.ts` + `completionMatrix.test.ts`.
- No UI tests for now.
