# EmailJS Einrichtung - Schritt für Schritt

## Was ist EmailJS?

EmailJS ist ein Service, der es ermöglicht, E-Mails direkt aus einer Web-App zu versenden, **ohne ein eigenes Backend zu benötigen**. 

### Wie funktioniert es?

1. **Ihre Web-App** → sendet Anfrage an **EmailJS**
2. **EmailJS** → verarbeitet die Anfrage und sendet E-Mail über **Ihren E-Mail-Service** (z.B. Gmail)
3. **E-Mail** → landet im Postfach des Empfängers

**Vorteil:** Sie müssen keinen eigenen Server betreiben, EmailJS übernimmt das für Sie!

---

## Einrichtung (ca. 10 Minuten)

### Schritt 1: Konto erstellen

1. Gehen Sie zu https://www.emailjs.com/
2. Klicken Sie auf "Sign Up" (kostenlos)
3. Registrieren Sie sich (200 E-Mails/Monat kostenlos)

### Schritt 2: E-Mail-Service verbinden

1. Im Dashboard: Klicken Sie auf **"Email Services"** → **"Add New Service"**
2. Wählen Sie einen Service (z.B. **Gmail** oder **Outlook**)
3. Folgen Sie den Anweisungen zur Authentifizierung
4. **WICHTIG:** Kopieren Sie die **Service ID** (z.B. `service_abc123xyz`)
   - Diese finden Sie nach dem Verbinden oben auf der Service-Seite

### Schritt 3: E-Mail-Template erstellen

1. Im Dashboard: Klicken Sie auf **"Email Templates"** → **"Create New Template"**
2. Füllen Sie das Template aus:
   - **Template Name:** z.B. "Zeiterfassung"
   - **To Email:** `{{to_email}}` (Variable)
   - **Subject:** `{{subject}}` (Variable - enthält bereits die Mitarbeiter-E-Mail)
   - **Content:** 
     ```
     {{message}}
     
     CSV-Daten:
     {{csv_data}}
     ```
   - **Reply To (optional):** `{{user_email}}` (Variable - E-Mail-Adresse des Mitarbeiters)
3. Klicken Sie auf **"Save"**
4. **WICHTIG:** Kopieren Sie die **Template ID** (z.B. `template_xyz789`)
   - Diese finden Sie oben auf der Template-Seite

**Hinweis zu den Template-Variablen:**
- `{{to_email}}` - Empfänger (Karim)
- `{{subject}}` - Betreff (enthält bereits die Mitarbeiter-E-Mail)
- `{{message}}` - E-Mail-Text (enthält bereits die Mitarbeiter-E-Mail)
- `{{user_email}}` - E-Mail-Adresse des Mitarbeiters (für Reply-To)
- `{{csv_data}}` - CSV-Daten
- `{{entry_count}}` - Anzahl der Einträge
- `{{date}}` - Aktuelles Datum

### Schritt 4: Public Key kopieren

1. Im Dashboard: Klicken Sie auf **"Account"** → **"General"**
2. Scrollen Sie zu **"API Keys"**
3. Kopieren Sie die **Public Key** (z.B. `abcdefghijklmnop`)

### Schritt 5: Konfiguration in der App

1. Öffnen Sie die Datei `emailjs-config.js`
2. Tragen Sie die kopierten Werte ein:
   ```javascript
   const EMAILJS_CONFIG = {
       PUBLIC_KEY: 'Ihre_Public_Key_hier',
       SERVICE_ID: 'Ihre_Service_ID_hier',
       TEMPLATE_ID: 'Ihre_Template_ID_hier',
       RECIPIENT_EMAIL: 'karim.bandasch@gmail.com'  // Empfänger
   };
   ```

### Schritt 6: Mitarbeiter-E-Mail-Adresse eingeben

1. Öffnen Sie `index.html` im Browser
2. Klicken Sie auf das **⚙️ Einstellungs-Icon** oben rechts
3. Geben Sie Ihre E-Mail-Adresse ein (z.B. `max.mustermann@example.com`)
4. Klicken Sie auf "Speichern"
5. Diese E-Mail-Adresse wird dann im Betreff und Text der E-Mail verwendet, damit Karim weiß, von wem die E-Mail kommt

**Wichtig:** Jeder Mitarbeiter muss seine eigene E-Mail-Adresse eingeben!

### Schritt 7: Testen

1. Erstellen Sie einen Test-Eintrag
2. Klicken Sie auf "Exportieren" → "An Karim senden"
3. Die E-Mail sollte automatisch versendet werden!
4. Karim sieht im Betreff und Text, von welchem Mitarbeiter die E-Mail kommt

---

## Häufige Fehler

### "EmailJS is not configured"
- Lösung: Überprüfen Sie, ob alle Werte in `emailjs-config.js` eingetragen sind

### "Invalid Public Key"
- Lösung: Überprüfen Sie die Public Key im EmailJS-Dashboard

### "Template not found"
- Lösung: Überprüfen Sie die Template ID und Service ID

### E-Mail kommt nicht an
- Lösung: 
  - Überprüfen Sie den Spam-Ordner
  - Überprüfen Sie, ob der E-Mail-Service korrekt verbunden ist
  - Schauen Sie in die EmailJS-Logs im Dashboard

---

## Kosten

- **Kostenlos:** 200 E-Mails/Monat
- **Paid Plans:** Ab $15/Monat für mehr E-Mails

Für die meisten Anwendungen reicht der kostenlose Plan völlig aus!

---

## Sicherheit

- Die **Public Key** kann öffentlich im Code sein (ist sicher)
- Die **Service ID** und **Template ID** können auch öffentlich sein
- Die eigentliche E-Mail-Authentifizierung passiert auf EmailJS-Seite
- Sie müssen Ihren E-Mail-Service nur **einmal** bei EmailJS verbinden

---

## Weitere Informationen

- EmailJS Dokumentation: https://www.emailjs.com/docs/
- Support: https://www.emailjs.com/support/

