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