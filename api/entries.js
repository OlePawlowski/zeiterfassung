// Vercel Serverless Function für Einträge mit MongoDB Atlas
const { MongoClient } = require('mongodb');

// MongoDB Connection String aus Umgebungsvariablen
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'zeiterfassung';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI Umgebungsvariable fehlt!');
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(MONGODB_DB);
  cachedClient = client;
  cachedDb = db;

  return { client, db };
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
    const { client, db } = await connectToDatabase();
    const collection = db.collection('entries');

    switch (req.method) {
      case 'GET':
        // Alle Einträge abrufen (mit optionalen Filtern)
        const { employeeName, employeeEmail, dateFrom, dateTo } = req.query;
        let query = {};
        
        if (employeeName) query.employeeName = employeeName;
        if (employeeEmail) query.employeeEmail = employeeEmail;
        if (dateFrom || dateTo) {
          query.datum = {};
          if (dateFrom) query.datum.$gte = dateFrom;
          if (dateTo) query.datum.$lte = dateTo;
        }

        const entries = await collection.find(query).sort({ datum: -1 }).toArray();
        res.status(200).json({ success: true, data: entries });
        break;

      case 'POST':
        // Neuen Eintrag erstellen
        const newEntry = {
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const result = await collection.insertOne(newEntry);
        res.status(201).json({ success: true, data: { ...newEntry, _id: result.insertedId } });
        break;

      case 'PUT':
        // Eintrag aktualisieren
        const { id, ...updateData } = req.body;
        const updateResult = await collection.updateOne(
          { id: id },
          { 
            $set: { 
              ...updateData,
              updatedAt: new Date().toISOString()
            } 
          }
        );
        res.status(200).json({ success: true, data: updateResult });
        break;

      case 'DELETE':
        // Eintrag löschen
        const { entryId } = req.query;
        await collection.deleteOne({ id: entryId });
        res.status(200).json({ success: true });
        break;

      default:
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
