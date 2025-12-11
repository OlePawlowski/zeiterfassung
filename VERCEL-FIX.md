# 🔧 Vercel Probleme beheben

## Problem 1: Storage Reiter nicht gefunden

Vercel KV ist möglicherweise nicht in allen Vercel-Plänen verfügbar oder heißt anders.

### Lösung A: Vercel KV finden

1. In Vercel Dashboard: **"Storage"** Tab (kann auch "Databases" heißen)
2. Oder: **"Settings"** → **"Storage"**
3. Falls nicht vorhanden: Sie benötigen möglicherweise einen Pro-Plan

### Lösung B: Alternative ohne Vercel KV

Ich habe eine **datei-basierte Lösung** erstellt, die ohne Vercel KV funktioniert:

1. `api/entries.js` durch `api/entries-file.js` ersetzen
2. `api/auth.js` durch `api/auth-file.js` ersetzen

**Hinweis:** Diese Lösung speichert in `/tmp` (temporär), daher:
- ✅ Funktioniert sofort
- ⚠️ Daten können bei Server-Neustart verloren gehen
- 💡 Für Produktion: Später auf echte Datenbank wechseln

---

## Problem 2: 404 NOT_FOUND Fehler

### Mögliche Ursachen:

1. **API-Routen funktionieren nicht**
   - Prüfen Sie die Vercel Logs
   - API-Dateien müssen im `/api` Ordner sein

2. **Vercel KV nicht konfiguriert**
   - Falls Vercel KV nicht verfügbar ist, verwenden Sie die Datei-Version

### Lösung:

**Option 1: Vercel KV verwenden (wenn verfügbar)**
- Storage → Create Database → KV
- Umgebungsvariablen werden automatisch gesetzt

**Option 2: Datei-basierte Version (sofort verfügbar)**
- Siehe Lösung B oben

---

## Problem 3: Builds Warnung

✅ **Bereits behoben!** Die `vercel.json` wurde korrigiert.

---

## Schnelle Lösung: Datei-basierte Version verwenden

### Schritt 1: Dateien umbenennen

```bash
# Im Projektordner
mv api/entries.js api/entries-kv.js
mv api/entries-file.js api/entries.js

mv api/auth.js api/auth-kv.js  
mv api/auth-file.js api/auth.js
```

### Schritt 2: package.json anpassen

Die Datei-Version braucht keine speziellen Dependencies.

### Schritt 3: Neu deployen

```bash
git add .
git commit -m "Switch to file-based storage"
git push
```

---

## Empfohlene Lösung: Supabase (kostenlos, einfach)

Falls Vercel KV nicht funktioniert, ist **Supabase** die beste Alternative:

1. **Kostenlos** bis 500MB
2. **Einfache Einrichtung** (5 Minuten)
3. **Echte Datenbank** (PostgreSQL)
4. **Automatische API** generiert

**Soll ich die App für Supabase anpassen?** Das wäre die beste Lösung für Produktion!

---

## Aktuelle Dateien

- ✅ `api/entries.js` - Vercel KV Version
- ✅ `api/entries-file.js` - Datei-Version (Backup)
- ✅ `api/auth.js` - Vercel KV Version  
- ✅ `api/auth-file.js` - Datei-Version (Backup)

Sie können zwischen den Versionen wechseln, indem Sie die Dateien umbenennen.

