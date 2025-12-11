# Hosting-Anleitung für die Zeiterfassungs-App

> **NEU**: Siehe `VERCEL-SETUP.md` für die empfohlene Lösung mit Vercel + MongoDB!

# Hosting-Anleitung für die Zeiterfassungs-App

## Aktuelle Datenspeicherung

### Wie funktioniert es aktuell?

Die App verwendet **LocalStorage** im Browser:
- **Keine Datenbank** - Daten werden direkt im Browser gespeichert
- **Lokaler Speicher** - Jeder Browser hat seinen eigenen Speicher
- **SessionStorage** - Login-Status wird nur für die aktuelle Browser-Session gespeichert

### Vorteile:
✅ Kein Backend nötig  
✅ Funktioniert offline  
✅ Schnell und einfach  

### Nachteile:
❌ Daten sind nur lokal im Browser  
❌ Wenn Browser-Cache gelöscht wird → Daten weg  
❌ Jeder Benutzer hat nur seine eigenen Daten lokal  
❌ Keine zentrale Datenbank  
❌ Nicht für mehrere Geräte synchronisiert  

---

## Hosting-Optionen

### Option 1: Statisches Hosting (Einfach, aber mit Limitationen)

**Für wen:** Kleine Teams, interne Nutzung, Testphase

**Anbieter:**
- **GitHub Pages** (kostenlos)
- **Netlify** (kostenlos)
- **Vercel** (kostenlos)
- **Cloudflare Pages** (kostenlos)

**Vorgehen:**
1. Alle Dateien in einen Ordner packen
2. Auf GitHub hochladen
3. GitHub Pages aktivieren
4. Fertig!

**Limitationen:**
- Daten bleiben lokal im Browser
- Keine zentrale Datenbank
- Jeder Benutzer hat nur seine eigenen Daten

**Dateien zum Hochladen:**
```
index.html
admin.html
app.js
admin.js
styles.css
emailjs-config.js
```

---

### Option 2: Mit Backend-Datenbank (Empfohlen für Produktion)

**Für wen:** Produktive Nutzung, mehrere Benutzer, zentrale Datenverwaltung

#### Option 2a: Firebase (Google) - Einfachste Lösung

**Vorteile:**
- ✅ Kostenlos bis 1GB Daten
- ✅ Echte Datenbank (Firestore)
- ✅ Authentifizierung eingebaut
- ✅ Automatische Synchronisation
- ✅ Funktioniert offline

**Kosten:** Kostenlos bis 1GB, dann ~$25/Monat

**Was zu tun ist:**
1. Firebase-Projekt erstellen (https://firebase.google.com)
2. Firestore-Datenbank aktivieren
3. Authentifizierung aktivieren
4. App-Code anpassen (Firebase SDK einbinden)

#### Option 2b: Supabase - Open Source Alternative

**Vorteile:**
- ✅ Kostenlos bis 500MB Daten
- ✅ PostgreSQL-Datenbank
- ✅ Authentifizierung eingebaut
- ✅ Open Source

**Kosten:** Kostenlos bis 500MB, dann ab $25/Monat

#### Option 2c: Eigenes Backend (Node.js + MongoDB/PostgreSQL)

**Vorteile:**
- ✅ Vollständige Kontrolle
- ✅ Eigene Server
- ✅ Flexibel

**Nachteile:**
- ❌ Mehr Aufwand
- ❌ Server-Wartung nötig
- ❌ Hosting-Kosten

---

## Empfohlene Lösung für Sie

### Phase 1: Schnellstart (Jetzt)
**Statisches Hosting auf Netlify oder GitHub Pages**
- Einfach hochladen
- Funktioniert sofort
- Für Testphase perfekt

### Phase 2: Produktion (Später)
**Firebase oder Supabase**
- Echte Datenbank
- Zentrale Speicherung
- Alle Benutzer sehen alle Daten (Admin)
- Synchronisation zwischen Geräten

---

## Schritt-für-Schritt: Statisches Hosting (Netlify)

### 1. Vorbereitung
```bash
# Alle Dateien in einem Ordner
zeiterfassung/
  ├── index.html
  ├── admin.html
  ├── app.js
  ├── admin.js
  ├── styles.css
  └── emailjs-config.js
```

### 2. Netlify Account erstellen
1. Gehen Sie zu https://www.netlify.com
2. Klicken Sie auf "Sign up" (kostenlos)
3. Mit GitHub, Email oder Google anmelden

### 3. App hochladen
**Option A: Drag & Drop**
1. Netlify Dashboard öffnen
2. Dateien/Ordner per Drag & Drop hochladen
3. Fertig!

**Option B: GitHub**
1. Repository auf GitHub erstellen
2. Dateien hochladen
3. In Netlify: "New site from Git"
4. GitHub Repository verbinden
5. Deploy!

### 4. Domain (Optional)
- Netlify gibt automatisch eine URL: `ihre-app.netlify.app`
- Oder eigene Domain verbinden

---

## Schritt-für-Schritt: Firebase Setup (Für später)

### 1. Firebase-Projekt erstellen
1. Gehen Sie zu https://console.firebase.google.com
2. "Add project" klicken
3. Projektname eingeben
4. Google Analytics (optional)

### 2. Firestore aktivieren
1. Im Firebase Console: "Firestore Database"
2. "Create database" klicken
3. Test-Modus wählen (für Entwicklung)
4. Region wählen (z.B. europe-west)

### 3. Authentifizierung aktivieren
1. "Authentication" → "Get started"
2. "Email/Password" aktivieren

### 4. App verbinden
1. "Project Settings" → "Your apps"
2. Web-App hinzufügen
3. Firebase SDK einbinden
4. Code anpassen

**Benötigte Änderungen:**
- `app.js` und `admin.js` müssen Firebase SDK verwenden
- LocalStorage durch Firestore ersetzen
- Authentifizierung über Firebase

---

## Wichtige Hinweise

### Sicherheit
- ⚠️ **EmailJS-Konfiguration**: Public Keys können öffentlich sein, aber Service/Template IDs sollten geschützt werden
- ⚠️ **Admin-Passwort**: In `admin.js` ändern!
- ⚠️ **Firebase Rules**: Bei Firebase müssen Security Rules gesetzt werden

### Daten-Backup
- Bei LocalStorage: Kein automatisches Backup
- Bei Firebase/Supabase: Automatische Backups
- **Empfehlung**: Regelmäßig CSV-Export machen

### Performance
- LocalStorage: Sehr schnell, aber limitiert (~5-10MB)
- Firestore: Skaliert automatisch
- Supabase: PostgreSQL, sehr performant

---

## Vergleichstabelle

| Feature | LocalStorage (Aktuell) | Firebase | Supabase |
|---------|----------------------|----------|----------|
| **Kosten** | Kostenlos | Kostenlos bis 1GB | Kostenlos bis 500MB |
| **Datenbank** | ❌ Nein | ✅ Ja (Firestore) | ✅ Ja (PostgreSQL) |
| **Offline** | ✅ Ja | ✅ Ja | ⚠️ Begrenzt |
| **Synchronisation** | ❌ Nein | ✅ Ja | ✅ Ja |
| **Authentifizierung** | ❌ Manuell | ✅ Eingebaut | ✅ Eingebaut |
| **Setup-Aufwand** | ✅ Minimal | ⚠️ Mittel | ⚠️ Mittel |
| **Wartung** | ✅ Keine | ✅ Automatisch | ✅ Automatisch |

---

## Nächste Schritte

1. **Jetzt**: Statisches Hosting auf Netlify testen
2. **Später**: Firebase/Supabase für Produktion einrichten
3. **Code anpassen**: LocalStorage durch Datenbank ersetzen

**Brauchen Sie Hilfe beim Setup?** Ich kann Ihnen dabei helfen, die App für Firebase oder Supabase anzupassen!

