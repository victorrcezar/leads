import fetch from "node-fetch";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export default async function handler(req, res) {
  // CORS
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
    // GET (passa query params corretamente)
    if (req.method === "GET") {
      const url = `${APPS_SCRIPT_URL}?${new URLSearchParams(req.query).toString()}`;
      const r = await fetch(url);
      const text = await r.text();

      try {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: "Resposta do Apps Script não é JSON",
          raw: text
        });
      }
    }

    // POST
    if (req.method === "POST") {
      const r = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      });

      const text = await r.text();

      try {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      } catch {
        return res.status(500).json({
          success: false,
          error: "Resposta do Apps Script não é JSON",
          raw: text
        });
      }
    }

    return res.status(405).json({ success: false, error: "Método não permitido" });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
