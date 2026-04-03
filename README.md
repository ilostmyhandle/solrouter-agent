# Liquidation Hunter — SolRouter

Private DeFi liquidation intelligence agent for Solana. Fetches real-time market data, runs your analysis query through SolRouter's encrypted inference, and returns actionable liquidation intelligence. Your research strategy stays your alpha.

## What It Does

- Real-time SOL price and 24h volume tracking
- Kamino Finance TVL monitoring
- AI-powered liquidation risk analysis (Low / Medium / High)
- Cascade size estimation for 10% and 20% SOL price drops
- Wallet-specific risk scanner — paste any Solana wallet to check its Kamino exposure
- All analysis encrypted client-side via SolRouter

## Tech Stack

- **SolRouter SDK** — encrypted AI inference
- **Node.js + Express** — API server
- **CoinGecko API** — SOL price data
- **DefiLlama API** — Kamino TVL data
- **Kamino Finance API** — wallet position data
- **Railway** — deployment

## Quick Start
```bash
git clone https://github.com/ilostmyhandle/solrouter-agent
cd solrouter-agent
cp .env.example .env
# Add your SOLROUTER_API_KEY to .env
npm install
npm start
```
## API Endpoints

- `GET /api/analyze` — market-wide liquidation risk analysis
- `GET /api/wallet/:address` — wallet-specific Kamino position risk scan

## Live Demo

`https://solrouter-agent-production.up.railway.app`

## License

MIT
Then open `http://localhost:3000` in your browser.

## Environment Variables
