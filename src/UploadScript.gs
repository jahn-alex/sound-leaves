/**
 * Receives a file from the upload form and sorts it into Drive:
 *   Sheets/<Song>/<Instrument>/<file>.pdf
 *   Audio/<Song>/<file>.mp3
 */
function uploadFile(payload) {
  const upload = validateUpload_(payload);

  const blob = Utilities.newBlob(
    Utilities.base64Decode(payload.base64),
    upload.typeConfig.mimeTypes[0],
    upload.fileName
  );

  const targetFolder = withLock_(() => getTargetFolder_(upload));
  const file = targetFolder.createFile(blob);
  const description = [upload.label, upload.note].filter((part) => part).join(' – ');
  if (description) {
    file.setDescription(description);
  }

  appendUploadLog({
    uploaderName: upload.uploaderName,
    typeLabel: upload.typeConfig.label,
    song: upload.song,
    instrument: upload.instrument,
    label: upload.label,
    note: upload.note,
    fileName: upload.fileName,
    fileUrl: file.getUrl(),
  });

  return { ok: true, fileName: upload.fileName };
}

function validateUpload_(payload) {
  if (!payload) {
    throw new Error('Keine Daten empfangen.');
  }
  const typeConfig = UPLOAD_TYPES[payload.type];
  if (!typeConfig) {
    throw new Error('Unbekannter Dateityp.');
  }

  const uploaderName = String(payload.uploaderName || '').trim();
  if (!uploaderName) {
    throw new Error('Bitte deinen Namen angeben.');
  }

  const song = String(payload.song || '').trim();
  const songEntry = readSongs().find((entry) => entry.label === song);
  if (!songEntry) {
    throw new Error('Bitte einen Song aus der Liste auswählen.');
  }

  let instrument = '';
  if (payload.type === 'sheet') {
    instrument = String(payload.instrument || '').trim();
    if (readInstruments().map((entry) => entry.name).indexOf(instrument) === -1) {
      throw new Error('Bitte ein Instrument aus der Liste auswählen.');
    }
  }

  const originalName = String(payload.fileName || '');
  const extension = originalName.split('.').pop().toLowerCase();
  const mimeType = String(payload.mimeType || '');
  if (extension !== typeConfig.extension && typeConfig.mimeTypes.indexOf(mimeType) === -1) {
    throw new Error('Für ' + typeConfig.label + ' bitte eine .' + typeConfig.extension + '-Datei wählen.');
  }

  const base64 = String(payload.base64 || '');
  if (!base64) {
    throw new Error('Die Datei ist leer.');
  }
  const sizeMb = (base64.length * 3) / 4 / (1024 * 1024);
  if (sizeMb > MAX_FILE_SIZE_MB) {
    throw new Error('Die Datei ist zu groß (max. ' + MAX_FILE_SIZE_MB + ' MB).');
  }

  const label = sanitizeName_(String(payload.label || '').trim());
  const note = String(payload.note || '').trim();

  return {
    typeConfig,
    type: payload.type,
    uploaderName,
    song,
    instrument,
    label,
    note,
    fileName: buildFileName_(songEntry, instrument, typeConfig.extension),
  };
}

// "007 Trompete Songtitel.pdf" / "007 Songtitel.mp3" (audio has no instrument)
function buildFileName_(song, instrument, extension) {
  const parts = [padSongNumber_(song.number), instrument, sanitizeName_(song.title)].filter((part) => part);
  return parts.join(' ') + '.' + extension;
}

function getTargetFolder_(upload) {
  const rootFolder = DriveApp.getFolderById(getConfig().rootFolderId);
  if (upload.type === 'audio') {
    const audioFolder = getOrCreateFolder_(rootFolder, FOLDER_NAMES.audio);
    return getOrCreateFolder_(audioFolder, upload.song);
  }
  const sheetsFolder = getOrCreateFolder_(rootFolder, FOLDER_NAMES.sheets);
  const songFolder = getOrCreateFolder_(sheetsFolder, upload.song);
  return getOrCreateFolder_(songFolder, upload.instrument);
}

function getOrCreateFolder_(parentFolder, name) {
  const existing = parentFolder.getFoldersByName(name);
  return existing.hasNext() ? existing.next() : parentFolder.createFolder(name);
}

// Two people uploading for the same new song at once would otherwise create duplicate folders.
function withLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}
