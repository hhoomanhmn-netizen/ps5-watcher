// Refreshes the displayed snapshot every 60 seconds.
// The backend endpoint must return real, verified retailer data; this file never invents prices.
const API_URL = "./api/prices";
const retailers = ["bestbuy", "costco", "amazon"];
const money = value => new Intl.NumberFormat("en-CA", {style:"currency", currency:"CAD"}).format(value);

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

async function refreshPrices() {
  const status = document.getElementById("feed-status");
  if (status) status.textContent = "CHECKING…";
  try {
    const response = await fetch(API_URL, {cache:"no-store", headers:{"Accept":"application/json"}});
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const payload = await response.json();
    let verified = 0;

    for (const retailer of retailers) {
      const item = payload.retailers?.[retailer];
      const priceNode = document.querySelector(`[data-price="${retailer}"]`);
      const statusNode = document.querySelector(`[data-status="${retailer}"]`);
      if (!item || item.verified !== true || typeof item.price !== "number") {
        if (priceNode) priceNode.innerHTML = '— <small>CAD</small>';
        if (statusNode) statusNode.textContent = "No verified current price";
        continue;
      }
      verified++;
      if (priceNode) priceNode.innerHTML = `${money(item.price)} <small>CAD</small>`;
      const seller = item.seller ? ` · ${item.seller}` : "";
      const checked = item.checkedAt ? ` · checked ${new Date(item.checkedAt).toLocaleString("en-CA")}` : "";
      if (statusNode) statusNode.textContent = `${item.availability || "Availability not confirmed"}${seller}${checked}`;
    }

    setText("#tracked-count", `${verified} / 3`);
    if (status) status.textContent = "CONNECTED";
    setText("#last-checked", new Date().toLocaleTimeString("en-CA"));
  } catch (error) {
    if (status) status.textContent = "FEED OFFLINE";
    setText("#last-checked", `Could not refresh · ${new Date().toLocaleTimeString("en-CA")}`);
  }
}

document.getElementById("refresh-now")?.addEventListener("click", refreshPrices);
refreshPrices();
setInterval(refreshPrices, 60_000);

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
