import axios from "axios";

const KAMINO_MAIN_MARKET = "7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF";
const KAMINO_BASE = "https://api.kamino.finance";

export async function fetchKaminoRisk() {
  try {
    const { data } = await axios.get(
      `${KAMINO_BASE}/lending-markets/${KAMINO_MAIN_MARKET}/loans?status=risky&limit=20`
    );
    const items = Array.isArray(data) ? data : data.liquidations ?? [];
    return items.slice(0, 10).map(p => ({
      protocol: "Kamino",
      wallet: p.wallet ?? p.obligationAccount ?? p.borrower ?? "unknown",
      ltv: p.loanToValue ?? p.ltv ?? "N/A",
      borrowed: p.totalBorrowedAmountUsd ?? p.debtValue ?? "N/A",
      collateral: p.totalCollateralAmountUsd ?? p.collateralValue ?? "N/A",
      token: p.liquidityToken ?? p.collateralToken ?? "SOL",
    }));
  } catch (err) {
    console.error("Kamino fetch failed:", err.message);
    return [];
  }
}

export async function fetchMarketMetrics() {
  try {
    const { data } = await axios.get(
      "https://api.llama.fi/protocol/kamino-lend"
    );
    const tvl = data.currentChainTvls?.Solana ?? data.tvl ?? "N/A";
    return {
      tvl: typeof tvl === "number" ? tvl.toFixed(0) : tvl,
      totalObligations: "N/A",
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Kamino metrics fetch failed:", err.message);
    return null;
  }
}

export async function fetchSOLPrice() {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=solana"
    );
    const sol = data[0];
    return {
      price: sol.current_price?.toString() ?? "N/A",
      priceChange24h: sol.price_change_percentage_24h?.toFixed(2) ?? "N/A",
      volume24h: sol.total_volume?.toString() ?? "N/A",
    };
  } catch (err) {
    console.error("SOL price fetch failed:", err.message);
    return null;
  }
}