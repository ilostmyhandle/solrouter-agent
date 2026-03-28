import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { fetchKaminoRisk, fetchMarketMetrics, fetchSOLPrice } from "./monitor.js";
import { analyzeRisk } from "./analyzer.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/analyze", async (req, res) => {
  try {
    const [solPrice, metrics, liquidations] = await Promise.all([
      fetchSOLPrice(),
      fetchMarketMetrics(),
      fetchKaminoRisk(),
    ]);

    const analysis = await analyzeRisk(liquidations, metrics, solPrice);

    res.json({
      success: true,
      solPrice,
      metrics,
      liquidations,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\nLiquidation Hunter running at http://localhost:${PORT}\n`);
});