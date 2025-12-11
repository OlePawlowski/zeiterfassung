// Vercel Serverless Function mit Upstash Redis
// Upstash ist über Vercel Marketplace verfügbar

const { Redis } = require('@upstash/redis');

// Upstash wird automatisch über Umgebungsvariablen verbunden
// Diese werden von Vercel automatisch gesetzt, wenn Sie Upstash über Marketplace verbinden
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const ENTRIES_KEY = 'zeiterfassung:entries';

    switch (req.method) {
      case 'GET':
        // Alle Einträge abrufen
        let entries = await redis.get(ENTRIES_KEY) || [];
        
        // Filter anwenden
        const { employeeName, employeeEmail, dateFrom, dateTo } = req.query;
        if (employeeName) {
          entries = entries.filter(e => e.employeeName === employeeName);
        }
        if (employeeEmail) {
          entries = entries.filter(e => e.employeeEmail === employeeEmail);
        }
        if (dateFrom) {
          entries = entries.filter(e => e.datum >= dateFrom);
        }
        if (dateTo) {
          entries = entries.filter(e => e.datum <= dateTo);
        }
        
        // Sortieren nach Datum (neueste zuerst)
        entries.sort((a, b) => new Date(b.datum) - new Date(a.datum));
        
        res.status(200).json({ success: true, data: entries });
        break;

      case 'POST':
        // Neuen Eintrag erstellen
        const newEntry = {
          ...req.body,
          id: req.body.id || Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        entries = await redis.get(ENTRIES_KEY) || [];
        entries.push(newEntry);
        await redis.set(ENTRIES_KEY, entries);
        
        res.status(201).json({ success: true, data: newEntry });
        break;

      case 'PUT':
        // Eintrag aktualisieren
        const { id, ...updateData } = req.body;
        entries = await redis.get(ENTRIES_KEY) || [];
        const index = entries.findIndex(e => e.id === id);
        
        if (index !== -1) {
          entries[index] = {
            ...entries[index],
            ...updateData,
            updatedAt: new Date().toISOString()
          };
          await redis.set(ENTRIES_KEY, entries);
          res.status(200).json({ success: true, data: entries[index] });
        } else {
          res.status(404).json({ success: false, error: 'Eintrag nicht gefunden' });
        }
        break;

      case 'DELETE':
        // Eintrag löschen
        const { entryId } = req.query;
        entries = await redis.get(ENTRIES_KEY) || [];
        entries = entries.filter(e => e.id !== entryId);
        await redis.set(ENTRIES_KEY, entries);
        
        res.status(200).json({ success: true });
        break;

      default:
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

