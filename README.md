# PS5 WATCH – monochrome minute-refresh dashboard

## What changed
- Pure black background with white/grey text.
- Displays the latest verified price for Best Buy Canada, Costco Canada, and Amazon Canada.
- Refreshes the dashboard API immediately on load, then every 60 seconds; there is also a manual Refresh Now button.
- Prices remain visible between checks and are not hidden merely because they have not changed.
- Shows last dashboard refresh time and retailer-specific verification details.

## Important: live prices are not connected yet
The app expects a backend endpoint at `./api/prices` returning JSON in this shape:

```json
{
  "retailers": {
    "bestbuy": {"verified": true, "price": 649.99, "seller": "Best Buy Canada", "availability": "In stock", "checkedAt": "2026-11-14T18:00:00-05:00"},
    "costco": {"verified": true, "price": 629.99, "seller": "Costco", "availability": "In stock", "checkedAt": "2026-11-14T18:00:00-05:00"},
    "amazon": {"verified": true, "price": 649.99, "seller": "Amazon.ca", "availability": "In stock", "checkedAt": "2026-11-14T18:00:00-05:00"}
  }
}
```

The example numbers above are illustrative only and must never be used as actual prices. The app deliberately shows a dash when the backend has no verified data.

A one-minute browser refresh does not mean the stores themselves update every minute. The backend must obtain permitted, verified data and should respect each retailer's terms, access limits, and rate limits. A static GitHub Pages site alone cannot securely fetch and verify all retailer prices. Do not put API keys or retailer credentials in browser JavaScript.

## Install
1. Deploy the files to an HTTPS host together with the backend endpoint.
2. Open the hosted URL in Safari on iPhone.
3. Tap Share → Add to Home Screen.

The existing ChatGPT scheduled task is separate; it does not automatically feed this dashboard.
