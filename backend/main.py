from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import SimulationInput, SimulationResult
from services.economics import calculate_metrics
from services.ai_engine import generate_strategic_insight
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. THE CACHE (Starts with default data)
MARKET_CACHE = {
    "Blinkit": {"net_profit_monthly": 120000, "contribution_margin": 18.5, "break_even_orders": 2500, "strategic_verdict": "Market Leader"},
    "Zepto": {"net_profit_monthly": -45000, "contribution_margin": 12.0, "break_even_orders": 3100, "strategic_verdict": "Growth Phase"},
    "Instamart": {"net_profit_monthly": 15000, "contribution_margin": 16.5, "break_even_orders": 2800, "strategic_verdict": "Sustainable"}
}

# 2. MODEL FOR SAVING
class SaveRequest(BaseModel):
    company_name: str
    data: dict  # This will hold the full result object

@app.get("/")
def read_root():
    return {"status": "active"}

@app.post("/simulate", response_model=SimulationResult)
def simulate_strategy(data: SimulationInput):
    # Pure Math + AI. Does NOT update the Market Analysis yet.
    metrics = calculate_metrics(data)
    verdict, recommendation = generate_strategic_insight(metrics, data.company_name, data.city_tier)
    
    return {
        **metrics,
        "strategic_verdict": verdict,
        "ai_recommendation": recommendation
    }

# --- 3. NEW ENDPOINT: EXPLICIT SAVE ---
@app.post("/save-scenario")
def save_market_scenario(req: SaveRequest):
    # This is triggered ONLY when user clicks "Save Scenario"
    MARKET_CACHE[req.company_name] = req.data
    return {"status": "saved", "current_cache": MARKET_CACHE}

@app.get("/market-data")
def get_live_market_data():
    return MARKET_CACHE