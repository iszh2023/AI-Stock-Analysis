# Stocks Analysis Dashboard

Lightweight client-side dashboard that pulls quote snapshots from Yahoo Finance’s public quote endpoint.

## Features

- Featured “best stock right now” card highlighting NVDA with daily stats.
- Search box for any ticker symbol or company name. Attempts a live Google Finance fetch; when blocked, it falls back to cached data and still shows AI guidance.
- AI-curated #1 best and #1 worst movers plus Top 10 leader/laggard lists with quick Google Finance links.
- In-app Settings menu to flip between light, dark, peach, tan, or an auto seasonal theme.
- Trending watchlist tiles for big tech names with quick links to Google Finance.
- Live quotes are pulled from Google Finance (via a CORS-safe proxy) with cached fallbacks if the network blocks the request; when that happens the UI displays a reminder that data may be outdated and the AI module overlays heuristic guidance.
- Automatic refresh every hour to stay aligned with Yahoo Finance quotes.
- Optional momentum heuristic that highlights an AI outlook (“Bullish”, “Bearish”, etc.) for the top pick and tables.

### Ranking Criteria

- Only companies with market caps above **$5B USD** are considered for best/worst lists.
- Rankings are based on the **daily percentage move** from Yahoo Finance quote data.
- Featured pick = top gainer; biggest risk = largest decliner; both derived automatically on load.
- Switch the ranking method to **Momentum forecast** for an AI-weighted score that factors in change %, volume, and market cap.

### AI Outlook Tags

- Enable “Highlight AI outlook tags” in **Settings → Display Options** to show Bullish/Bearish badges on the #1 cards and leaderboards.
- Outlook labels are computed from the chosen ranking method (Daily change or Momentum).
- Customize link behavior and watchlist visibility from the same panel.

## Getting Started

1. Open this folder in VS Code.
2. Install the **Live Server** extension if you have not already.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The dashboard opens in your browser at `http://127.0.0.1:5500` (port may vary).

> Opening via Live Server avoids CORS errors when requesting Yahoo Finance quotes.

## Customizing

- Use the **Settings** button (top-right) to tweak:
  - Theme (light, dark, peach, tan, or seasonal auto-palette).
  - Refresh frequency (15/30/60 minutes).
  - Ranking method (Daily change vs Momentum forecast).
  - Watchlist visibility and AI-outlook badges.
  - Google Finance link behavior (open in same tab or new tab).
- Edit `TRENDING_TICKERS` in `app.js` to track your own symbols.
- Adjust `FALLBACK_QUOTES` to tune the offline baseline data for each ticker.
