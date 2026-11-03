# Sound Leaves

Music sheet and audio organizer in Google Apps Script.

- **Upload link**: band members open a link (no Google login needed), pick a song, instrument and file. The file is sorted into your Google Drive.
- **Dashboard**: only for you. Shows which sheets are missing for every song × instrument, and which songs have no audio yet.

## Where things are stored

Everything lives in **your own Google Drive** (the account that deploys the script):

```
<folder with the script project>/
  Sound Leaves                  <- the script project
  Sound Leaves – Daten          <- spreadsheet: songs, instruments, upload log
  Sheets/000 Songtitel/<Instrument>/000 Instrument Songtitel.pdf
  Audio/000 Songtitel/000 Songtitel.mp3
```

- The root folder is the Drive folder that contains the script project. Put the project where you want everything, then run `setup()`.
- To change the location later, move the project and run `setup()` again. The spreadsheet moves along; existing `Sheets`/`Audio` folders must be moved by hand.
- Song folders and file names use the song number with 3 digits (`7` → `007`, no number → `000`). The optional *Version* and *Notiz* from the form go into the file's description and the upload log.
- The dashboard counts the files that are in the Drive folders, so files you add by hand count too.
- Folder names come from the spreadsheet. If you rename a song or instrument in the spreadsheet, rename its folder(s) too. The dashboard lists folders that no longer match.

## Files

| File | Purpose |
|---|---|
| `src/appsscript.json` | Manifest (timezone, permissions, web app settings) |
| `src/ConfigScript.gs` | Settings (folder/tab names, max file size, number padding) |
| `src/SetupScript.gs` | `setup()` – creates folders and spreadsheet, run once |
| `src/Code.gs` | Web app entry (`doGet`), page routing |
| `src/DataScript.gs` | Reads songs/instruments, writes upload log |
| `src/UploadScript.gs` | Receives uploads and sorts them into Drive |
| `src/DashboardScript.gs` | Builds the song × instrument overview |
| `src/Upload.html` | Upload form |
| `src/Dashboard.html` | Dashboard page |
| `src/Styles.html` | Shared styles |

## Deploy

1. In Google Drive, open the folder where everything should live → **New** → **More** → **Google Apps Script**. Name it "Sound Leaves". (Or create it on [script.google.com](https://script.google.com) and move it into the folder afterwards.)
2. **Project Settings** (gear icon) → tick **Show "appsscript.json" manifest file in editor**.
3. Back in the **Editor**, create one file per file in `src/` with the **same name** (without extension, the editor adds `.gs` / `.html`):
   - `+` → **Script** for `.gs` files, `+` → **HTML** for `.html` files.
   - Paste the content. Replace the content of the existing `Code.gs` and `appsscript.json`.
4. Select the function **`setup`** in the toolbar and click **Run**. Allow the permissions (Google warns that the app is unverified: *Advanced* → *Go to Sound Leaves*). The log shows the links to the folder and spreadsheet.
5. Open the spreadsheet and fill in the tabs **Songs** (at least *Titel*) and **Instrumente** (*Name*, optional *Reihenfolge*). Delete the example rows.
6. **Deploy** → **New deployment** → type **Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
7. Share the URL with the band. That is the upload link.
8. Dashboard: open the same URL with `?page=dashboard` at the end, while signed in to your Google account. Everyone else gets the upload form there.

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
