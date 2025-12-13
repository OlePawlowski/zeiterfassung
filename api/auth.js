// Vercel Serverless Function für Authentifizierung mit MongoDB Atlas
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { client, db } = await connectToDatabase();
    const collection = db.collection('users');

    if (req.method === 'POST') {
      const { name, password, action } = req.body;

      if (action === 'register') {
        // Registrierung
        if (!name || !password) {
          return res.status(400).json({ success: false, error: 'Name und Passwort sind erforderlich' });
        }

        if (password.length < 6) {
          return res.status(400).json({ success: false, error: 'Passwort muss mindestens 6 Zeichen lang sein' });
        }

        // Prüfen ob Benutzer bereits existiert
        const existingUser = await collection.findOne({ name: name });
        if (existingUser) {
          return res.status(400).json({ success: false, error: 'Ein Benutzer mit diesem Namen existiert bereits' });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Neuen Benutzer erstellen
        const newUser = {
          name: name,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        await collection.insertOne(newUser);

        res.status(201).json({ 
          success: true, 
          data: { 
            name: newUser.name
          } 
        });
      } else if (action === 'login') {
        // Login
        if (!name || !password) {
          return res.status(400).json({ success: false, error: 'Name und Passwort sind erforderlich' });
        }

        // Benutzer finden
        const user = await collection.findOne({ name: name });
        if (!user) {
          return res.status(401).json({ success: false, error: 'Ungültiger Name oder Passwort' });
        }

        // Passwort prüfen
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ success: false, error: 'Ungültiger Name oder Passwort' });
        }

        // Letztes Login aktualisieren
        await collection.updateOne(
          { name: name },
          { $set: { lastLogin: new Date().toISOString() } }
        );

        res.status(200).json({ 
          success: true, 
          data: { 
            name: user.name
          } 
        });
      } else {
        return res.status(400).json({ success: false, error: 'Ungültige Aktion. Verwenden Sie "login" oder "register"' });
      }
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
