# Sound Leaves

Music sheet and audio organizer in Google Apps Script.

- **Upload link**: band members open a link (no Google login needed), pick a song, instrument and file. The file is sorted into your Google Drive.
- **Dashboard**: only for you. Shows which sheets are missing for every song × instrument, and which songs have no audio yet.

## Where things are stored

Everything lives in **your own Google Drive** (the account that deploys the script):

```
Sound Leaves/
  Sound Leaves – Daten          <- spreadsheet: songs, instruments, upload log
  Sheets/<Nr> <Titel>/<Instrument>/<Song> - <Instrument> - <Version> - <Datum>.pdf
  Audio/<Nr> <Titel>/<Song> - <Version> - <Datum>.mp3
```

- `setup()` creates the `Sound Leaves` folder at the top of *My Drive*. To use another folder, put its ID (the part after `/folders/` in its URL) into `EXISTING_ROOT_FOLDER_ID` in `ConfigScript.gs` **before** running `setup()`.
- You can move the folder later; the script finds it by ID.
- The dashboard counts the files that are in the Drive folders, so files you add by hand count too.
- Folder names come from the spreadsheet. If you rename a song or instrument in the spreadsheet, rename its folder(s) too. The dashboard lists folders that no longer match.

## Files

| File | Purpose |
|---|---|
| `src/appsscript.json` | Manifest (timezone, permissions, web app settings) |
| `src/ConfigScript.gs` | Settings (folder/tab names, max file size, optional root folder ID) |
| `src/SetupScript.gs` | `setup()` – creates folders and spreadsheet, run once |
| `src/Code.gs` | Web app entry (`doGet`), page routing |
| `src/DataScript.gs` | Reads songs/instruments, writes upload log |
| `src/UploadScript.gs` | Receives uploads and sorts them into Drive |
| `src/DashboardScript.gs` | Builds the song × instrument overview |
| `src/Upload.html` | Upload form |
| `src/Dashboard.html` | Dashboard page |
| `src/Styles.html` | Shared styles |

## Deploy

1. Go to [script.google.com](https://script.google.com) → **New project**. Name it "Sound Leaves".
2. **Project Settings** (gear icon) → tick **Show "appsscript.json" manifest file in editor**.
3. Back in the **Editor**, create one file per file in `src/` with the **same name** (without extension, the editor adds `.gs` / `.html`):
   - `+` → **Script** for `.gs` files, `+` → **HTML** for `.html` files.
   - Paste the content. Replace the content of the existing `Code.gs` and `appsscript.json`.
4. Optional: set `EXISTING_ROOT_FOLDER_ID` in `ConfigScript.gs`.
5. Select the function **`setup`** in the toolbar and click **Run**. Allow the permissions (Google warns that the app is unverified: *Advanced* → *Go to Sound Leaves*). The log shows the links to the new folder and spreadsheet.
6. Open the spreadsheet and fill in the tabs **Songs** (at least *Titel*) and **Instrumente** (*Name*, optional *Reihenfolge*). Delete the example rows.
7. **Deploy** → **New deployment** → type **Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
8. Share the URL with the band. That is the upload link.
9. Dashboard: open the same URL with `?page=dashboard` at the end, while signed in to your Google account. Everyone else gets the upload form there.

### After changing the code

**Deploy** → **Manage deployments** → edit (pencil) → *Version*: **New version** → **Deploy**. The URL stays the same.

Changes in the spreadsheet (new songs/instruments) show up immediately, no redeploy needed.

## Limits

- Max. 40 MB per file (Apps Script can't take larger uploads this way).
- The upload link is the only protection. Anyone with the link can upload, but can't see or delete files.

## Testing after deploy

1. Add 2 songs and 2 instruments in the spreadsheet.
2. Open the `/exec` URL in a private/incognito window → upload a PDF for song 1 / instrument 1 and an MP3 for song 1.
3. Check: files are in `Sheets/<song>/<instrument>/` and `Audio/<song>/`; the **Uploads** tab has 2 new rows.
4. Open `…/exec?page=dashboard` signed in → song 1 has one green cell and audio; everything else is red.
5. Open `…/exec?page=dashboard` in the private window → shows the upload form.
