const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = "http://139.59.28.88:8000/api/leads/webhook";

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'arcisai-proxy' });
});

// Webhook proxy
app.post('/api/webhook', async (req, res) => {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': req.headers['api-key'] || 'default-api-key',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(502).json({ error: 'Backend unreachable', details: error.message });
  }
});

// Handle OPTIONS preflight
app.options('/api/webhook', cors());

app.listen(PORT, () => {
  console.log(`ArcisAI proxy running on port ${PORT}`);
});
