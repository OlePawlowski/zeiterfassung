// Alternative: Datei-basierte Speicherung (falls Vercel KV nicht verfügbar)
// Speichert Daten in einer JSON-Datei auf dem Server

const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = '/tmp/zeiterfassung-data.json';

async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Datei existiert noch nicht
    return { entries: [], users: [] };
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

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
    const data = await readData();
    let entries = data.entries || [];

    switch (req.method) {
      case 'GET':
        // Filter anwenden
        const { employeeName, employeeEmail, dateFrom, dateTo } = req.query;
        let filtered = [...entries];
        
        if (employeeName) {
          filtered = filtered.filter(e => e.employeeName === employeeName);
        }
        if (employeeEmail) {
          filtered = filtered.filter(e => e.employeeEmail === employeeEmail);
        }
        if (dateFrom) {
          filtered = filtered.filter(e => e.datum >= dateFrom);
        }
        if (dateTo) {
          filtered = filtered.filter(e => e.datum <= dateTo);
        }
        
        filtered.sort((a, b) => new Date(b.datum) - new Date(a.datum));
        
        res.status(200).json({ success: true, data: filtered });
        break;

      case 'POST':
        const newEntry = {
          ...req.body,
          id: req.body.id || Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        entries.push(newEntry);
        data.entries = entries;
        await writeData(data);
        
        res.status(201).json({ success: true, data: newEntry });
        break;

      case 'PUT':
        const { id, ...updateData } = req.body;
        const index = entries.findIndex(e => e.id === id);
        
        if (index !== -1) {
          entries[index] = {
            ...entries[index],
            ...updateData,
            updatedAt: new Date().toISOString()
          };
          data.entries = entries;
          await writeData(data);
          res.status(200).json({ success: true, data: entries[index] });
        } else {
          res.status(404).json({ success: false, error: 'Eintrag nicht gefunden' });
        }
        break;

      case 'DELETE':
        const { entryId } = req.query;
        entries = entries.filter(e => e.id !== entryId);
        data.entries = entries;
        await writeData(data);
        
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


