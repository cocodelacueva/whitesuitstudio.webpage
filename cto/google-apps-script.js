// =============================================
// GOOGLE APPS SCRIPT - Formulario de contacto
// =============================================
// INSTRUCCIONES:
// 1. Abrí Google Sheets → creá una hoja nueva (o usá una existente)
// 2. Nombrá la primera hoja "Contactos" (o dejá "Hoja 1" y cambiá SHEET_NAME abajo)
// 3. En la fila 1 poné los headers: Timestamp | Nombre | Email | Mensaje | Source
// 4. Andá a Extensiones → Apps Script
// 5. Pegá TODO este código (reemplazando lo que haya)
// 6. Guardá (Ctrl+S)
// 7. Hacé click en "Deploy" → "New deployment"
// 8. Tipo: "Web app"
// 9. Execute as: "Me" (tu cuenta)
// 10. Who has access: "Anyone"
// 11. Click "Deploy" → Copiá la URL
// 12. Pegá esa URL en el index.html donde dice GOOGLE_SCRIPT_URL
// =============================================

const SHEET_NAME = 'Contactos'; // Cambiá si tu hoja tiene otro nombre

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      // Si no existe la hoja, la crea con headers
      const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
      newSheet.appendRow(['Timestamp', 'Nombre', 'Email', 'Mensaje', 'Source']);
      return processData(newSheet, e);
    }

    return processData(sheet, e);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function processData(sheet, e) {
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.message || '',
    data.source || ''
  ]);

  // Opcional: enviar notificación por email
  // Descomentar las líneas de abajo si querés recibir un email cada vez que alguien te escribe
  MailApp.sendEmail({
    to: 'support@whitesuit.studio',
    subject: 'Nuevo contacto desde cto.whitesuit.studio: ' + (data.name || 'Sin nombre'),
    body: 'Nombre: ' + data.name + '\nEmail: ' + data.email + '\nMensaje: ' + data.message + '\nFecha: ' + data.timestamp
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
