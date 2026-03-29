import axios from "axios";

const KAMINO_MAIN_MARKET = "7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF";

export async function fetchWalletPositions(walletAddress) {
  try {
    const { data } = await axios.get(
      `https://api.kamino.finance/v2/users/${walletAddress}/obligations?env=mainnet-beta`
    );
    const items = Array.isArray(data) ? data : data.obligations ?? [];
    if (items.length === 0) return null;

    return items.map(o => ({
      protocol: "Kamino",
      wallet: walletAddress,
      ltv: o.loanToValue ?? o.ltv ?? "N/A",
      borrowed: o.totalBorrowedAmountUsd ?? o.borrowedAmountUsd ?? "N/A",
      collateral: o.totalCollateralAmountUsd ?? o.depositedAmountUsd ?? "N/A",
      healthFactor: o.healthFactor ?? "N/A",
      liquidationThreshold: o.liquidationLtv ?? o.liquidationThreshold ?? "N/A",
      token: o.collateralToken ?? "SOL",
    }));
  } catch (err) {
    console.error("Wallet position fetch failed:", err.message);
    return null;
  }
}

export async function fetchKaminoRisk() {
  try {
    const { data } = await axios.get(
      `https://api.kamino.finance/v2/lending-markets/${KAMINO_MAIN_MARKET}/reserves/metrics?env=mainnet-beta`
    );
    const items = Array.isArray(data) ? data : [];
    return items.slice(0, 10).map(r => ({
      protocol: "Kamino",
      wallet: "market",
      ltv: r.maxLtv ?? "N/A",
      borrowed: r.totalBorrowUsd ?? "N/A",
      collateral: r.totalSupplyUsd ?? "N/A",
      token: r.liquidityToken ?? "N/A",
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