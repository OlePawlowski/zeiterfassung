# ✅ Deploy-Checkliste

## Vor dem Push auf GitHub

### ✅ Dateien prüfen
- [x] `index.html` - Mitarbeiter-Ansicht
- [x] `admin.html` - Admin-Dashboard
- [x] `app.js` - Mitarbeiter-Logik
- [x] `admin.js` - Admin-Logik
- [x] `styles.css` - Styling
- [x] `api/entries.js` - Backend API (Vercel KV)
- [x] `api/auth.js` - Authentifizierung API
- [x] `package.json` - Dependencies
- [x] `vercel.json` - Vercel Konfiguration
- [x] `.gitignore` - Git Konfiguration

### ✅ Konfiguration prüfen
- [ ] Admin-Passwort in `admin.js` geändert? (Zeile 2)
- [ ] EmailJS konfiguriert? (siehe `EMAILJS-SETUP.md`)
- [ ] Alle Dateien vorhanden?

### ✅ Dokumentation
- [x] `README.md` - Hauptdokumentation
- [x] `VERCEL-EINFACH.md` - Vercel Setup-Anleitung
- [x] `EMAILJS-SETUP.md` - EmailJS Anleitung
- [x] `HOSTING-ANLEITUNG.md` - Hosting-Übersicht

---

## GitHub Push

### 1. Repository erstellen
```bash
# Auf GitHub.com: Neues Repository erstellen
# Name: z.B. "zeiterfassung"
```

### 2. Dateien hochladen
```bash
cd "/Users/olepawlowski/Library/Mobile Documents/com~apple~CloudDocs/Work/Industriepackmittel/Zeiterfassung"

git init
git add .
git commit -m "Initial commit: Zeiterfassungs-App"
git branch -M main
git remote add origin https://github.com/IHR-USERNAME/zeiterfassung.git
git push -u origin main
```

**Oder über GitHub Web-Interface:**
1. Alle Dateien in einen Ordner packen
2. Auf GitHub hochladen (Drag & Drop)

---

## Vercel Setup

### 1. Vercel Account
- [ ] Account auf https://vercel.com erstellen
- [ ] Mit GitHub verbinden

### 2. Projekt importieren
- [ ] "Add New" → "Project"
- [ ] GitHub Repository auswählen
- [ ] "Import" klicken

### 3. Vercel KV aktivieren
- [ ] "Storage" → "Create Database"
- [ ] "KV" auswählen
- [ ] Name: `zeiterfassung-kv`
- [ ] Region wählen
- [ ] "Create" klicken

### 4. Deploy
- [ ] "Deploy" klicken
- [ ] Warten bis fertig (~1-2 Minuten)
- [ ] URL notieren: `ihre-app.vercel.app`

---

## Nach dem Deploy

### ✅ Testen
- [ ] App öffnen: `https://ihre-app.vercel.app`
- [ ] Mitarbeiter-Login testen
- [ ] Eintrag erstellen
- [ ] Admin-Login testen
- [ ] Einträge im Admin sehen
- [ ] Export testen

### ✅ EmailJS (Optional)
- [ ] EmailJS einrichten (siehe `EMAILJS-SETUP.md`)
- [ ] E-Mail-Versand testen

---

## Wichtige URLs

Nach dem Deploy erhalten Sie:
- **App URL**: `https://ihre-app.vercel.app`
- **Admin URL**: `https://ihre-app.vercel.app/admin.html`

---

## Troubleshooting

### Problem: API funktioniert nicht
- ✅ Vercel KV aktiviert?
- ✅ `package.json` korrekt?
- ✅ Vercel Logs prüfen

### Problem: Daten werden nicht gespeichert
- ✅ Vercel KV Storage aktiv?
- ✅ Browser-Konsole prüfen
- ✅ Network-Tab im Browser prüfen

### Problem: CORS-Fehler
- ✅ API hat CORS-Headers (bereits implementiert)
- ✅ Vercel Logs prüfen

---

## Fertig! 🎉

Ihre App ist jetzt live und bereit für die Nutzung!

