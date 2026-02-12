// Vercel Serverless Function - HTTPS Proxy for ArcisAI Sales Agent
// Forwards requests from HTTPS (Vercel) to HTTP backend (DigitalOcean)

const BACKEND_URL = "http://139.59.28.88:8000/api/leads/webhook";

module.exports = async (req, res) => {
  // CORS headers - allow arcisai.io
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, api-key");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": req.headers["api-key"] || "default-api-key",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    return res.status(502).json({ error: "Backend unreachable", details: error.message });
  }
};
