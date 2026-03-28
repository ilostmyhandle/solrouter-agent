import axios from "axios";

const KAMINO_MAIN_MARKET = "7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF";
const KAMINO_BASE = "https://api.kamino.finance";

export async function fetchKaminoRisk() {
  try {
    // Fetch recent liquidations from Kamino main market
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
    // Fetch Kamino market-level metrics
    const { data } = await axios.get(
      `${KAMINO_BASE}/lending-markets/${KAMINO_MAIN_MARKET}/metrics`
    );
    return {
      tvl: data.metrics?.tvl ?? data.tvl ?? "N/A",
      totalObligations: data.metrics?.obligations ?? "N/A",
      timestamp: data.timestamp ?? new Date().toISOString(),
    };
  } catch (err) {
    console.error("Kamino metrics fetch failed:", err.message);
    return null;
  }
}

export async function fetchSOLPrice() {
  try {
    const { data } = await axios.get(
      "https://api.dexscreener.com/tokens/v1/solana/So11111111111111111111111111111111111111112"
    );
    const pair = data.pairs?.[0];
    return {
      price: pair?.priceUsd ?? "N/A",
      priceChange24h: pair?.priceChange?.h24 ?? "N/A",
      volume24h: pair?.volume?.h24 ?? "N/A",
    };
  } catch (err) {
    console.error("SOL price fetch failed:", err.message);
    return null;
  }
}