// Vercel Serverless Function mit Upstash Redis
// Upstash ist über Vercel Marketplace verfügbar

const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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
    const USERS_KEY = 'zeiterfassung:users';

    if (req.method === 'POST') {
      const { name, email, action } = req.body;

      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name und E-Mail sind erforderlich' });
      }

      let users = await redis.get(USERS_KEY) || [];
      let user = users.find(u => u.email === email);

      if (action === 'register' || !user) {
        // Neuen Benutzer erstellen
        user = {
          name: name,
          email: email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        users.push(user);
        await redis.set(USERS_KEY, users);
      } else {
        // Login - letztes Login aktualisieren
        user.lastLogin = new Date().toISOString();
        const userIndex = users.findIndex(u => u.email === email);
        users[userIndex] = user;
        await redis.set(USERS_KEY, users);
      }

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


