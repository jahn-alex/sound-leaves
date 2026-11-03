/**
 * Run once from the Apps Script editor (select "setup" and click "Run").
 * Safe to run again: existing spreadsheet and folders are reused.
 */
function setup() {
  const properties = PropertiesService.getScriptProperties();

  const rootFolder = getOrCreateRootFolder_(properties);
  getOrCreateFolder_(rootFolder, FOLDER_NAMES.sheets);
  getOrCreateFolder_(rootFolder, FOLDER_NAMES.audio);

  const spreadsheet = getOrCreateSpreadsheet_(properties, rootFolder);
  setUpTab_(spreadsheet, TAB_NAMES.songs, HEADERS.songs, [1, 'Beispielsong', '', '', '', '', '']);
  setUpTab_(spreadsheet, TAB_NAMES.instruments, HEADERS.instruments, ['Trompete', 1]);
  setUpTab_(spreadsheet, TAB_NAMES.uploads, HEADERS.uploads, null);
  removeDefaultTab_(spreadsheet);

  Logger.log('Fertig.');
  Logger.log('Ordner: ' + rootFolder.getUrl());
  Logger.log('Tabelle: ' + spreadsheet.getUrl());
}

function getOrCreateRootFolder_(properties) {
  const storedId = properties.getProperty(PROPERTY_KEYS.rootFolderId);
  const folderId = EXISTING_ROOT_FOLDER_ID || storedId;
  if (folderId) {
    const folder = DriveApp.getFolderById(folderId);
    properties.setProperty(PROPERTY_KEYS.rootFolderId, folder.getId());
    return folder;
  }
  const folder = DriveApp.createFolder(APP_NAME);
  properties.setProperty(PROPERTY_KEYS.rootFolderId, folder.getId());
  return folder;
}

function getOrCreateSpreadsheet_(properties, rootFolder) {
  const storedId = properties.getProperty(PROPERTY_KEYS.spreadsheetId);
  if (storedId) {
    return SpreadsheetApp.openById(storedId);
  }
  const spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
  DriveApp.getFileById(spreadsheet.getId()).moveTo(rootFolder);
  properties.setProperty(PROPERTY_KEYS.spreadsheetId, spreadsheet.getId());
  return spreadsheet;
}

function setUpTab_(spreadsheet, tabName, headers, exampleRow) {
  let sheet = spreadsheet.getSheetByName(tabName);
  if (sheet) {
    return;
  }
  sheet = spreadsheet.insertSheet(tabName);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  if (exampleRow) {
    sheet.getRange(2, 1, 1, exampleRow.length).setValues([exampleRow]);
  }
  sheet.autoResizeColumns(1, headers.length);
}

function removeDefaultTab_(spreadsheet) {
  const ownTabs = Object.values(TAB_NAMES);
  spreadsheet.getSheets()
    .filter((sheet) => ownTabs.indexOf(sheet.getName()) === -1 && sheet.getLastRow() === 0)
    .forEach((sheet) => spreadsheet.deleteSheet(sheet));
}
