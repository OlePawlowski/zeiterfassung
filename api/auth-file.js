// Alternative: Datei-basierte Authentifizierung (falls Vercel KV nicht verfügbar)

const fs = require('fs').promises;

const DATA_FILE = '/tmp/zeiterfassung-data.json';

async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const data = await readData();
    let users = data.users || [];

    if (req.method === 'POST') {
      const { name, email, action } = req.body;

      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name und E-Mail sind erforderlich' });
      }

      let user = users.find(u => u.email === email);

      if (action === 'register' || !user) {
        user = {
          name: name,
          email: email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        users.push(user);
      } else {
        user.lastLogin = new Date().toISOString();
        const userIndex = users.findIndex(u => u.email === email);
        users[userIndex] = user;
      }

      data.users = users;
      await writeData(data);

      res.status(200).json({ 
        success: true, 
        data: { 
          name: user.name, 
          email: user.email 
        } 
      });
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

