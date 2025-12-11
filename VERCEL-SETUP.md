# Vercel + MongoDB Setup-Anleitung

> **💡 EINFACHERE LÖSUNG:** Siehe `VERCEL-EINFACH.md` für Vercel KV (keine externe Datenbank nötig!)

# Vercel + MongoDB Setup-Anleitung

## Übersicht

Diese Lösung verwendet:
- **Vercel** für Frontend-Hosting und Serverless Functions (Backend-API)
- **MongoDB Atlas** für die Datenbank (kostenlos bis 512MB)

## Schritt 1: MongoDB Atlas einrichten (Kostenlos)

### 1.1 Account erstellen
1. Gehen Sie zu https://www.mongodb.com/cloud/atlas
2. Klicken Sie auf "Try Free"
3. Registrieren Sie sich (kostenlos)

### 1.2 Cluster erstellen
1. Nach Login: "Build a Database" klicken
2. **Free Tier** wählen (M0 Sandbox)
3. Cloud Provider: AWS
4. Region: Wählen Sie eine Region nahe Ihrer Nutzer (z.B. Frankfurt)
5. Cluster Name: z.B. "Zeiterfassung"
6. "Create" klicken

### 1.3 Datenbank-Benutzer erstellen
1. "Database Access" im Menü
2. "Add New Database User"
3. Username: z.B. `zeiterfassung-user`
4. Password: Starkes Passwort generieren (speichern!)
5. Database User Privileges: "Read and write to any database"
6. "Add User" klicken

### 1.4 Netzwerk-Zugriff konfigurieren
1. "Network Access" im Menü
2. "Add IP Address"
3. Für Entwicklung: "Add Current IP Address"
4. Für Produktion: "Allow Access from Anywhere" (0.0.0.0/0)
5. "Confirm" klicken

### 1.5 Connection String erhalten
1. "Database" → "Connect"
2. "Connect your application" wählen
3. Driver: Node.js, Version: 4.1 or later
4. Connection String kopieren:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```
5. **WICHTIG**: `<username>` und `<password>` durch Ihre Daten ersetzen!

---

## Schritt 2: GitHub Repository erstellen

### 2.1 Repository auf GitHub
1. Gehen Sie zu https://github.com
2. "New repository" erstellen
3. Name: z.B. `zeiterfassung`
4. "Public" oder "Private" wählen
5. Repository erstellen

### 2.2 Dateien hochladen
```bash
# Im Terminal im Projektordner
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/IHR-USERNAME/zeiterfassung.git
git push -u origin main
```

Oder über GitHub Web-Interface:
1. Alle Dateien in den Ordner packen
2. Auf GitHub hochladen

---

## Schritt 3: Vercel einrichten

### 3.1 Vercel Account erstellen
1. Gehen Sie zu https://vercel.com
2. "Sign Up" (kostenlos)
3. Mit GitHub anmelden (empfohlen)

### 3.2 Projekt importieren
1. Vercel Dashboard → "Add New" → "Project"
2. GitHub Repository auswählen
3. "Import" klicken

### 3.3 Umgebungsvariablen setzen
1. In Vercel: "Settings" → "Environment Variables"
2. Folgende Variablen hinzufügen:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB = zeiterfassung
ADMIN_PASSWORD = IhrSicheresPasswort
```

**WICHTIG**: 
- `username` und `password` durch Ihre MongoDB-Daten ersetzen!
- Keine Anführungszeichen um den Connection String!

### 3.4 Deploy
1. "Deploy" klicken
2. Warten bis Deployment fertig ist
3. Fertig! Sie erhalten eine URL: `ihre-app.vercel.app`

---

## Schritt 4: Code anpassen (Optional)

Die API-Endpunkte sind bereits erstellt:
- `GET /api/entries` - Alle Einträge abrufen
- `POST /api/entries` - Neuen Eintrag erstellen
- `PUT /api/entries` - Eintrag aktualisieren
- `DELETE /api/entries` - Eintrag löschen
- `POST /api/auth` - Login/Registrierung

Sie müssen nur noch `app.js` und `admin.js` anpassen, um die API zu verwenden statt LocalStorage.

---

## Schritt 5: Frontend anpassen (Für später)

Aktuell verwendet die App noch LocalStorage. Um die API zu nutzen:

1. **API-Helper-Funktionen erstellen** in `app.js`:
```javascript
const API_BASE = window.location.origin;

async function fetchEntries() {
  const response = await fetch(`${API_BASE}/api/entries`);
  const result = await response.json();
  return result.data;
}

async function createEntry(entry) {
  const response = await fetch(`${API_BASE}/api/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  const result = await response.json();
  return result.data;
}
```

2. **LocalStorage durch API-Calls ersetzen**

---

## Kosten

### Vercel
- ✅ **Kostenlos** für:
  - Unbegrenzte Projekte
  - 100GB Bandbreite/Monat
  - Serverless Functions
  - Automatische Deployments

### MongoDB Atlas
- ✅ **Kostenlos** (M0 Tier):
  - 512MB Speicher
  - Shared RAM
  - Perfekt für kleine bis mittlere Apps

---

## Vorteile dieser Lösung

✅ **Kostenlos** (für kleine Apps)  
✅ **Skalierbar** (wächst mit Bedarf)  
✅ **Echte Datenbank** (MongoDB)  
✅ **Automatische Deployments** (bei Git Push)  
✅ **CDN** (schnelle Ladezeiten weltweit)  
✅ **HTTPS** automatisch  
✅ **Eigene Domain** möglich  

---

## Nächste Schritte

1. ✅ MongoDB Atlas einrichten
2. ✅ GitHub Repository erstellen
3. ✅ Vercel verbinden
4. ⚠️ Frontend-Code anpassen (LocalStorage → API)
5. ✅ Testen!

**Brauchen Sie Hilfe beim Anpassen des Frontend-Codes?** Ich kann Ihnen dabei helfen!

