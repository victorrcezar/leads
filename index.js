import fetch from "node-fetch";

/**
 * UP! PROXY — repassa requisições para o Apps Script e adiciona CORS.
 *
 * O endereço do Apps Script deve ficar em uma variável de ambiente APPS_SCRIPT_URL.
 */

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export default async function handler(req, res) {
  // CORS FULL
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (!APPS_SCRIPT_URL) {
    return res.status(500).json({ success: false, error: "APPS_SCRIPT_URL não configurado." });
  }

  try {
    // GET -> repassa query string para o Apps Script
    if (req.method === "GET") {
      const queryString = new URLSearchParams(req.query).toString();
      const url = queryString ? `${APPS_SCRIPT_URL}?${queryString}` : APPS_SCRIPT_URL;
      const r = await fetch(url);
      const data = await r.json();
      return res.status(200).json(data);
    }

    // POST -> repassa body para o Apps Script
    if (req.method === "POST") {
      const r = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    return res.status(405).json({ success: false, error: "Método não permitido" });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
