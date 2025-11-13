import fetch from "node-fetch";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

  if (!APPS_SCRIPT_URL) {
    return res.status(500).json({
      success: false,
      error: "APPS_SCRIPT_URL não configurado."
    });
  }

  try {
    // GET → repassa corretamente os parâmetros
    if (req.method === "GET") {
      const qs = new URLSearchParams(req.query).toString();
      const url = `${APPS_SCRIPT_URL}?${qs}`;

      const response = await fetch(url);
      const text = await response.text();

      try {
        return res.status(200).json(JSON.parse(text));
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: "Resposta do Apps Script não é JSON",
          raw: text
        });
      }
    }

    // POST → rep
