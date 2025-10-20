# Stocks Analysis Dashboard

Lightweight client-side dashboard that pulls quote snapshots from Yahoo Finance’s public quote endpoint.

## Features

- Featured “best stock right now” card highlighting NVDA with daily stats.
- Search box for any ticker symbol (fetches `https://query1.finance.yahoo.com/v7/finance/quote`).
- Trending watchlist tiles for big tech names with quick links to Google Finance.
- Fallback metrics if the live API call fails, so the UI still renders data offline.

## Getting Started

1. Open this folder in VS Code.
2. Install the **Live Server** extension if you have not already.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The dashboard opens in your browser at `http://127.0.0.1:5500` (port may vary).

> Opening via Live Server avoids CORS errors when requesting Yahoo Finance quotes.

## Customizing

- Edit `trendingTickers` in `app.js` to track your own symbols.
- Adjust `featuredTicker` to highlight a different pick on load.
- Add additional style tweaks in `styles.css` (currently tuned for dark mode).
