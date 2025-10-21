# Stocks Analysis Dashboard

Lightweight client-side dashboard that pulls quote snapshots from Yahoo Finance’s public quote endpoint.

## Features

- Featured “best stock right now” card highlighting NVDA with daily stats.
- Search box for any ticker symbol with automatic market detection (US, Hong Kong, London, Toronto, Sydney, Tokyo, etc.).
- AI-curated #1 best and #1 worst movers plus Top 10 leader/laggard lists with quick Google Finance links.
- In-app Settings menu to flip between light, dark, peach, tan, or an auto seasonal theme.
- Trending watchlist tiles for big tech names with quick links to Google Finance.
- Fallback metrics if the live API call fails, so the UI still renders data offline.

### Ranking Criteria

- Only companies with market caps above **$5B USD** are considered for best/worst lists.
- Rankings are based on the **daily percentage move** from Yahoo Finance quote data.
- Featured pick = top gainer; biggest risk = largest decliner; both derived automatically on load.

## Getting Started

1. Open this folder in VS Code.
2. Install the **Live Server** extension if you have not already.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The dashboard opens in your browser at `http://127.0.0.1:5500` (port may vary).

> Opening via Live Server avoids CORS errors when requesting Yahoo Finance quotes.

## Customizing

- Use the **Settings** button (top-right) to switch themes or enable seasonal mode.
- Edit `trendingTickers` in `app.js` to track your own symbols.
- Adjust `featuredTicker` to highlight a different pick on load.
