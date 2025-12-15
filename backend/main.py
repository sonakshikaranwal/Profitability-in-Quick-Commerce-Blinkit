from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import SimulationInput, SimulationResult
from services.economics import calculate_metrics
from services.ai_engine import generate_strategic_insight

app = FastAPI()

# CORS: Allow requests from your local frontend AND your future deployed frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (simplest for deployment)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"status": "active", "message": "Profitability Engine API is running"}

@app.post("/simulate", response_model=SimulationResult)
def simulate_strategy(data: SimulationInput):
    # 1. Calculate the math
    metrics = calculate_metrics(data)
    
    # 2. Get the strategy
    verdict, recommendation = generate_strategic_insight(
        metrics, 
        data.company_name, 
        data.city_tier
    )
    
    return {
        **metrics,
        "strategic_verdict": verdict,
        "ai_recommendation": recommendation
    }