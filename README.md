# 🚛 Zeiterfassungs-App für Spedition

Moderne Web-App zur digitalen Zeiterfassung für Speditions-Mitarbeiter.

## ✨ Features

- 👤 **Mitarbeiter-Login** - Jeder Mitarbeiter kann sich an- und abmelden
- 📝 **Fahrten erfassen** - Datum, Strecke, Fahrtart, Bemerkungen
- 📊 **Admin-Dashboard** - Karim kann alle Fahrten aller Mitarbeiter sehen
- 🔍 **Filter & Suche** - Nach Mitarbeiter, Datum filtern
- 📥 **Export** - CSV-Export für Excel
- ✉️ **E-Mail-Versand** - Automatischer Versand an Karim (mit EmailJS)
- 🎨 **Modernes Design** - Dunkles Apple Liquid Glass Design

## 🚀 Schnellstart

### Option 1: Lokal testen (ohne Backend)

1. Alle Dateien in einen Ordner kopieren
2. `index.html` im Browser öffnen
3. Fertig!

**Hinweis:** Daten werden nur lokal im Browser gespeichert.

### Option 2: Mit Backend (Vercel + Vercel KV) - EMPFOHLEN

Siehe `VERCEL-EINFACH.md` für die komplette Anleitung.

**Kurzfassung:**
1. GitHub Repository erstellen
2. Dateien hochladen
3. Vercel verbinden
4. Vercel KV aktivieren (ein Klick!)
5. Deploy!

**Keine externe Datenbank nötig!** Alles direkt in Vercel.

## 📁 Dateistruktur

```
zeiterfassung/
├── index.html              # Mitarbeiter-Ansicht
├── admin.html              # Admin-Dashboard
├── app.js                  # Mitarbeiter-Logik
├── admin.js                # Admin-Logik
├── styles.css              # Styling
├── emailjs-config.js       # EmailJS Konfiguration
├── api/                    # Backend API (Vercel Serverless)
│   ├── entries.js          # Einträge-API (Vercel KV)
│   └── auth.js             # Authentifizierung-API (Vercel KV)
├── api-client.js           # API Client Helper
├── package.json             # Node.js Dependencies
├── vercel.json              # Vercel Konfiguration
├── .gitignore               # Git Konfiguration
├── README.md                # Diese Datei
├── VERCEL-EINFACH.md        # Vercel Setup (EMPFOHLEN)
├── DEPLOY-CHECKLIST.md      # Deploy-Checkliste
├── EMAILJS-SETUP.md         # EmailJS Anleitung
└── HOSTING-ANLEITUNG.md     # Hosting-Übersicht
```

## 🔧 Konfiguration

### EmailJS (für E-Mail-Versand)

1. Siehe `EMAILJS-SETUP.md` für Anleitung
2. `emailjs-config.js` mit Ihren Daten füllen

### Admin-Passwort

In `admin.js` Zeile 2 ändern:
```javascript
const ADMIN_PASSWORD = 'IhrSicheresPasswort';
```

### MongoDB (für Backend)

1. Siehe `VERCEL-SETUP.md` für Anleitung
2. Connection String in Vercel als Umgebungsvariable setzen

## 📚 Dokumentation

- `HOSTING-ANLEITUNG.md` - Übersicht aller Hosting-Optionen
- `VERCEL-SETUP.md` - Schritt-für-Schritt Vercel + MongoDB Setup
- `EMAILJS-SETUP.md` - EmailJS Einrichtung

## 🛠️ Technologie-Stack

**Frontend:**
- Vanilla JavaScript
- HTML5 / CSS3
- LocalStorage (aktuell) / API (mit Backend)

**Backend (Optional):**
- Vercel Serverless Functions
- MongoDB Atlas

**Services:**
- EmailJS (für E-Mail-Versand)

## 📝 Verwendung

### Als Mitarbeiter:
1. `index.html` öffnen
2. Mit Name und E-Mail anmelden
3. Fahrten erfassen
4. Exportieren oder an Karim senden

### Als Admin (Karim):
1. `admin.html` öffnen
2. Mit Passwort anmelden
3. Alle Fahrten sehen, filtern, exportieren

## 🔒 Sicherheit

- ⚠️ Admin-Passwort in Produktion ändern!
- ⚠️ EmailJS-Konfiguration nicht öffentlich teilen
- ⚠️ MongoDB Connection String sicher aufbewahren
- ⚠️ Bei Vercel: Umgebungsvariablen verwenden

## 📞 Support

Bei Fragen oder Problemen:
1. Dokumentation in den `.md` Dateien lesen
2. Code-Kommentare prüfen
3. Browser-Konsole für Fehler prüfen

## 📄 Lizenz

Für interne Nutzung.

---

**Erstellt für:** Spedition  
**Version:** 1.0.0

