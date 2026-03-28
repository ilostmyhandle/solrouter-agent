import chalk from "chalk";
import dotenv from "dotenv";
import { fetchKaminoRisk, fetchMarketMetrics, fetchSOLPrice } from "./monitor.js";
import { analyzeRisk } from "./analyzer.js";
dotenv.config();

async function main() {
  console.log(chalk.yellow("\n╔════════════════════════════════════════╗"));
  console.log(chalk.yellow("║       LIQUIDATION HUNTER AGENT         ║"));
  console.log(chalk.yellow("║   Powered by SolRouter Encrypted AI    ║"));
  console.log(chalk.yellow("╚════════════════════════════════════════╝\n"));

  console.log(chalk.cyan("Fetching SOL price from DexScreener..."));
  const solPrice = await fetchSOLPrice();
  if (solPrice) {
    console.log(chalk.green(`SOL: $${solPrice.price} | 24h: ${solPrice.priceChange24h}%`));
  }

  console.log(chalk.cyan("\nFetching Kamino market metrics..."));
  const metrics = await fetchMarketMetrics();
  if (metrics) {
    console.log(chalk.green(`TVL: $${metrics.tvl} | Obligations: ${metrics.totalObligations}`));
  }

  console.log(chalk.cyan("\nFetching recent Kamino liquidations..."));
  const liquidations = await fetchKaminoRisk();
  console.log(chalk.green(`Found ${liquidations.length} recent liquidation events`));

  if (liquidations.length > 0) {
    console.log(chalk.yellow("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.yellow("RECENT LIQUIDATIONS:"));
    console.log(chalk.yellow("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
    liquidations.forEach((p, i) => {
      console.log(
        chalk.red(
          `${i + 1}. [${p.protocol}] ${p.wallet.slice(0, 8)}... | Token: ${p.token} | Borrowed: $${p.borrowed}`
        )
      );
    });
  }

  console.log(chalk.yellow("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.cyan("Sending data to SolRouter for encrypted analysis..."));
  console.log(chalk.gray("(Your query is end-to-end encrypted via Arcium RescueCipher)\n"));

  const analysis = await analyzeRisk(liquidations, metrics, solPrice);

  console.log(chalk.yellow("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.green("ENCRYPTED AI ANALYSIS:"));
  console.log(chalk.yellow("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
  console.log(chalk.white(analysis));
  console.log(chalk.yellow("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
}

main();