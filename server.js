import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const YAHOO_ENDPOINT = "https://query1.finance.yahoo.com/v7/finance/quote";

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.get("/google", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) {
    return res.status(400).json({ error: "symbol query param required" });
  }
  const upstream = `https://finance.google.com/finance?output=json&q=${encodeURIComponent(symbol)}`;
  try {
    const response = await fetch(upstream);
    if (!response.ok) throw new Error(`Google upstream ${response.status}`);
    const text = await response.text();
    const payload = JSON.parse(text.replace(/^\/+/, ""));
    return res.json(payload);
  } catch (error) {
    console.error("[proxy] google fetch failed:", error);
    return res.status(502).json({ error: error.message });
  }
});

app.get("/yahoo", async (req, res) => {
  const symbols = req.query.symbols;
  if (!symbols) {
    return res.status(400).json({ error: "symbols query param required" });
  }

  const upstream = `${YAHOO_ENDPOINT}?symbols=${encodeURIComponent(symbols)}`;
  try {
    const response = await fetch(upstream, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Yahoo upstream ${response.status}`);
    const payload = await response.json();
    return res.json(payload);
  } catch (error) {
    console.error("[proxy] yahoo fetch failed:", error);
    return res.status(502).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on ${PORT}`);
});
