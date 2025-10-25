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

app.get("/", (req, res) => {
  res.type("html").send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>AI Stock Analysis Proxy</title>
        <style>
          body {
            font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
            min-height: 100vh;
            display: grid;
            place-items: center;
            margin: 0;
            background: #0f172a;
            color: #e2e8f0;
          }
          main {
            max-width: 520px;
            padding: 2.5rem;
            border-radius: 1.25rem;
            background: rgba(15, 23, 42, 0.8);
            box-shadow: 0 30px 60px rgba(2, 6, 23, 0.45);
          }
          h1 {
            margin-top: 0;
            font-size: 1.9rem;
            letter-spacing: -0.03em;
          }
          code, a {
            color: #38bdf8;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>AI Stock Analysis Proxy</h1>
          <p>This Render service powers the dashboard&rsquo;s cross-origin requests.</p>
          <p>Use the JSON APIs directly if needed:</p>
          <ul>
            <li><code>/google?symbol=NASDAQ:AAPL</code></li>
            <li><code>/yahoo?symbols=AAPL,MSFT</code></li>
          </ul>
          <p>Point <code>window.STOCK_PROXY_URL</code> at this base URL in the dashboard to enable live quotes.</p>
        </main>
      </body>
    </html>
  `);
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on ${PORT}`);
});
