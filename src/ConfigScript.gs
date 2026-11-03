/**
 * Central settings. Change values here, not in the other files.
 */

// Optional: ID of an existing Drive folder (the part after /folders/ in its URL).
// Leave empty to let setup() create a "Sound Leaves" folder at the top of My Drive.
const EXISTING_ROOT_FOLDER_ID = '';

const APP_NAME = 'Sound Leaves';
const SPREADSHEET_NAME = 'Sound Leaves – Daten';

const FOLDER_NAMES = {
  sheets: 'Sheets',
  audio: 'Audio',
};

const TAB_NAMES = {
  songs: 'Songs',
  instruments: 'Instrumente',
  uploads: 'Uploads',
};

const HEADERS = {
  songs: ['Nummer', 'Titel', 'Text & Musik', 'Arrangement', 'Artist', 'Genre/s', 'Tempo (bpm)'],
  instruments: ['Name', 'Reihenfolge'],
  uploads: ['Zeitpunkt', 'Name', 'Typ', 'Song', 'Instrument', 'Label', 'Notiz', 'Dateiname', 'Link'],
};

const UPLOAD_TYPES = {
  sheet: { label: 'Noten', extension: 'pdf', mimeTypes: ['application/pdf'] },
  audio: { label: 'Audio', extension: 'mp3', mimeTypes: ['audio/mpeg', 'audio/mp3'] },
};

// Files travel as base64 through google.script.run, which fails above ~50 MB.
const MAX_FILE_SIZE_MB = 40;

const PROPERTY_KEYS = {
  spreadsheetId: 'SPREADSHEET_ID',
  rootFolderId: 'ROOT_FOLDER_ID',
};

function getConfig() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty(PROPERTY_KEYS.spreadsheetId);
  const rootFolderId = properties.getProperty(PROPERTY_KEYS.rootFolderId);
  if (!spreadsheetId || !rootFolderId) {
    throw new Error('Sound Leaves ist noch nicht eingerichtet. Bitte im Editor einmal setup() ausführen.');
  }
  return { spreadsheetId, rootFolderId };
}
