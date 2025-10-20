const API_ENDPOINT = "https://query1.finance.yahoo.com/v7/finance/quote";

const trendingTickers = ["NVDA", "AAPL", "MSFT", "TSLA", "GOOGL", "AMZN"];
const featuredTicker = "NVDA";

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
  },
};

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");
const watchlistContainer = document.getElementById("watchlist-container");
const featureBody = document.getElementById("feature-body");
const quoteTemplate = document.getElementById("quote-card-template");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const symbol = searchInput.value.trim().toUpperCase();
  if (!symbol) return;
  renderLoading(resultsContainer);
  const data = await fetchQuote(symbol);
  if (!data) {
    resultsContainer.innerHTML =
      `<p class="placeholder">Could not load data for ${symbol}. Try another ticker.</p>`;
    return;
  }
  renderQuotes([data], resultsContainer, { allowGoogle: true, replace: true });
});

async function initialize() {
  featureBody.innerHTML = "<p>Refreshing featured metrics…</p>";
  renderLoading(watchlistContainer);
  const tickers = [featuredTicker, ...trendingTickers];
  const quotes = await fetchQuoteList(tickers);

  const featureQuote = quotes.find((quote) => quote.symbol === featuredTicker);
  if (featureQuote) {
    renderFeatured(featureQuote);
  } else {
    renderFeatured(fallbackQuotes[featuredTicker], featuredTicker);
  }

  const watchlistQuotes = quotes.filter(
    (quote) => quote.symbol !== featuredTicker
  );
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
}

initialize();

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
    <span class="subline">Today's top technical pick</span>
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
        const url = `https://www.google.com/finance/quote/${encodeURIComponent(
          quote.symbol
        )}:NASDAQ`;
        window.open(url, "_blank", "noopener");
      });
    } else {
      googleBtn.remove();
    }
    container.appendChild(card);
  });
}

function renderLoading(container) {
  container.innerHTML = `<p class="placeholder">Loading latest data…</p>`;
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
