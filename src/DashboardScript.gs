/**
 * Data for the owner-only dashboard: which sheets exist per song × instrument.
 * Counts the files that are actually in Drive, so manually added files count too.
 */

// With "Execute as: Me", getActiveUser() only returns an email when the viewer is the owner.
function isOwner() {
  try {
    const viewer = Session.getActiveUser().getEmail();
    const owner = Session.getEffectiveUser().getEmail();
    return viewer !== '' && viewer === owner;
  } catch (error) {
    return false;
  }
}

function getDashboardData() {
  if (!isOwner()) {
    throw new Error('Keine Berechtigung.');
  }

  const songs = readSongs();
  const instruments = readInstruments();
  const rootFolder = DriveApp.getFolderById(getConfig().rootFolderId);
  const sheetFolders = readSheetFolders_(rootFolder);
  const audioFolders = readAudioFolders_(rootFolder);

  const knownSongs = songs.map((song) => song.label);
  const knownInstruments = instruments.map((instrument) => instrument.name);

  const rows = songs.map((song) => {
    const songFolder = sheetFolders[song.label] || { instruments: {} };
    const cells = instruments.map((instrument) => {
      const instrumentFolder = songFolder.instruments[instrument.name];
      return {
        count: instrumentFolder ? instrumentFolder.count : 0,
        url: instrumentFolder ? instrumentFolder.url : '',
      };
    });
    const audioFolder = audioFolders[song.label];
    return {
      song: song.label,
      cells,
      audio: {
        count: audioFolder ? audioFolder.count : 0,
        url: audioFolder ? audioFolder.url : '',
      },
    };
  });

  return {
    instruments: knownInstruments,
    rows,
    unmatchedFolders: findUnmatchedFolders_(sheetFolders, audioFolders, knownSongs, knownInstruments),
    rootFolderUrl: rootFolder.getUrl(),
    spreadsheetUrl: getSpreadsheet_().getUrl(),
  };
}

// { "<Song>": { url, instruments: { "<Instrument>": { url, count } } } }
function readSheetFolders_(rootFolder) {
  const result = {};
  const sheetsFolder = findChildFolder_(rootFolder, FOLDER_NAMES.sheets);
  if (!sheetsFolder) {
    return result;
  }
  forEachFolder_(sheetsFolder, (songFolder) => {
    const instruments = {};
    forEachFolder_(songFolder, (instrumentFolder) => {
      instruments[instrumentFolder.getName()] = {
        url: instrumentFolder.getUrl(),
        count: countFiles_(instrumentFolder),
      };
    });
    result[songFolder.getName()] = { url: songFolder.getUrl(), instruments };
  });
  return result;
}

// { "<Song>": { url, count } }
function readAudioFolders_(rootFolder) {
  const result = {};
  const audioFolder = findChildFolder_(rootFolder, FOLDER_NAMES.audio);
  if (!audioFolder) {
    return result;
  }
  forEachFolder_(audioFolder, (songFolder) => {
    result[songFolder.getName()] = { url: songFolder.getUrl(), count: countFiles_(songFolder) };
  });
  return result;
}

// Folders whose names don't match the spreadsheet, e.g. after renaming a song.
function findUnmatchedFolders_(sheetFolders, audioFolders, knownSongs, knownInstruments) {
  const unmatched = [];
  Object.keys(sheetFolders).forEach((songName) => {
    const songFolder = sheetFolders[songName];
    if (knownSongs.indexOf(songName) === -1) {
      unmatched.push({ path: FOLDER_NAMES.sheets + '/' + songName, url: songFolder.url });
      return;
    }
    Object.keys(songFolder.instruments).forEach((instrumentName) => {
      if (knownInstruments.indexOf(instrumentName) === -1) {
        unmatched.push({
          path: FOLDER_NAMES.sheets + '/' + songName + '/' + instrumentName,
          url: songFolder.instruments[instrumentName].url,
        });
      }
    });
  });
  Object.keys(audioFolders).forEach((songName) => {
    if (knownSongs.indexOf(songName) === -1) {
      unmatched.push({ path: FOLDER_NAMES.audio + '/' + songName, url: audioFolders[songName].url });
    }
  });
  return unmatched;
}

function findChildFolder_(parentFolder, name) {
  const folders = parentFolder.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : null;
}

function forEachFolder_(parentFolder, callback) {
  const folders = parentFolder.getFolders();
  while (folders.hasNext()) {
    const folder = folders.next();
    if (!folder.isTrashed()) {
      callback(folder);
    }
  }
}

function countFiles_(folder) {
  let count = 0;
  const files = folder.getFiles();
  while (files.hasNext()) {
    if (!files.next().isTrashed()) {
      count++;
    }
  }
  return count;
}
