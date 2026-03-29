import { SolRouter } from "@solrouter/sdk";
import dotenv from "dotenv";
dotenv.config();

const client = new SolRouter({
  apiKey: process.env.SOLROUTER_API_KEY,
});

export async function analyzeRisk(liquidations, metrics, solPrice) {
  const marketContext = metrics
    ? `Kamino Market TVL: $${metrics.tvl} | Total Obligations: ${metrics.totalObligations}`
    : "Market metrics unavailable";

  const solContext = solPrice
    ? `SOL Price: $${solPrice.price} | 24h Change: ${solPrice.priceChange24h}% | 24h Volume: $${solPrice.volume24h}`
    : "SOL price unavailable";

  const liquidationSummary =
    liquidations.length > 0
      ? liquidations
          .map(
            (p, i) =>
              `${i + 1}. [${p.protocol}] Wallet: ${p.wallet.slice(0, 8)}... | LTV: ${p.ltv} | Borrowed: $${p.borrowed} | Collateral: $${p.collateral} | Token: ${p.token}`
          )
          .join("\n")
      : "No recent liquidation data available from on-chain.";

  const prompt = `
You are a DeFi liquidation analyst monitoring Solana lending protocols.

MARKET CONTEXT:
${marketContext}

CURRENT SOL PRICE:
${solContext}

RECENT LIQUIDATIONS ON KAMINO:
${liquidationSummary}

Based on this data, provide:
1. Current liquidation risk level for Kamino (Low / Medium / High) and why
2. If SOL drops another 10-20% from current price, which positions are most at risk
3. Estimated liquidation cascade size in USD if that happens
4. Best opportunities for liquidators right now (size, bonus %)
5. One actionable insight for a DeFi trader monitoring this market

Be specific, data-driven, and concise.
  `.trim();

  try {
    const response = await client.chat(prompt);
    return response.message ?? response;
  } catch (err) {
    console.error("SolRouter error:", err.message);
    return "Analysis failed. Check your API key.";
  }
}

export async function analyzeWalletRisk(walletAddress, positions, solPrice) {
  const solContext = solPrice
    ? `SOL Price: $${solPrice.price} | 24h Change: ${solPrice.priceChange24h}% | 24h Volume: $${solPrice.volume24h}`
    : "SOL price unavailable";

  const positionSummary =
    positions && positions.length > 0
      ? positions
          .map(
            (p, i) =>
              `${i + 1}. LTV: ${p.ltv} | Borrowed: $${p.borrowed} | Collateral: $${p.collateral} | Token: ${p.token} | Health Factor: ${p.healthFactor} | Liquidation Threshold: ${p.liquidationThreshold}`
          )
          .join("\n")
      : "No open positions found for this wallet.";

  const prompt = `
You are a DeFi risk analyst. A user wants to know if their Solana wallet is at risk of liquidation on Kamino Finance.

WALLET ADDRESS: ${walletAddress}

CURRENT SOL PRICE:
${solContext}

OPEN POSITIONS ON KAMINO:
${positionSummary}

Based on this data, provide:
1. Overall liquidation risk for this wallet (Low / Medium / High / Critical) and why
2. Which position is closest to liquidation and at what SOL price it gets liquidated
3. If SOL drops 10% from current price, what happens to this wallet
4. If SOL drops 20% from current price, what happens to this wallet
5. One specific action this user should take right now to reduce their risk

Be direct, specific, and speak to the wallet owner personally.
  `.trim();

  try {
    const response = await client.chat(prompt);
    return response.message ?? response;
  } catch (err) {
    console.error("SolRouter wallet analysis error:", err.message);
    return "Wallet analysis failed. Check your API key.";
  }
}