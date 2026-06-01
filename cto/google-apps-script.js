// =============================================
// GOOGLE APPS SCRIPT - Formulario de contacto + Descargas del Deck
// =============================================
// INSTRUCCIONES:
// 1. Abrí Google Sheets → creá una hoja nueva (o usá una existente)
// 2. Nombrá la primera hoja "Contactos" (o dejá "Hoja 1" y cambiá SHEET_NAME abajo)
// 3. En la fila 1 poné los headers: Timestamp | Nombre | Email | Mensaje | Source
//    (Las descargas del deck también se guardan acá, con Mensaje = "Descarga PDF")
// 4. Andá a Extensiones → Apps Script
// 5. Pegá TODO este código (reemplazando lo que haya)
// 6. Guardá (Ctrl+S)
// 7. Hacé click en "Deploy" → "Manage deployments" → editá tu deployment existente
//    → "New version" → Deploy  (IMPORTANTE: tenés que crear una versión nueva
//    para que el cambio tome efecto, sino sigue corriendo el código viejo)
// 8. La URL del deployment NO cambia, así que no hace falta tocar el index.html
// =============================================

const SHEET_NAME = 'Contactos'; // Hoja del formulario de contacto y descargas

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Tanto las descargas del deck como el formulario de contacto
    // van a la MISMA hoja "Contactos". Las descargas se distinguen
    // porque en la columna "Mensaje" dicen "Descarga PDF".
    if (data.type === 'download') {
      return handleDownload(data);
    }

    return handleContact(data);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ---------- Formulario de contacto ----------
function handleContact(data) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Nombre', 'Email', 'Mensaje', 'Source']);
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.message || '',
    data.source || ''
  ]);

  // Notificación por email
  MailApp.sendEmail({
    to: 'support@whitesuit.studio',
    subject: 'Nuevo contacto desde cto.whitesuit.studio: ' + (data.name || 'Sin nombre'),
    body: 'Nombre: ' + data.name + '\nEmail: ' + data.email + '\nMensaje: ' + data.message + '\nFecha: ' + data.timestamp
  });

  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ---------- Descarga del deck (misma hoja "Contactos", marcada en Mensaje) ----------
function handleDownload(data) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Nombre', 'Email', 'Mensaje', 'Source']);
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || '',
    data.email || '',
    'Descarga PDF',
    data.source || ''
  ]);

  // Notificación por email (opcional). Comentá este bloque si no querés
  // recibir un mail cada vez que alguien descarga el deck.
  MailApp.sendEmail({
    to: 'support@whitesuit.studio',
    subject: 'Nueva descarga del deck: ' + (data.email || 'Sin email'),
    body: 'Nombre: ' + (data.name || '(no dejó nombre)') + '\nEmail: ' + data.email + '\nFecha: ' + data.timestamp + '\nSource: ' + data.source
  });

  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ result: 'error', message: 'Use POST method' })
  ).setMimeType(ContentService.MimeType.JSON);
}
