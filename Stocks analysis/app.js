const DEFAULT_PROXY_BASE = "http://127.0.0.1:3000";
const RAW_PROXY_BASE =
  typeof window !== "undefined" && window.STOCK_PROXY_URL
    ? String(window.STOCK_PROXY_URL)
    : DEFAULT_PROXY_BASE;
const PROXY_BASE_URL = RAW_PROXY_BASE.replace(/\/$/, "");
const LARGE_CAP_THRESHOLD = 5_000_000_000; // $5B

const TRENDING_TICKERS = [
  "NVDA",
  "AAPL",
  "MSFT",
  "TSLA",
  "GOOGL",
  "AMZN",
  "META",
  "NFLX",
  "TXN",
  "9988.HK",
  "0700.HK",
  "3690.HK",
  "NTES",
];

const FALLBACK_QUOTES = {
  NVDA: {
    longName: "NVIDIA Corporation",
    regularMarketPrice: 124.52,
    regularMarketChange: 2.34,
    regularMarketChangePercent: 1.92,
    regularMarketDayLow: 122.1,
    regularMarketDayHigh: 125.6,
    fiftyTwoWeekLow: 45.68,
    fiftyTwoWeekHigh: 135.68,
    regularMarketVolume: 48231000,
    marketCap: 3065400000000,
    exchangeSuffix: "NASDAQ",
  },
  AAPL: {
    longName: "Apple Inc.",
    regularMarketPrice: 230.01,
    regularMarketChange: 1.12,
    regularMarketChangePercent: 0.49,
    regularMarketDayLow: 227.4,
    regularMarketDayHigh: 231.98,
    fiftyTwoWeekLow: 162.8,
    fiftyTwoWeekHigh: 237.23,
    regularMarketVolume: 41250000,
    marketCap: 3520000000000,
    exchangeSuffix: "NASDAQ",
  },
  MSFT: {
    longName: "Microsoft Corporation",
    regularMarketPrice: 418.55,
    regularMarketChange: 1.83,
    regularMarketChangePercent: 0.44,
    regularMarketDayLow: 414.2,
    regularMarketDayHigh: 419.8,
    fiftyTwoWeekLow: 309.45,
    fiftyTwoWeekHigh: 433.6,
    regularMarketVolume: 27840000,
    marketCap: 3110000000000,
    exchangeSuffix: "NASDAQ",
  },
  TSLA: {
    longName: "Tesla, Inc.",
    regularMarketPrice: 238.71,
    regularMarketChange: -1.92,
    regularMarketChangePercent: -0.80,
    regularMarketDayLow: 233.4,
    regularMarketDayHigh: 242.7,
    fiftyTwoWeekLow: 146.22,
    fiftyTwoWeekHigh: 299.29,
    regularMarketVolume: 105670000,
    marketCap: 762000000000,
    exchangeSuffix: "NASDAQ",
  },
  GOOGL: {
    longName: "Alphabet Inc. Class A",
    regularMarketPrice: 183.45,
    regularMarketChange: 0.88,
    regularMarketChangePercent: 0.48,
    regularMarketDayLow: 181.7,
    regularMarketDayHigh: 184.9,
    fiftyTwoWeekLow: 121.46,
    fiftyTwoWeekHigh: 191.9,
    regularMarketVolume: 24030000,
    marketCap: 2280000000000,
    exchangeSuffix: "NASDAQ",
  },
  AMZN: {
    longName: "Amazon.com, Inc.",
    regularMarketPrice: 179.82,
    regularMarketChange: 1.25,
    regularMarketChangePercent: 0.70,
    regularMarketDayLow: 176.4,
    regularMarketDayHigh: 180.5,
    fiftyTwoWeekLow: 118.35,
    fiftyTwoWeekHigh: 189.77,
    regularMarketVolume: 48250000,
    marketCap: 1870000000000,
    exchangeSuffix: "NASDAQ",
  },
  META: {
    longName: "Meta Platforms, Inc.",
    regularMarketPrice: 514.32,
    regularMarketChange: 6.72,
    regularMarketChangePercent: 1.33,
    regularMarketDayLow: 505.2,
    regularMarketDayHigh: 516.8,
    fiftyTwoWeekLow: 274.38,
    fiftyTwoWeekHigh: 542.9,
    regularMarketVolume: 16840000,
    marketCap: 1290000000000,
    exchangeSuffix: "NASDAQ",
  },
  NFLX: {
    longName: "Netflix, Inc.",
    regularMarketPrice: 656.12,
    regularMarketChange: -4.85,
    regularMarketChangePercent: -0.73,
    regularMarketDayLow: 649.3,
    regularMarketDayHigh: 662.4,
    fiftyTwoWeekLow: 344.73,
    fiftyTwoWeekHigh: 697.6,
    regularMarketVolume: 5380000,
    marketCap: 280000000000,
    exchangeSuffix: "NASDAQ",
  },
  TXN: {
    longName: "Texas Instruments Incorporated",
    regularMarketPrice: 194.78,
    regularMarketChange: 1.28,
    regularMarketChangePercent: 0.66,
    regularMarketDayLow: 191.2,
    regularMarketDayHigh: 195.6,
    fiftyTwoWeekLow: 139.5,
    fiftyTwoWeekHigh: 206.0,
    regularMarketVolume: 4780000,
    marketCap: 177000000000,
    exchangeSuffix: "NASDAQ",
  },
  "0700.HK": {
    longName: "Tencent Holdings Limited",
    regularMarketPrice: 312.4,
    regularMarketChange: 4.2,
    regularMarketChangePercent: 1.36,
    regularMarketDayLow: 307.6,
    regularMarketDayHigh: 315.2,
    fiftyTwoWeekLow: 252.8,
    fiftyTwoWeekHigh: 384.2,
    regularMarketVolume: 14560000,
    marketCap: 3020000000000,
    exchangeSuffix: "HKG",
  },
  "9988.HK": {
    longName: "Alibaba Group Holding Limited",
    regularMarketPrice: 82.65,
    regularMarketChange: -1.12,
    regularMarketChangePercent: -1.34,
    regularMarketDayLow: 81.3,
    regularMarketDayHigh: 84.2,
    fiftyTwoWeekLow: 60.2,
    fiftyTwoWeekHigh: 99.9,
    regularMarketVolume: 23800000,
    marketCap: 1760000000000,
    exchangeSuffix: "HKG",
  },
  "3690.HK": {
    longName: "Meituan",
    regularMarketPrice: 110.4,
    regularMarketChange: 3.1,
    regularMarketChangePercent: 2.89,
    regularMarketDayLow: 106.2,
    regularMarketDayHigh: 111.5,
    fiftyTwoWeekLow: 88.0,
    fiftyTwoWeekHigh: 163.3,
    regularMarketVolume: 18640000,
    marketCap: 678000000000,
    exchangeSuffix: "HKG",
  },
  NTES: {
    longName: "NetEase, Inc.",
    regularMarketPrice: 96.72,
    regularMarketChange: -0.42,
    regularMarketChangePercent: -0.43,
    regularMarketDayLow: 95.2,
    regularMarketDayHigh: 98.6,
    fiftyTwoWeekLow: 68.0,
    fiftyTwoWeekHigh: 118.9,
    regularMarketVolume: 3850000,
    marketCap: 65000000000,
    exchangeSuffix: "NASDAQ",
  },
};

const MARKET_SUFFIXES = [
  "",
  ".HK",
  ".SZ",
  ".SS",
  ".L",
  ".TO",
  ".AX",
  ".T",
  ".PA",
  ".F",
];

const SEASONS = {
  spring: { className: "theme-season-spring", label: "Spring" },
  summer: { className: "theme-season-summer", label: "Summer" },
  fall: { className: "theme-season-fall", label: "Fall" },
  winter: { className: "theme-season-winter", label: "Winter" },
};

const THEMES = {
  light: { className: "theme-light" },
  dark: { className: "theme-dark" },
  peach: { className: "theme-peach" },
  tan: { className: "theme-tan" },
};

const DEFAULT_SETTINGS = {
  theme: "seasonal",
  refreshMinutes: 60,
  rankingMode: "daily",
  showWatchlist: true,
  highlightFuture: true,
  openLinksInNewTab: true,
};

const SETTINGS_STORAGE_KEY = "stocks-dashboard-settings";

let settingsState = loadSettings();
let refreshTimer = null;

function loadSettings() {
  if (typeof localStorage === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_SETTINGS, ...parsed };
    if (!Object.prototype.hasOwnProperty.call(THEMES, merged.theme) && merged.theme !== "seasonal") {
      merged.theme = DEFAULT_SETTINGS.theme;
    }
    if (typeof merged.refreshMinutes !== "number" || !Number.isFinite(merged.refreshMinutes) || merged.refreshMinutes <= 0) {
      merged.refreshMinutes = DEFAULT_SETTINGS.refreshMinutes;
    }
    if (!["daily", "momentum"].includes(merged.rankingMode)) {
      merged.rankingMode = DEFAULT_SETTINGS.rankingMode;
    }
    merged.showWatchlist = Boolean(merged.showWatchlist);
    merged.highlightFuture = Boolean(merged.highlightFuture);
    merged.openLinksInNewTab = merged.openLinksInNewTab !== false;
    return merged;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsState));
  } catch {
    /* ignore storage errors */
  }
}

function detectSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return SEASONS.spring;
  if (month >= 5 && month <= 7) return SEASONS.summer;
  if (month >= 8 && month <= 10) return SEASONS.fall;
  return SEASONS.winter;
}

function applyTheme(theme) {
  const body = document.body;
  body.classList.remove(
    "theme-light",
    "theme-dark",
    "theme-peach",
    "theme-tan",
    "theme-season-spring",
    "theme-season-summer",
    "theme-season-fall",
    "theme-season-winter"
  );

  let appliedClass = "theme-light";
  let seasonLabel = null;

  if (theme === "seasonal") {
    const season = detectSeason();
    appliedClass = season.className;
    seasonLabel = season.label;
  } else if (THEMES[theme]) {
    appliedClass = THEMES[theme].className;
  }

  body.classList.add(appliedClass);
  const seasonNote = document.querySelector(".season-note");
  const seasonLabelEl = document.getElementById("season-label");
  if (seasonNote && seasonLabelEl) {
    if (theme === "seasonal") {
      seasonNote.classList.add("visible");
      seasonLabelEl.textContent = seasonLabel ?? detectSeason().label;
    } else {
      seasonNote.classList.remove("visible");
      seasonLabelEl.textContent = "—";
    }
  }

}

const GOOGLE_FINANCE_ENDPOINT = `${PROXY_BASE_URL}/google?symbol=`;
const YAHOO_PROXY_ENDPOINT = `${PROXY_BASE_URL}/yahoo?symbols=`;

function parseAbbrevNumber(text) {
  if (!text) return null;
  const clean = String(text).trim();
  if (!clean) return null;
  const match = clean.match(/([+-]?[0-9]*\.?[0-9]+)\s*([KMBT]?)/i);
  if (!match) {
    const parsed = Number(clean.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  const value = parseFloat(match[1]);
  if (!Number.isFinite(value)) return null;
  const suffix = match[2].toUpperCase();
  const map = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
  return value * (map[suffix] || 1);
}

function buildGoogleQuery(symbol) {
  const upper = symbol.toUpperCase();
  if (upper.includes(".")) {
    const [base, suffix] = upper.split(".");
    const map = {
      HK: `HKG:${base}`,
      L: `LON:${base}`,
      TO: `TSE:${base}`,
      SZ: `SHE:${base}`,
      SS: `SHA:${base}`,
      PA: `EPA:${base}`,
      F: `FRA:${base}`,
      AX: `ASX:${base}`,
      T: `TYO:${base}`,
    };
    if (map[suffix]) return map[suffix];
    return `${suffix}:${base}`;
  }
  return `NASDAQ:${upper}`;
}

function parseGoogleQuote(symbol, raw, fallback) {
  if (!raw) return null;
  const price = parseFloat(raw.l_fix || raw.l || raw.price);
  const change = parseFloat(raw.c_fix || raw.c || raw.priceChange?.raw);
  const changePct = parseFloat(raw.cp_fix || raw.cp || raw.priceChangePercent?.raw);
  let dayLow = null;
  let dayHigh = null;
  if (raw.range) {
    const parts = raw.range.split(" - ");
    if (parts.length === 2) {
      dayLow = parseFloat(parts[0].replace(/,/g, ""));
      dayHigh = parseFloat(parts[1].replace(/,/g, ""));
    }
  }
  const volume = parseAbbrevNumber(raw.vo || raw.volume);
  const marketCap = parseAbbrevNumber(raw.mc || raw.market_cap);
  return normalizeQuote({
    symbol,
    longName: raw.name || raw.t || fallback?.longName,
    regularMarketPrice: Number.isFinite(price) ? price : fallback?.regularMarketPrice,
    regularMarketChange: Number.isFinite(change) ? change : fallback?.regularMarketChange,
    regularMarketChangePercent: Number.isFinite(changePct)
      ? changePct
      : fallback?.regularMarketChangePercent,
    regularMarketDayLow: Number.isFinite(dayLow)
      ? dayLow
      : fallback?.regularMarketDayLow,
    regularMarketDayHigh: Number.isFinite(dayHigh)
      ? dayHigh
      : fallback?.regularMarketDayHigh,
    fiftyTwoWeekLow: fallback?.fiftyTwoWeekLow,
    fiftyTwoWeekHigh: fallback?.fiftyTwoWeekHigh,
    regularMarketVolume: Number.isFinite(volume)
      ? volume
      : fallback?.regularMarketVolume,
    marketCap: Number.isFinite(marketCap) ? marketCap : fallback?.marketCap,
    exchangeSuffix: fallback?.exchangeSuffix,
  });
}

async function fetchGoogleQuote(symbol) {
  const query = buildGoogleQuery(symbol);
  const url = `${GOOGLE_FINANCE_ENDPOINT}${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, { cache: "no-store", mode: "cors" });
    if (!response.ok) throw new Error(`Google Finance request failed ${response.status}`);
    const text = await response.text();
    const jsonText = text.replace(/^\s*\/\//, "");
    const data = JSON.parse(jsonText);
    if (!Array.isArray(data) || !data.length) throw new Error("No Google Finance result");
    const fallback = FALLBACK_QUOTES[symbol];
    return parseGoogleQuote(symbol, data[0], fallback);
  } catch (error) {
    console.warn(`Google Finance fetch failed for ${symbol}:`, error);
    return null;
  }
}

function getFallbackQuote(symbol) {
  if (FALLBACK_QUOTES[symbol]) {
    return normalizeQuote({ symbol, ...FALLBACK_QUOTES[symbol] });
  }
  const base = symbol.includes(".") ? symbol.split(".")[0] : null;
  if (base && FALLBACK_QUOTES[base]) {
    return normalizeQuote({ symbol: base, ...FALLBACK_QUOTES[base] });
  }
  return null;
}

async function fetchYahooQuote(symbol) {
  const url = `${YAHOO_PROXY_ENDPOINT}${encodeURIComponent(symbol)}`;
  try {
    const response = await fetch(url, { cache: "no-store", mode: "cors" });
    if (!response.ok) throw new Error(`Yahoo Finance request failed ${response.status}`);
    const payload = await response.json();
    const result = payload?.quoteResponse?.result?.[0];
    if (!result) throw new Error("No Yahoo Finance result");
    return normalizeQuote({
      symbol: result.symbol || symbol,
      longName: result.longName || result.shortName || symbol,
      regularMarketPrice: result.regularMarketPrice,
      regularMarketChange: result.regularMarketChange,
      regularMarketChangePercent: result.regularMarketChangePercent,
      regularMarketDayLow: result.regularMarketDayLow,
      regularMarketDayHigh: result.regularMarketDayHigh,
      fiftyTwoWeekLow: result.fiftyTwoWeekLow,
      fiftyTwoWeekHigh: result.fiftyTwoWeekHigh,
      regularMarketVolume: result.regularMarketVolume,
      marketCap: result.marketCap,
      exchangeSuffix:
        result.exchangeSuffix ||
        result.exchange ||
        inferExchangeSuffix(result.fullExchangeName || ""),
    });
  } catch (error) {
    console.warn(`Yahoo Finance fetch failed for ${symbol}:`, error);
    return null;
  }
}

async function fetchQuotes(symbols) {
  const uniqueSymbols = [...new Set(symbols.filter(Boolean))];
  const results = await Promise.all(
    uniqueSymbols.map(async (symbol) => {
      const [googleResult, yahooResult] = await Promise.allSettled([
        fetchGoogleQuote(symbol),
        fetchYahooQuote(symbol),
      ]);
      const googleQuote =
        googleResult.status === "fulfilled" && googleResult.value ? googleResult.value : null;
      const yahooQuote =
        yahooResult.status === "fulfilled" && yahooResult.value ? yahooResult.value : null;
      return googleQuote || yahooQuote || getFallbackQuote(symbol);
    })
  );
  return results.filter(Boolean);
}

function scheduleRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(initDashboard, settingsState.refreshMinutes * 60 * 1000);
}

function applySettings() {
  applyTheme(settingsState.theme);
  document.body.classList.toggle("hide-watchlist", !settingsState.showWatchlist);
  document.body.classList.toggle("highlight-future", settingsState.highlightFuture);
  scheduleRefresh();
  saveSettings();
}

function openFinanceLink(quote) {
  const suffix = quote.exchangeSuffix || "NASDAQ";
  const url = `https://www.google.com/finance/quote/${encodeURIComponent(quote.symbol)}:${suffix}`;
  const target = settingsState.openLinksInNewTab ? "_blank" : "_self";
  const features = target === "_blank" ? "noopener" : undefined;
  window.open(url, target, features);
}

function getRankingScore(quote) {
  const pct = quote?.regularMarketChangePercent ?? 0;
  if (settingsState.rankingMode === "momentum") {
    const volumeFactor = quote?.regularMarketVolume ? Math.log10(quote.regularMarketVolume) / 10 : 0;
    const capFactor = quote?.marketCap ? Math.log10(quote.marketCap) / 14 : 0;
    return pct * (1 + volumeFactor + capFactor * 0.2);
  }
  return pct;
}

function getOutlook(quote) {
  const score = getRankingScore(quote);
  if (!Number.isFinite(score)) return { label: "Neutral", className: "ai-neutral" };
  if (score >= 8) return { label: "Strongly Bullish", className: "ai-strong-bull" };
  if (score >= 3) return { label: "Bullish", className: "ai-bull" };
  if (score <= -8) return { label: "Strongly Bearish", className: "ai-strong-bear" };
  if (score <= -3) return { label: "Bearish", className: "ai-bear" };
  return { label: "Neutral", className: "ai-neutral" };
}

function normalizeQuote(raw) {
  if (!raw) return null;
  const fallback = FALLBACK_QUOTES[raw.symbol];
  const base = fallback ? { ...fallback, ...raw } : raw;
  const exchangeSuffix =
    base.exchangeSuffix ||
    inferExchangeSuffix(base.fullExchangeName || base.exchange || "");
  return {
    symbol: base.symbol,
    longName: base.longName || base.shortName || base.symbol,
    regularMarketPrice: base.regularMarketPrice,
    regularMarketChange: base.regularMarketChange,
    regularMarketChangePercent: base.regularMarketChangePercent,
    regularMarketDayLow: base.regularMarketDayLow,
    regularMarketDayHigh: base.regularMarketDayHigh,
    fiftyTwoWeekLow: base.fiftyTwoWeekLow,
    fiftyTwoWeekHigh: base.fiftyTwoWeekHigh,
    regularMarketVolume: base.regularMarketVolume,
    marketCap: base.marketCap,
    exchangeSuffix,
  };
}

function inferExchangeSuffix(exchange) {
  const mapping = [
    { suffix: "NASDAQ", tokens: ["NASDAQ", "NMS", "NGM"] },
    { suffix: "NYSE", tokens: ["NYSE", "NYQ"] },
    { suffix: "NYSEARCA", tokens: ["ARCA", "ARCX"] },
    { suffix: "NYSEAMERICAN", tokens: ["AMEX", "NYSE AMERICAN"] },
    { suffix: "HKG", tokens: ["HONG KONG", "HKEX", "HKSE"] },
    { suffix: "SHA", tokens: ["SHANGHAI", "SHSE", "SS"] },
    { suffix: "SHE", tokens: ["SHENZHEN", "SZSE", "SZ"] },
    { suffix: "LON", tokens: ["LONDON", "LSE"] },
    { suffix: "TSX", tokens: ["TORONTO", "TSX"] },
  ];
  const upper = exchange.toUpperCase();
  for (const entry of mapping) {
    if (entry.tokens.some((token) => upper.includes(token))) return entry.suffix;
  }
  return "NASDAQ";
}

function formatCurrency(value) {
  return typeof value === "number" ? `$${value.toFixed(2)}` : "—";
}

function formatChange(quote) {
  if (
    typeof quote?.regularMarketChange !== "number" ||
    typeof quote?.regularMarketChangePercent !== "number"
  ) {
    return "—";
  }
  const sign = quote.regularMarketChange > 0 ? "+" : "";
  return `${sign}${quote.regularMarketChange.toFixed(2)} (${sign}${quote.regularMarketChangePercent.toFixed(2)}%)`;
}

function formatRange(low, high) {
  if (typeof low !== "number" || typeof high !== "number") return "—";
  return `${low.toFixed(2)} - ${high.toFixed(2)}`;
}

function formatNumber(value) {
  if (!value) return "—";
  return Intl.NumberFormat("en-US").format(value);
}

function formatMarketCap(value) {
  if (typeof value !== "number") return "—";
  const units = [
    { limit: 1e12, suffix: "T" },
    { limit: 1e9, suffix: "B" },
    { limit: 1e6, suffix: "M" },
  ];
  for (const unit of units) {
    if (value >= unit.limit) {
      return `${(value / unit.limit).toFixed(2)}${unit.suffix}`;
    }
  }
  return formatNumber(value);
}

function selectLeaders(quotes, direction = "desc", limit = 10) {
  return quotes
    .filter(
      (quote) =>
        typeof quote.regularMarketChangePercent === "number" &&
        quote.marketCap >= LARGE_CAP_THRESHOLD
    )
    .sort((a, b) =>
      direction === "desc"
        ? getRankingScore(b) - getRankingScore(a)
        : getRankingScore(a) - getRankingScore(b)
    )
    .slice(0, limit);
}

function renderHeadline(cardEl, quote, subline) {
  if (!cardEl) return;
  if (!quote) {
    cardEl.innerHTML = "<p>Data unavailable. Try refreshing shortly.</p>";
    return;
  }
  const outlook = settingsState.highlightFuture ? getOutlook(quote) : null;
  const aiTag = outlook
    ? `<span class="ai-tag ${outlook.className}">AI Outlook: ${outlook.label}</span>`
    : "";
  cardEl.innerHTML = `
    <span class="headline">${quote.symbol} · ${quote.longName ?? ""}</span>
    <span class="subline">${subline}</span>
    ${aiTag}
    <div class="price-stack">
      <span class="current-price">${formatCurrency(quote.regularMarketPrice)}</span>
      <span class="change-badge ${quote.regularMarketChange >= 0 ? "positive" : "negative"}">
        ${formatChange(quote)}
      </span>
    </div>
    <div class="metrics">
      <span>
        <strong>Day Range</strong>
        ${formatRange(quote.regularMarketDayLow, quote.regularMarketDayHigh)}
      </span>
      <span>
        <strong>52 Week</strong>
        ${formatRange(quote.fiftyTwoWeekLow, quote.fiftyTwoWeekHigh)}
      </span>
      <span>
        <strong>Volume</strong>
        ${formatNumber(quote.regularMarketVolume)}
      </span>
      <span>
        <strong>Market Cap</strong>
        ${formatMarketCap(quote.marketCap)}
      </span>
    </div>
  `;
}

function renderList(container, quotes, type) {
  if (!container) return;
  if (!quotes.length) {
    container.innerHTML = `<p class="placeholder">No qualifying symbols.</p>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  quotes.forEach((quote) => {
    const outlook = settingsState.highlightFuture ? getOutlook(quote) : null;
    const aiTag = outlook
      ? `<span class="ai-tag ${outlook.className}">AI Outlook: ${outlook.label}</span>`
      : "";
    const card = document.createElement("article");
    card.className = `leaders-card ${type === "worst" ? "worst" : ""}`;
    card.innerHTML = `
      <div class="row-top">
        <span class="symbol">${quote.symbol}</span>
        <span class="change ${quote.regularMarketChange >= 0 ? "positive" : "negative"}">
          ${formatChange(quote)}
        </span>
      </div>
      <span class="name">${quote.longName ?? ""}</span>
      ${aiTag}
      <div class="details">
        <span>${formatCurrency(quote.regularMarketPrice)}</span>
        <span>${formatMarketCap(quote.marketCap)}</span>
      </div>
      <button type="button" class="link-btn">Open in Google Finance</button>
    `;
    card.querySelector("button").addEventListener("click", () => openFinanceLink(quote));
    fragment.append(card);
  });
  container.innerHTML = "";
  container.append(fragment);
}

function renderQuoteCards(container, quotes, options = {}) {
  if (!container) return;
  const { emptyMessage = "No data available.", heading } = options;
  container.innerHTML = "";
  if (heading) {
    const headingEl = document.createElement("p");
    headingEl.className = "results-heading";
    headingEl.textContent = heading;
    container.append(headingEl);
  }
  if (!quotes.length) {
    const empty = document.createElement("p");
    empty.className = "placeholder";
    empty.textContent = emptyMessage;
    container.append(empty);
    return;
  }
  quotes.forEach((quote) => {
    container.append(createQuoteCard(quote));
  });
}

function createQuoteCard(quote) {
  const card = document.createElement("article");
  card.className = "quote-card";
  const changeClass = quote.regularMarketChange >= 0 ? "positive" : "negative";
  card.innerHTML = `
    <div class="quote-top">
      <h3 class="symbol">${quote.symbol}</h3>
      <span class="name">${quote.longName ?? ""}</span>
    </div>
    <div class="quote-middle">
      <span class="price">${formatCurrency(quote.regularMarketPrice)}</span>
      <span class="change ${changeClass}">${formatChange(quote)}</span>
    </div>
    <dl class="metrics">
      <div>
        <dt>Day Range</dt>
        <dd>${formatRange(quote.regularMarketDayLow, quote.regularMarketDayHigh)}</dd>
      </div>
      <div>
        <dt>52W Range</dt>
        <dd>${formatRange(quote.fiftyTwoWeekLow, quote.fiftyTwoWeekHigh)}</dd>
      </div>
      <div>
        <dt>Volume</dt>
        <dd>${formatNumber(quote.regularMarketVolume)}</dd>
      </div>
      <div>
        <dt>Market Cap</dt>
        <dd>${formatMarketCap(quote.marketCap)}</dd>
      </div>
    </dl>
    <button class="quick-google" type="button">View on Google Finance</button>
  `;
  card.querySelector(".quick-google").addEventListener("click", () => openFinanceLink(quote));
  return card;
}

function findFallbackMatches(query) {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const cleaned = term.replace(/[^a-z0-9]/gi, "");
  const entries = Object.entries(FALLBACK_QUOTES);
  const scored = [];

  for (const [symbol, data] of entries) {
    const symbolLower = symbol.toLowerCase();
    const symbolClean = symbolLower.replace(/[^a-z0-9]/gi, "");
    const nameLower = (data.longName || "").toLowerCase();
    let score = 0;

    if (symbolLower === term || symbolClean === cleaned) {
      score = 100;
    } else if (symbolLower.startsWith(term) || symbolClean.startsWith(cleaned)) {
      score = 75;
    } else if (nameLower === term) {
      score = 60;
    } else if (nameLower.includes(term)) {
      score = 40;
    }

    if (score > 0) {
      const normalized = normalizeQuote({ symbol, ...data });
      if (normalized) {
        scored.push({ quote: normalized, score });
      }
    }
  }

  scored.sort((a, b) => b.score - a.score || (b.quote.marketCap || 0) - (a.quote.marketCap || 0));
  return scored.map((entry) => ({ ...entry.quote, _score: entry.score }));
}

function suggestBetterPeers(baseQuote, limit = 3) {
  const entries = Object.entries(FALLBACK_QUOTES)
    .filter(([symbol]) => symbol !== baseQuote.symbol)
    .map(([symbol, data]) => {
      const normalized = normalizeQuote({ symbol, ...data });
      return normalized ? { quote: normalized, score: getRankingScore(normalized) } : null;
    })
    .filter(Boolean);

  const baseScore = getRankingScore(baseQuote);
  const better = entries
    .filter((entry) => entry.score > baseScore + 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (better.length < limit) {
    const remaining = entries
      .filter((entry) => !better.includes(entry))
      .sort((a, b) => (b.quote.marketCap || 0) - (a.quote.marketCap || 0))
      .slice(0, limit - better.length);
    better.push(...remaining);
  }

  return better.map((entry) => entry.quote);
}

function generateAIPrediction(quote, sourceLabel) {
  const change = quote.regularMarketChangePercent ?? 0;
  const score = getRankingScore(quote);
  const marketCap = quote.marketCap || 0;
  const volume = quote.regularMarketVolume || 0;

  let current = "Stable sideways action.";
  if (change >= 3) current = "Surging today with strong upward momentum.";
  else if (change >= 1) current = "Modest gains on the session.";
  else if (change <= -3) current = "Sharp sell-off in progress.";
  else if (change <= -1) current = "Trading lower amid mild pressure.";

  let future = "Expect neutral performance as the trend consolidates.";
  if (score >= 12) future = "Momentum models flag continued strength over the next few sessions.";
  else if (score >= 5) future = "Indicators lean bullish with moderate follow-through likely.";
  else if (score <= -12) future = "Models warn of extended weakness; defensive posture advised.";
  else if (score <= -5) future = "Expect additional softness unless catalysts emerge.";

  const confidence =
    marketCap >= 5e11
      ? "High confidence thanks to deep liquidity and ample historical data."
      : marketCap >= 1e11
      ? "Moderate confidence; liquidity is healthy."
      : "Lower confidence due to thinner liquidity in this name.";

  const volumeNote =
    volume >= 5e7
      ? "Volume is exceptionally heavy, signalling institutional interest."
      : volume >= 1e7
      ? "Volume is healthy, supporting the current move."
      : "Volume is light, so price swings may be exaggerated.";

  return {
    current,
    future,
    confidence,
    volumeNote,
    sourceLabel,
  };
}

function renderAIPrediction(container, quote, sourceLabel) {
  if (!container || !quote) return;
  const prediction = generateAIPrediction(quote, sourceLabel);
  const peers = suggestBetterPeers(quote, 3);

  const card = document.createElement("article");
  card.className = "ai-card";
  card.innerHTML = `
    <header>
      <h3>AI Insight · ${quote.symbol}</h3>
      <span class="tag">${prediction.sourceLabel}</span>
    </header>
    <section>
      <h4>Current Status</h4>
      <p>${prediction.current}</p>
    </section>
    <section>
      <h4>Short-term Outlook</h4>
      <p>${prediction.future}</p>
    </section>
    <section class="ai-meta">
      <div><strong>Confidence</strong><span>${prediction.confidence}</span></div>
      <div><strong>Volume Note</strong><span>${prediction.volumeNote}</span></div>
    </section>
    <section class="ai-peers">
      <h4>Consider watching</h4>
      ${
        peers.length
          ? `<ul>${peers
              .map(
                (peer) =>
                  `<li><strong>${peer.symbol}</strong> · ${peer.longName ?? "Peer stock"} — AI score ${getRankingScore(
                    peer
                  ).toFixed(1)}</li>`
              )
              .join("")}</ul>`
          : "<p>No stronger peers detected in the offline dataset.</p>"
      }
    </section>
  `;
  container.append(card);
}

function renderWatchlist(container, quotes) {
  if (!container) return;
  if (!settingsState.showWatchlist) {
    container.innerHTML = "";
    return;
  }
  renderQuoteCards(
    container,
    quotes,
    { emptyMessage: "Unable to load the watchlist at the moment." }
  );
}

async function initDashboard() {
  const loadingCards = document.querySelectorAll(".feature-body, .leaders-list");
  loadingCards.forEach((card) => (card.innerHTML = "<p>Loading…</p>"));
  const watchlistEl = document.getElementById("watchlist-container");
  if (watchlistEl) {
    watchlistEl.innerHTML = settingsState.showWatchlist
      ? "<p class=\"placeholder\">Loading watchlist…</p>"
      : "";
  }

  const quotes = await fetchQuotes(TRENDING_TICKERS);

  if (!quotes.length) {
    renderHeadline(
      document.getElementById("feature-body"),
      null,
      "No data available right now."
    );
    renderHeadline(
      document.getElementById("worst-body"),
      null,
      "No data available right now."
    );
    renderList(document.getElementById("top-ten"), [], "best");
    renderList(document.getElementById("bottom-ten"), [], "worst");
    return;
  }

  const best = selectLeaders(quotes, "desc", 10);
  const worst = selectLeaders(quotes, "asc", 10);

  const topPick =
    best[0] ||
    quotes.find((quote) => quote.symbol === "NVDA") ||
    normalizeQuote(FALLBACK_QUOTES.NVDA);
  const riskPick =
    worst[0] ||
    quotes.find((quote) => quote.symbol === "TSLA") ||
    normalizeQuote(FALLBACK_QUOTES.TSLA);

  const bestSubline =
    settingsState.rankingMode === "momentum"
      ? "AI momentum outlook (next session)"
      : "Largest daily % gain among large caps (>$5B market cap)";
  const worstSubline =
    settingsState.rankingMode === "momentum"
      ? "AI caution — weakest momentum projection"
      : "Largest daily % drop among large caps (>$5B market cap)";

  renderHeadline(
    document.getElementById("feature-body"),
    topPick,
    bestSubline
  );
  renderHeadline(
    document.getElementById("worst-body"),
    riskPick,
    worstSubline
  );
  renderList(document.getElementById("top-ten"), best, "best");
  renderList(document.getElementById("bottom-ten"), worst, "worst");
  renderWatchlist(document.getElementById("watchlist-container"), quotes);
}

function initSettings() {
  const settingsBtn = document.getElementById("open-settings");
  const settingsModal = document.getElementById("settings-panel");
  const backdrop = document.getElementById("settings-backdrop");
  const closeBtn = document.getElementById("close-settings");
  const themeRadios = Array.from(document.querySelectorAll('input[name="theme"]'));
  const rankingRadios = Array.from(document.querySelectorAll('input[name="ranking-mode"]'));
  const refreshSelect = document.getElementById("refresh-interval");
  const watchlistToggle = document.getElementById("toggle-watchlist");
  const highlightToggle = document.getElementById("toggle-highlight");
  const newTabToggle = document.getElementById("toggle-new-tab");

  if (!settingsBtn || !settingsModal) {
    applySettings();
    return;
  }

  // Prime UI controls with stored settings
  themeRadios.forEach((radio) => {
    radio.checked = radio.value === settingsState.theme;
  });
  rankingRadios.forEach((radio) => {
    radio.checked = radio.value === settingsState.rankingMode;
  });
  if (refreshSelect) {
    refreshSelect.value = String(settingsState.refreshMinutes);
  }
  if (watchlistToggle) {
    watchlistToggle.checked = settingsState.showWatchlist;
  }
  if (highlightToggle) {
    highlightToggle.checked = settingsState.highlightFuture;
  }
  if (newTabToggle) {
    newTabToggle.checked = settingsState.openLinksInNewTab;
  }

  function openModal() {
    settingsModal.classList.add("visible");
    backdrop?.classList.add("visible");
    document.body.classList.add("settings-open");
    const current = themeRadios.find((radio) => radio.checked);
    current?.focus({ preventScroll: true });
  }

  function closeModal() {
    settingsModal.classList.remove("visible");
    backdrop?.classList.remove("visible");
    document.body.classList.remove("settings-open");
    settingsBtn.focus({ preventScroll: true });
  }

  settingsBtn.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && settingsModal.classList.contains("visible")) {
      closeModal();
    }
  });

  themeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      settingsState.theme = radio.value;
      applySettings();
    });
  });

  rankingRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      settingsState.rankingMode = radio.value;
      saveSettings();
      initDashboard();
    });
  });

  refreshSelect?.addEventListener("change", () => {
    const minutes = Number(refreshSelect.value);
    settingsState.refreshMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : DEFAULT_SETTINGS.refreshMinutes;
    applySettings();
  });

  watchlistToggle?.addEventListener("change", () => {
    settingsState.showWatchlist = watchlistToggle.checked;
    applySettings();
    if (settingsState.showWatchlist) {
      initDashboard();
    }
  });

  highlightToggle?.addEventListener("change", () => {
    settingsState.highlightFuture = highlightToggle.checked;
    applySettings();
    initDashboard();
  });

  newTabToggle?.addEventListener("change", () => {
    settingsState.openLinksInNewTab = newTabToggle.checked;
    saveSettings();
  });

  applySettings();
}

function initSearch() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsContainer = document.getElementById("results-container");
  const submitBtn = form?.querySelector("button");
  if (!form || !input || !resultsContainer) return;

  const runSearch = async () => {
    const rawInput = input.value.trim();
    if (!rawInput) return;

    const fallbackMatches = findFallbackMatches(rawInput);
    const upper = rawInput.toUpperCase();
    const looksLikeSymbol = /^[A-Z0-9.-]+$/.test(upper.replace(/\s+/g, ""));
    const liveSymbols = new Set();

    if (looksLikeSymbol) {
      if (upper.includes(".")) {
        liveSymbols.add(upper);
      } else {
        MARKET_SUFFIXES.forEach((suffix) => liveSymbols.add(`${upper}${suffix}`));
      }
    }
    fallbackMatches.forEach((match) => liveSymbols.add(match.symbol));

    if (!fallbackMatches.length) {
      resultsContainer.innerHTML = `<p class="placeholder">Searching offline dataset…</p>`;
    } else {
      renderQuoteCards(resultsContainer, fallbackMatches.slice(0, 5), {
        heading:
          fallbackMatches.length > 1
            ? "Cached matches (updating with live data…)"
            : "Cached fallback match (updating with live data…)",
        emptyMessage: "No fallback data available.",
      });
    }

    let liveQuotes = [];
    if (liveSymbols.size) {
      try {
        liveQuotes = await fetchQuotes([...liveSymbols]);
      } catch (error) {
        console.warn("Live search fetch failed:", error);
      }
    }

    const finalQuotes = liveQuotes.length ? liveQuotes : fallbackMatches;
    if (finalQuotes.length) {
      const heading = liveQuotes.length
        ? finalQuotes.length > 1
          ? "Closest matches sourced from Google Finance"
          : "Live quote sourced from Google Finance"
        : finalQuotes.length > 1
        ? "Closest matches from cached data"
        : "Cached fallback data";

      renderQuoteCards(resultsContainer, finalQuotes.slice(0, 5), {
        heading,
        emptyMessage: "No data available.",
      });

      renderAIPrediction(
        resultsContainer,
        finalQuotes[0],
        liveQuotes.length ? "AI heuristic (live proxy)" : "AI heuristic (offline cache)"
      );
      return;
    }

    resultsContainer.innerHTML = `
      <div class="message error">
        <strong>Quote unavailable.</strong>
        <span>No live or cached insight found for <code>${rawInput}</code>. Try a different ticker or add it to the fallback dataset.</span>
      </div>`;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch();
  });

  submitBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    runSearch();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runSearch();
    }
  });
}

function bootstrap() {
  initSettings();
  initSearch();
  initDashboard();
  initPullToRefresh();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}

function initPullToRefresh() {
  const indicator = document.getElementById("refresh-indicator");
  const main = document.querySelector("main");
  if (!indicator || !main) return;

  let startY = 0;
  let isDragging = false;
  const threshold = 160;
  const triggerThreshold = 220;
  const maxPull = 260;
  let refreshTimeout = null;
  let wheelAccum = 0;
  let wheelFinishTimer = null;
  let refreshActive = false;

  const showPull = (distance) => {
    const clamped = Math.min(Math.max(distance, 0), maxPull);
    const translate = clamped / 3;
    main.style.transform = `translateY(${translate}px)`;
    indicator.classList.toggle("visible", clamped > threshold);
  };

  const startRefresh = () => {
    if (refreshActive) return;
    refreshActive = true;
    document.body.classList.add("refresh-active");
    main.classList.add("refresh-locked");
    main.style.transform = `translateY(${threshold / 1.6}px)`;
    indicator.classList.add("visible");
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
      initDashboard().finally(() => {
        indicator.classList.remove("visible");
        main.style.transform = "";
        document.body.classList.remove("refresh-active");
        main.classList.remove("refresh-locked");
        refreshActive = false;
      });
    }, 5000);
  };

  const resetPull = (distance) => {
    if (refreshActive) return;
    main.style.transform = "";
    if (distance > triggerThreshold) {
      startRefresh();
    } else {
      indicator.classList.remove("visible");
    }
  };

  const beginDrag = (y) => {
    if (refreshActive) return;
    startY = y;
    isDragging = true;
    document.body.classList.add("dragging-refresh");
  };

  const moveDrag = (y) => {
    if (!isDragging) return;
    const diff = Math.min(Math.max(y - startY, 0), maxPull);
    showPull(diff);
  };

  const endDrag = (y) => {
    if (!isDragging) return;
    const diff = y - startY;
    isDragging = false;
    document.body.classList.remove("dragging-refresh");
    resetPull(diff);
  };

  document.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    if (window.scrollY <= 5) beginDrag(event.clientY);
  });

  document.addEventListener("mousemove", (event) => {
    if (isDragging) moveDrag(event.clientY);
  });

  document.addEventListener("mouseup", (event) => {
    if (isDragging) endDrag(event.clientY);
  });

  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) return;
      if (window.scrollY <= 5) beginDrag(event.touches[0].clientY);
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      if (!isDragging) return;
      if (event.cancelable) event.preventDefault();
      moveDrag(event.touches[0].clientY);
    },
    { passive: false }
  );

  document.addEventListener("touchend", (event) => {
    if (!isDragging) return;
    const clientY = event.changedTouches[0]?.clientY ?? startY;
    endDrag(clientY);
  });

  const finishWheel = () => {
    if (wheelFinishTimer) {
      clearTimeout(wheelFinishTimer);
      wheelFinishTimer = null;
    }
    if (!wheelAccum) return;
    const distance = Math.min(wheelAccum, maxPull);
    resetPull(distance);
    wheelAccum = 0;
  };

  window.addEventListener(
    "wheel",
    (event) => {
    if (event.deltaY < 0 && window.scrollY <= 0) {
      event.preventDefault();
      wheelAccum = Math.min(wheelAccum + Math.abs(event.deltaY), maxPull);
      showPull(wheelAccum);
      if (wheelFinishTimer) clearTimeout(wheelFinishTimer);
      wheelFinishTimer = setTimeout(finishWheel, 240);
    } else if (wheelAccum > 0) {
      finishWheel();
    }
  },
  { passive: false }
);
}
