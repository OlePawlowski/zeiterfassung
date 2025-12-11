# 🚀 Upstash Setup - Schritt für Schritt

## Warum Upstash?

✅ **Kostenlos** bis 10.000 Requests/Tag  
✅ **Einfach** - Ähnlich wie Vercel KV  
✅ **Schnell** - Redis-basiert  
✅ **Direkt in Vercel** - Über Marketplace verbinden  

---

## Schritt 1: Upstash über Vercel Marketplace verbinden

### 1.1 In Vercel Dashboard
1. Gehen Sie zu Ihrem Projekt
2. Klicken Sie auf **"Storage"** Tab
3. Klicken Sie auf **"Browse Storage"** oder **"Create Database"**

### 1.2 Upstash auswählen
1. Im Modal: Scrollen Sie zu **"Marketplace Database Providers"**
2. Klicken Sie auf **"Upstash"**
3. Klicken Sie auf **"Continue"**

### 1.3 Upstash konfigurieren
1. **Name**: z.B. `zeiterfassung-redis`
2. **Region**: Wählen Sie eine Region (z.B. `eu-central-1` für Frankfurt)
3. **Plan**: **Free** wählen (10.000 Requests/Tag kostenlos)
4. Klicken Sie auf **"Create"** oder **"Add"**

**Fertig!** Vercel verbindet automatisch Upstash mit Ihrem Projekt.

---

## Schritt 2: Umgebungsvariablen prüfen

Nach dem Verbinden setzt Vercel automatisch:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Diese werden automatisch in Ihren Serverless Functions verfügbar sein.

**Prüfen:**
1. Vercel Dashboard → Projekt → **"Settings"** → **"Environment Variables"**
2. Sollten automatisch vorhanden sein

---

## Schritt 3: API-Dateien umbenennen

Die Upstash-Versionen verwenden:

```bash
# Im Projektordner
cd "/Users/olepawlowski/Library/Mobile Documents/com~apple~CloudDocs/Work/Industriepackmittel/Zeiterfassung"

# Upstash-Versionen aktivieren
mv api/entries.js api/entries-kv.js
mv api/entries-upstash.js api/entries.js

mv api/auth.js api/auth-kv.js
mv api/auth-upstash.js api/auth.js
```

---

## Schritt 4: Neu deployen

```bash
git add .
git commit -m "Switch to Upstash Redis"
git push
```

Vercel deployt automatisch neu!

---

## Schritt 5: Testen

1. App öffnen: `https://ihre-app.vercel.app`
2. Mitarbeiter-Login testen
3. Eintrag erstellen
4. Prüfen ob gespeichert wird

---

## Kosten

**Upstash Free Tier:**
- ✅ 10.000 Requests/Tag kostenlos
- ✅ 256MB Speicher
- ✅ Perfekt für kleine bis mittlere Apps

**Für Ihre App reicht das völlig aus!**

---

## Troubleshooting

### Problem: Umgebungsvariablen fehlen
- ✅ Prüfen Sie Vercel Settings → Environment Variables
- ✅ Sollten automatisch nach Upstash-Verbindung vorhanden sein

### Problem: API gibt Fehler
- ✅ Vercel Logs prüfen (Deployments → Logs)
- ✅ Prüfen ob `@upstash/redis` in package.json ist

### Problem: Daten werden nicht gespeichert
- ✅ Upstash Dashboard prüfen (über Vercel Marketplace)
- ✅ Browser-Konsole prüfen

---

## Alternative: Datei-basierte Version

Falls Upstash nicht funktioniert, können Sie die Datei-Version verwenden:

```bash
mv api/entries.js api/entries-upstash.js
mv api/entries-file.js api/entries.js

mv api/auth.js api/auth-upstash.js
mv api/auth-file.js api/auth.js
```

---

## Fertig! 🎉

Nach dem Setup funktioniert alles automatisch. Die Daten werden in Upstash Redis gespeichert!

