/**
 * Web app entry point.
 *   <exec-url>                 -> upload form (anyone)
 *   <exec-url>?page=dashboard  -> dashboard (owner only, others get the upload form)
 */
function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) || '';
  const templateName = page === 'dashboard' && isOwner() ? 'Dashboard' : 'Upload';
  const title = templateName === 'Dashboard' ? APP_NAME + ' – Übersicht' : APP_NAME + ' – Hochladen';

  return HtmlService.createTemplateFromFile(templateName)
    .evaluate()
    .setTitle(title)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Used inside HTML templates: <?!= include('Styles') ?>
function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}
