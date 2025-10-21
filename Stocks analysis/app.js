const API_ENDPOINT = "https://query1.finance.yahoo.com/v7/finance/quote";
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

async function fetchQuotes(symbols) {
  const query = symbols.join(",");
  const url = `${API_ENDPOINT}?symbols=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error");
    const payload = await response.json();
    return payload?.quoteResponse?.result ?? [];
  } catch (error) {
    console.warn("Falling back to cached data:", error);
    return symbols.map((ticker) => ({ symbol: ticker, ...FALLBACK_QUOTES[ticker] })).filter(
      (q) => q.marketCap
    );
  }
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

function renderQuoteCards(container, quotes, emptyMessage = "No data available.") {
  if (!container) return;
  if (!quotes.length) {
    container.innerHTML = `<p class="placeholder">${emptyMessage}</p>`;
    return;
  }
  container.innerHTML = "";
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

function renderWatchlist(container, quotes) {
  if (!container) return;
  if (!settingsState.showWatchlist) {
    container.innerHTML = "";
    return;
  }
  renderQuoteCards(
    container,
    quotes,
    "Unable to load the watchlist at the moment."
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

  const rawQuotes = await fetchQuotes(TRENDING_TICKERS);
  const quotes = rawQuotes.map(normalizeQuote).filter(Boolean);

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
  if (!form || !input || !resultsContainer) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const raw = input.value.trim().toUpperCase();
    if (!raw) return;
    resultsContainer.innerHTML = `<p class="placeholder">Fetching quote…</p>`;
    const candidates = raw.includes(".")
      ? [raw]
      : MARKET_SUFFIXES.map((suffix) => `${raw}${suffix}`);
    const quotes = await fetchQuotes(candidates);
    const first = quotes.map(normalizeQuote).find(Boolean);
    if (!first) {
      resultsContainer.innerHTML = `
        <div class="message error">
          <strong>Quote unavailable.</strong>
          <span>We could not find data for <code>${raw}</code>. Try including an exchange suffix like <code>.HK</code> for Hong Kong.</span>
        </div>`;
      return;
    }
    renderQuoteCards(resultsContainer, [first], "Unable to load quote data right now.");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initSettings();
  initSearch();
  initDashboard();
});
