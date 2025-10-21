const API_ENDPOINT = "https://query1.finance.yahoo.com/v7/finance/quote";

const trendingTickers = [
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
const featuredTicker = "NVDA";
const LARGE_CAP_THRESHOLD = 5_000_000_000; // $5B minimum market cap
const MARKET_SUFFIXES = ["", ".HK", ".SZ", ".SS", ".L", ".TO", ".AX", ".T", ".PA", ".F"];
const THEME_STORAGE_KEY = "stocks-dashboard-theme";

let settingsBtn;
let settingsPanel;
let settingsBackdrop;
let closeSettingsButton;
let settingsForm;
let themeRadios = [];
let seasonNote;
let seasonLabel;
let featureBody;
let worstBody;
let watchlistContainer;
let topTenContainer;
let bottomTenContainer;
let resultsContainer;
let quoteTemplate;
let searchForm;
let searchInput;

const THEMES = {
  light: {
    colorScheme: "light",
    vars: {
      "--bg": "#f0f6ff",
      "--bg-gradient": "radial-gradient(circle at top right, #e0edff 0%, #f4f7ff 45%, #f8fbff 100%)",
      "--header-gradient": "linear-gradient(140deg, #eef4ff 0%, #ecfeff 50%, #f9f5ff 100%)",
      "--bg-card": "rgba(255, 255, 255, 0.88)",
      "--bg-accent": "linear-gradient(135deg, #68d5f7, #8b9dfc)",
      "--form-bg": "rgba(255, 255, 255, 0.7)",
      "--text": "#0f172a",
      "--text-muted": "#556987",
      "--accent": "#4f46e5",
      "--accent-soft": "rgba(79, 70, 229, 0.12)",
      "--positive": "#22c55e",
      "--negative": "#ef4444",
      "--shadow-lg": "0 40px 60px rgba(15, 23, 42, 0.12)",
      "--card-highlight": "rgba(241, 245, 255, 0.88)",
      "--card-border": "rgba(148, 163, 184, 0.16)",
      "--card-warning": "rgba(254, 226, 226, 0.9)",
      "--card-warning-border": "rgba(248, 113, 113, 0.22)",
      "--warning-text": "#b91c1c",
    },
  },
  dark: {
    colorScheme: "dark",
    vars: {
      "--bg": "#020617",
      "--bg-gradient": "radial-gradient(circle at top, #0f172a 0%, #020617 60%)",
      "--header-gradient": "linear-gradient(140deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.85) 100%)",
      "--bg-card": "rgba(15, 23, 42, 0.9)",
      "--bg-accent": "linear-gradient(135deg, #38bdf8, #1d4ed8)",
      "--form-bg": "rgba(15, 23, 42, 0.85)",
      "--text": "#e2e8f0",
      "--text-muted": "#94a3b8",
      "--accent": "#38bdf8",
      "--accent-soft": "rgba(56, 189, 248, 0.2)",
      "--positive": "#4ade80",
      "--negative": "#f87171",
      "--shadow-lg": "0 40px 60px rgba(2, 6, 23, 0.6)",
      "--card-highlight": "rgba(30, 41, 59, 0.82)",
      "--card-border": "rgba(56, 189, 248, 0.18)",
      "--card-warning": "rgba(127, 29, 29, 0.55)",
      "--card-warning-border": "rgba(248, 113, 113, 0.35)",
      "--warning-text": "#fecaca",
    },
  },
  peach: {
    colorScheme: "light",
    vars: {
      "--bg": "#fff7ed",
      "--bg-gradient": "radial-gradient(circle at top, #fff1e6 0%, #ffe4d6 55%, #ffe3e3 100%)",
      "--header-gradient": "linear-gradient(140deg, #ffe1d6 0%, #ffd8e8 100%)",
      "--bg-card": "rgba(255, 255, 255, 0.92)",
      "--bg-accent": "linear-gradient(135deg, #fb7185, #f97316)",
      "--form-bg": "rgba(255, 255, 255, 0.82)",
      "--text": "#582c2c",
      "--text-muted": "#8f4f4f",
      "--accent": "#f97316",
      "--accent-soft": "rgba(249, 115, 22, 0.12)",
      "--positive": "#22c55e",
      "--negative": "#ef4444",
      "--shadow-lg": "0 40px 60px rgba(255, 126, 95, 0.22)",
      "--card-highlight": "rgba(255, 247, 237, 0.92)",
      "--card-border": "rgba(245, 158, 11, 0.22)",
      "--card-warning": "rgba(255, 228, 230, 0.95)",
      "--card-warning-border": "rgba(244, 114, 182, 0.28)",
      "--warning-text": "#c2410c",
    },
  },
  tan: {
    colorScheme: "light",
    vars: {
      "--bg": "#f5f1e6",
      "--bg-gradient": "radial-gradient(circle at top left, #f7ede2 0%, #f4e6d8 60%, #efe2d1 100%)",
      "--header-gradient": "linear-gradient(140deg, #f0e0d0 0%, #f6ead8 100%)",
      "--bg-card": "rgba(255, 253, 248, 0.94)",
      "--bg-accent": "linear-gradient(135deg, #d97706, #b45309)",
      "--form-bg": "rgba(255, 253, 248, 0.85)",
      "--text": "#3f2f22",
      "--text-muted": "#6b4f3a",
      "--accent": "#b45309",
      "--accent-soft": "rgba(212, 163, 115, 0.18)",
      "--positive": "#22c55e",
      "--negative": "#dc2626",
      "--shadow-lg": "0 40px 60px rgba(107, 83, 53, 0.22)",
      "--card-highlight": "rgba(250, 245, 237, 0.95)",
      "--card-border": "rgba(214, 162, 104, 0.26)",
      "--card-warning": "rgba(254, 226, 200, 0.92)",
      "--card-warning-border": "rgba(250, 204, 21, 0.28)",
      "--warning-text": "#92400e",
    },
  },
};

const SEASONAL_THEMES = {
  spring: {
    colorScheme: "light",
    vars: {
      "--bg": "#f6fffa",
      "--bg-gradient": "radial-gradient(circle at top, #f0fff4 0%, #dcfce7 50%, #ecfdf5 100%)",
      "--header-gradient": "linear-gradient(140deg, #dcfce7 0%, #e0f2fe 100%)",
      "--bg-card": "rgba(255, 255, 255, 0.9)",
      "--bg-accent": "linear-gradient(135deg, #34d399, #22d3ee)",
      "--form-bg": "rgba(255, 255, 255, 0.82)",
      "--text": "#065f46",
      "--text-muted": "#0f766e",
      "--accent": "#22d3ee",
      "--accent-soft": "rgba(34, 211, 238, 0.16)",
      "--positive": "#16a34a",
      "--negative": "#f87171",
      "--shadow-lg": "0 40px 60px rgba(45, 212, 191, 0.22)",
      "--card-highlight": "rgba(236, 254, 255, 0.92)",
      "--card-border": "rgba(45, 212, 191, 0.24)",
      "--card-warning": "rgba(254, 226, 226, 0.9)",
      "--card-warning-border": "rgba(248, 113, 113, 0.25)",
      "--warning-text": "#be123c",
    },
  },
  summer: {
    colorScheme: "light",
    vars: {
      "--bg": "#e0fbfc",
      "--bg-gradient": "radial-gradient(circle at top, #ccfbf1 0%, #99f6e4 50%, #bfdbfe 100%)",
      "--header-gradient": "linear-gradient(140deg, #bae6fd 0%, #99f6e4 100%)",
      "--bg-card": "rgba(255, 255, 255, 0.9)",
      "--bg-accent": "linear-gradient(135deg, #0ea5e9, #22d3ee)",
      "--form-bg": "rgba(255, 255, 255, 0.85)",
      "--text": "#0f172a",
      "--text-muted": "#0e7490",
      "--accent": "#0ea5e9",
      "--accent-soft": "rgba(14, 165, 233, 0.18)",
      "--positive": "#22c55e",
      "--negative": "#ef4444",
      "--shadow-lg": "0 40px 60px rgba(14, 165, 233, 0.22)",
      "--card-highlight": "rgba(219, 234, 254, 0.94)",
      "--card-border": "rgba(96, 165, 250, 0.24)",
      "--card-warning": "rgba(254, 226, 226, 0.92)",
      "--card-warning-border": "rgba(248, 113, 113, 0.24)",
      "--warning-text": "#be123c",
    },
  },
  fall: {
    colorScheme: "light",
    vars: {
      "--bg": "#fff4e6",
      "--bg-gradient": "radial-gradient(circle at top, #ffe8d6 0%, #ffd7ba 50%, #fec89a 100%)",
      "--header-gradient": "linear-gradient(140deg, #fed7aa 0%, #f97316 100%)",
      "--bg-card": "rgba(255, 255, 255, 0.9)",
      "--bg-accent": "linear-gradient(135deg, #f97316, #ea580c)",
      "--form-bg": "rgba(255, 255, 255, 0.85)",
      "--text": "#7c2d12",
      "--text-muted": "#9a3412",
      "--accent": "#ea580c",
      "--accent-soft": "rgba(234, 88, 12, 0.18)",
      "--positive": "#22c55e",
      "--negative": "#dc2626",
      "--shadow-lg": "0 40px 60px rgba(234, 88, 12, 0.2)",
      "--card-highlight": "rgba(255, 247, 237, 0.9)",
      "--card-border": "rgba(250, 204, 21, 0.3)",
      "--card-warning": "rgba(254, 205, 211, 0.92)",
      "--card-warning-border": "rgba(244, 114, 182, 0.3)",
      "--warning-text": "#9a3412",
    },
  },
  winter: {
    colorScheme: "light",
    vars: {
      "--bg": "#eef5ff",
      "--bg-gradient": "radial-gradient(circle at top, #e0f2fe 0%, #dbeafe 50%, #f1f5f9 100%)",
      "--header-gradient": "linear-gradient(140deg, #c7d2fe 0%, #e0f2fe 100%)",
      "--bg-card": "rgba(255, 255, 255, 0.9)",
      "--bg-accent": "linear-gradient(135deg, #6366f1, #0ea5e9)",
      "--form-bg": "rgba(255, 255, 255, 0.85)",
      "--text": "#1e293b",
      "--text-muted": "#475569",
      "--accent": "#6366f1",
      "--accent-soft": "rgba(99, 102, 241, 0.16)",
      "--positive": "#22c55e",
      "--negative": "#ef4444",
      "--shadow-lg": "0 40px 60px rgba(99, 102, 241, 0.2)",
      "--card-highlight": "rgba(236, 254, 255, 0.92)",
      "--card-border": "rgba(148, 163, 184, 0.24)",
      "--card-warning": "rgba(254, 226, 226, 0.9)",
      "--card-warning-border": "rgba(248, 113, 113, 0.25)",
      "--warning-text": "#be123c",
    },
  },
};

function detectSeason() {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return { key: "spring", label: "Spring" };
  if (month >= 5 && month <= 7) return { key: "summer", label: "Summer" };
  if (month >= 8 && month <= 10) return { key: "fall", label: "Fall" };
  return { key: "winter", label: "Winter" };
}

function getSeasonalThemeDefinition() {
  const season = detectSeason();
  return {
    theme: SEASONAL_THEMES[season.key] || THEMES.light,
    label: season.label,
  };
}

let currentTheme = "seasonal";

function captureDomRefs() {
  settingsBtn = document.getElementById("open-settings");
  settingsPanel = document.getElementById("settings-panel");
  settingsBackdrop = document.getElementById("settings-backdrop");
  closeSettingsButton = document.getElementById("close-settings");
  settingsForm = document.getElementById("settings-form");
  themeRadios = settingsForm
    ? Array.from(settingsForm.querySelectorAll('input[name="theme"]'))
    : [];
  seasonNote = document.getElementById("season-note");
  seasonLabel = document.getElementById("season-label");
  featureBody = document.getElementById("feature-body");
  worstBody = document.getElementById("worst-body");
  watchlistContainer = document.getElementById("watchlist-container");
  topTenContainer = document.getElementById("top-ten");
  bottomTenContainer = document.getElementById("bottom-ten");
  resultsContainer = document.getElementById("results-container");
  quoteTemplate = document.getElementById("quote-card-template");
  searchForm = document.getElementById("search-form");
  searchInput = document.getElementById("search-input");
}

function readStoredTheme() {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to read stored theme:", error);
    return null;
  }
}

function applyTheme(themeName, { persist = true } = {}) {
  currentTheme = themeName;
  let themeDefinition = THEMES.light;
  let seasonalLabel = null;

  if (themeName === "seasonal") {
    const seasonal = getSeasonalThemeDefinition();
    themeDefinition = seasonal.theme;
    seasonalLabel = seasonal.label;
  } else if (THEMES[themeName]) {
    themeDefinition = THEMES[themeName];
  } else {
    currentTheme = "light";
    themeDefinition = THEMES.light;
  }

  Object.entries(themeDefinition.vars).forEach(([varName, value]) => {
    document.documentElement.style.setProperty(varName, value);
  });

  const scheme = themeDefinition.colorScheme || "light";
  document.documentElement.style.setProperty("--color-scheme", scheme);
  document.documentElement.style.setProperty("color-scheme", scheme);

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch (error) {
      console.warn("Unable to persist theme preference:", error);
    }
  }

  updateThemeRadios(currentTheme);
  updateSeasonNote(currentTheme, seasonalLabel);
}

function updateThemeRadios(themeName) {
  if (!themeRadios.length) return;
  themeRadios.forEach((radio) => {
    radio.checked = radio.value === themeName;
  });
}

function updateSeasonNote(themeName, label) {
  if (!seasonNote || !seasonLabel) return;
  if (themeName === "seasonal") {
    seasonNote.classList.add("visible");
    seasonLabel.textContent = label || detectSeason().label;
  } else {
    seasonNote.classList.remove("visible");
    seasonLabel.textContent = "—";
  }
}

function openSettingsPanel() {
  if (!settingsPanel) return;
  settingsPanel.classList.add("visible");
  settingsBackdrop?.classList.add("visible");
  document.body.classList.add("settings-open");
  settingsPanel.setAttribute("aria-hidden", "false");
  const checked =
    settingsForm?.querySelector('input[name="theme"]:checked') ?? themeRadios[0];
  if (checked) {
    checked.focus({ preventScroll: true });
  }
}

function closeSettingsPanel() {
  if (!settingsPanel) return;
  settingsPanel.classList.remove("visible");
  settingsBackdrop?.classList.remove("visible");
  document.body.classList.remove("settings-open");
  settingsPanel.setAttribute("aria-hidden", "true");
  settingsBtn?.focus({ preventScroll: true });
}

function initThemeControls() {
  const storedTheme = readStoredTheme() || "seasonal";
  applyTheme(storedTheme, { persist: false });

  if (!settingsForm || !settingsPanel || !settingsBtn) {
    return;
  }

  settingsBtn.addEventListener("click", openSettingsPanel);
  closeSettingsButton?.addEventListener("click", closeSettingsPanel);
  settingsBackdrop?.addEventListener("click", closeSettingsPanel);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && settingsPanel?.classList.contains("visible")) {
      closeSettingsPanel();
    }
  });

  settingsForm?.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name === "theme") {
      applyTheme(target.value);
    }
  });
}

const fallbackQuotes = {
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

function initSearchHandlers() {
  if (!searchForm || !searchInput || !resultsContainer) return;
  if (searchForm.dataset.bound === "true") return;
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const symbol = searchInput.value.trim().toUpperCase();
    if (!symbol) return;
    renderLoading(resultsContainer);
    const data = await fetchQuoteWithMarkets(symbol);
    if (!data) {
      resultsContainer.innerHTML = `
        <div class="message error">
          <strong>Quote unavailable.</strong>
          <span>We could not find data for <code>${symbol.toUpperCase()}</code>. Try including an exchange suffix like <code>.HK</code> for Hong Kong.</span>
        </div>`;
      return;
    }
    renderQuotes([data], resultsContainer, { allowGoogle: true, replace: true });
  });
  searchForm.dataset.bound = "true";
}

async function initialize() {
  if (
    !featureBody ||
    !worstBody ||
    !watchlistContainer ||
    !topTenContainer ||
    !bottomTenContainer
  ) {
    console.warn("Required dashboard elements are missing; aborting init.");
    return;
  }

  try {
  featureBody.innerHTML = "<p>Refreshing featured metrics…</p>";
  worstBody.innerHTML = "<p>Scanning for biggest pullbacks…</p>";
  renderLoading(watchlistContainer);
  const tickers = [featuredTicker, ...trendingTickers];
  const quotes = await fetchQuoteList(tickers);

  const bestTen = selectTop(quotes, 10, "desc");
  const worstTen = selectTop(quotes, 10, "asc");
  const featureCandidate =
    (bestTen.length ? bestTen[0] : undefined) ??
    quotes.find((quote) => quote.symbol === featuredTicker) ??
    patchFallback(featuredTicker);
  renderFeatured(featureCandidate, featureCandidate?.symbol ?? featuredTicker);

  if (worstTen.length) {
    renderWorstHeadline(worstTen[0]);
  } else {
    renderWorstHeadline(patchFallback("TSLA"));
  }

  const watchlistQuotes = quotes.filter(
    (quote) => quote.symbol !== (featureCandidate?.symbol ?? featuredTicker)
  );
  if (bestTen.length) {
    renderLeaders(bestTen, topTenContainer, "best");
  } else {
    topTenContainer.innerHTML = `<p class="placeholder">Unable to load leaders.</p>`;
  }
  if (worstTen.length) {
    renderLeaders(worstTen, bottomTenContainer, "worst");
  } else {
    bottomTenContainer.innerHTML = `<p class="placeholder">Unable to load laggards.</p>`;
  }
  if (watchlistQuotes.length) {
    renderQuotes(watchlistQuotes, watchlistContainer, { allowGoogle: true });
  } else {
    renderQuotes(
      trendingTickers
        .filter((ticker) => ticker !== featuredTicker)
        .map((ticker) => patchFallback(ticker)),
      watchlistContainer,
      { allowGoogle: true }
    );
  }
  } catch (error) {
    console.error("Initialization error:", error);
    featureBody.innerHTML =
      "<p>Unable to load data right now. Try refreshing in a moment.</p>";
    worstBody.innerHTML =
      "<p>Unable to calculate biggest risk while offline.</p>";
    topTenContainer.innerHTML =
      '<p class="placeholder">Top movers unavailable.</p>';
    bottomTenContainer.innerHTML =
      '<p class="placeholder">Underperformers unavailable.</p>';
  }
}

function bootstrapDashboard() {
  captureDomRefs();
  initThemeControls();
  initSearchHandlers();
  initialize();
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", bootstrapDashboard);
} else {
  bootstrapDashboard();
}

async function fetchQuoteList(symbols) {
  const query = symbols.join(",");
  const url = `${API_ENDPOINT}?symbols=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload?.quoteResponse?.result?.length) return [];
    return payload.quoteResponse.result.map(standardizeQuote);
  } catch (error) {
    console.warn("Falling back to cached data:", error);
    return symbols.map((ticker) => patchFallback(ticker)).filter(Boolean);
  }
}

async function fetchQuote(symbol) {
  const [quote] = await fetchQuoteList([symbol]);
  return quote;
}

async function fetchQuoteWithMarkets(inputSymbol) {
  const candidates = buildSymbolCandidates(inputSymbol);
  const uniqueCandidates = Array.from(new Set(candidates));
  const quotes = await fetchQuoteList(uniqueCandidates);
  if (!quotes.length) {
    return null;
  }
  const normalized = inputSymbol.toUpperCase();
  const best =
    quotes.find((q) => q.symbol === normalized) ||
    quotes.find((q) => q.symbol.startsWith(normalized)) ||
    quotes[0];
  return best;
}

function buildSymbolCandidates(raw) {
  const clean = raw.trim().toUpperCase();
  if (!clean) return [];
  if (clean.includes(".")) return [clean];
  return MARKET_SUFFIXES.map((suffix) => `${clean}${suffix}`);
}

function standardizeQuote(raw) {
  return {
    symbol: raw.symbol,
    longName: raw.longName || raw.shortName || raw.symbol,
    regularMarketPrice: raw.regularMarketPrice,
    regularMarketChange: raw.regularMarketChange,
    regularMarketChangePercent: raw.regularMarketChangePercent,
    regularMarketDayLow: raw.regularMarketDayLow,
    regularMarketDayHigh: raw.regularMarketDayHigh,
    fiftyTwoWeekLow: raw.fiftyTwoWeekLow,
    fiftyTwoWeekHigh: raw.fiftyTwoWeekHigh,
    regularMarketVolume: raw.regularMarketVolume,
    marketCap: raw.marketCap,
    exchangeSuffix: inferGoogleSuffix(raw),
  };
}

function patchFallback(symbol) {
  const fallback = fallbackQuotes[symbol];
  if (!fallback) return null;
  return { symbol, ...fallback };
}

function renderFeatured(quote, symbolOverride) {
  if (!quote) {
    featureBody.innerHTML =
      "<p>Unable to load featured stock. Try refreshing in a few moments.</p>";
    return;
  }
  const symbol = quote.symbol || symbolOverride || featuredTicker;
  featureBody.innerHTML = `
    <span class="headline">${symbol} · ${quote.longName ?? ""}</span>
    <span class="subline">Largest daily % gain among large caps (>$5B market cap)</span>
    <div class="price-stack">
      <span class="current-price">${formatCurrency(
        quote.regularMarketPrice
      )}</span>
      <span class="change-badge ${getChangeClass(
        quote.regularMarketChange
      )}">${formatChange(quote)}</span>
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

function renderWorstHeadline(quote) {
  if (!quote) {
    worstBody.innerHTML =
      "<p>Unable to identify a biggest risk today. Try again later.</p>";
    return;
  }
  worstBody.innerHTML = `
    <span class="headline">${quote.symbol} · ${quote.longName ?? ""}</span>
    <span class="subline">Largest daily % drop among large caps (>$5B market cap)</span>
    <div class="price-stack">
      <span class="current-price">${formatCurrency(
        quote.regularMarketPrice
      )}</span>
      <span class="change-badge ${getChangeClass(
        quote.regularMarketChange
      )}">${formatChange(quote)}</span>
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

function renderQuotes(quotes, container, { allowGoogle = false, replace = false } = {}) {
  if (!container || !quoteTemplate) return;
  if (replace) container.innerHTML = "";
  quotes.forEach((quote) => {
    if (!quote) return;
    const card = quoteTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".symbol").textContent = quote.symbol;
    card.querySelector(".name").textContent = quote.longName ?? "";
    card.querySelector(".price").textContent = formatCurrency(
      quote.regularMarketPrice
    );
    const changeEl = card.querySelector(".change");
    changeEl.textContent = formatChange(quote);
    changeEl.classList.add(getChangeClass(quote.regularMarketChange));
    card.querySelector(".day-range").textContent = formatRange(
      quote.regularMarketDayLow,
      quote.regularMarketDayHigh
    );
    card.querySelector(".year-range").textContent = formatRange(
      quote.fiftyTwoWeekLow,
      quote.fiftyTwoWeekHigh
    );
    card.querySelector(".volume").textContent = formatNumber(
      quote.regularMarketVolume
    );
    card.querySelector(".market-cap").textContent = formatMarketCap(
      quote.marketCap
    );
    const googleBtn = card.querySelector(".quick-google");
    if (allowGoogle) {
      googleBtn.addEventListener("click", () => {
        const suffix = quote.exchangeSuffix || "NASDAQ";
        const url = `https://www.google.com/finance/quote/${encodeURIComponent(
          quote.symbol
        )}:${suffix}`;
        window.open(url, "_blank", "noopener");
      });
    } else {
      googleBtn.remove();
    }
    container.appendChild(card);
  });
}

function renderLoading(container) {
  if (!container) return;
  container.innerHTML = `<p class="placeholder">Loading latest data…</p>`;
}

function selectTop(quotes, size, direction = "desc") {
  return quotes
    .filter(
      (q) =>
        typeof q?.regularMarketChangePercent === "number" &&
        !Number.isNaN(q.regularMarketChangePercent) &&
        typeof q?.marketCap === "number" &&
        q.marketCap >= LARGE_CAP_THRESHOLD
    )
    .sort((a, b) =>
      direction === "desc"
        ? b.regularMarketChangePercent - a.regularMarketChangePercent
        : a.regularMarketChangePercent - b.regularMarketChangePercent
    )
    .slice(0, size);
}

function renderLeaders(list, container, type) {
  if (!container) return;
  if (!list.length) {
    container.innerHTML = `<p class="placeholder">No data available.</p>`;
    return;
  }
  container.innerHTML = "";
  list.slice(0, 10).forEach((quote) => {
    const card = document.createElement("article");
    card.className = `leaders-card ${type === "worst" ? "worst" : ""}`;
    card.innerHTML = `
      <div class="row-top">
        <span class="symbol">${quote.symbol}</span>
        <span class="change ${getChangeClass(
          quote.regularMarketChange
        )}">${formatChange(quote)}</span>
      </div>
      <span class="name">${quote.longName ?? ""}</span>
      <div class="details">
        <span>${formatCurrency(quote.regularMarketPrice)}</span>
        <span>${formatMarketCap(quote.marketCap)}</span>
      </div>
      <button type="button">Open in Google Finance</button>
    `;
    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      const suffix = quote.exchangeSuffix || "NASDAQ";
      const url = `https://www.google.com/finance/quote/${encodeURIComponent(
        quote.symbol
      )}:${suffix}`;
      window.open(url, "_blank", "noopener");
    });
    container.appendChild(card);
  });
}

function formatCurrency(value) {
  if (typeof value !== "number") return "—";
  return `$${value.toFixed(2)}`;
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
  if (!value) return "—";
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

function getChangeClass(change) {
  if (typeof change !== "number") return "";
  return change >= 0 ? "positive" : "negative";
}

function inferGoogleSuffix(raw) {
  const exchange = (raw.fullExchangeName || raw.exchange || "").toUpperCase();
  const map = [
    { suffix: "NASDAQ", patterns: ["NASDAQ", "NMS", "NGM"] },
    { suffix: "NYSE", patterns: ["NYSE", "NYQ"] },
    { suffix: "NYSEARCA", patterns: ["ARCX", "ARCA"] },
    { suffix: "NYSEAMERICAN", patterns: ["AMEX", "NYSE AMERICAN"] },
    { suffix: "TSE", patterns: ["TORONTO", "TSX"] },
    { suffix: "LON", patterns: ["LONDON", "LSE"] },
    { suffix: "HKG", patterns: ["HKSE", "HKEX", "HONG KONG"] },
    { suffix: "SHA", patterns: ["SHANGHAI", "SHSE", "SS"] },
    { suffix: "SHE", patterns: ["SHENZHEN", "SZSE", "SZ"] },
  ];
  for (const entry of map) {
    if (entry.patterns.some((pattern) => exchange.includes(pattern))) {
      return entry.suffix;
    }
  }
  return "NASDAQ";
}
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
