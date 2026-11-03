/**
 * Reading songs/instruments from the spreadsheet and writing the upload log.
 */

function getSpreadsheet_() {
  return SpreadsheetApp.openById(getConfig().spreadsheetId);
}

function getTab_(tabName) {
  const sheet = getSpreadsheet_().getSheetByName(tabName);
  if (!sheet) {
    throw new Error('Tabellenblatt "' + tabName + '" fehlt. Bitte setup() erneut ausführen.');
  }
  return sheet;
}

// Returns all rows below the header row, without completely empty rows.
function readRows_(tabName) {
  const sheet = getTab_(tabName);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return [];
  }
  return sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getDisplayValues()
    .filter((row) => row.some((cell) => String(cell).trim() !== ''));
}

/**
 * Songs sorted by number (songs without number last, then by title).
 * `label` is the unique key used in forms and as Drive folder name.
 */
function readSongs() {
  const songs = readRows_(TAB_NAMES.songs)
    .map((row) => ({ number: String(row[0]).trim(), title: String(row[1]).trim() }))
    .filter((song) => song.title !== '')
    .map((song) => ({
      number: song.number,
      title: song.title,
      label: sanitizeName_(song.number ? song.number + ' ' + song.title : song.title),
    }));

  songs.sort((a, b) => {
    const numberA = parseFloat(a.number);
    const numberB = parseFloat(b.number);
    const hasA = !isNaN(numberA);
    const hasB = !isNaN(numberB);
    if (hasA && hasB && numberA !== numberB) return numberA - numberB;
    if (hasA !== hasB) return hasA ? -1 : 1;
    return a.title.localeCompare(b.title, 'de');
  });
  return songs;
}

/** Instruments sorted by "Reihenfolge", then by name. */
function readInstruments() {
  const instruments = readRows_(TAB_NAMES.instruments)
    .map((row) => ({ name: sanitizeName_(String(row[0]).trim()), sortOrder: parseFloat(row[1]) }))
    .filter((instrument) => instrument.name !== '');

  instruments.sort((a, b) => {
    const orderA = isNaN(a.sortOrder) ? Infinity : a.sortOrder;
    const orderB = isNaN(b.sortOrder) ? Infinity : b.sortOrder;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name, 'de');
  });
  return instruments;
}

/** Called by the upload form to fill the selects. */
function getFormOptions() {
  return {
    songs: readSongs().map((song) => song.label),
    instruments: readInstruments().map((instrument) => instrument.name),
    maxFileSizeMb: MAX_FILE_SIZE_MB,
  };
}

function appendUploadLog(entry) {
  getTab_(TAB_NAMES.uploads).appendRow([
    new Date(),
    entry.uploaderName,
    entry.typeLabel,
    entry.song,
    entry.instrument || '',
    entry.label || '',
    entry.note || '',
    entry.fileName,
    entry.fileUrl,
  ]);
}

// Drive allows most characters, but these break paths or confuse people.
function sanitizeName_(name) {
  return String(name).replace(/[\/\\:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
}
