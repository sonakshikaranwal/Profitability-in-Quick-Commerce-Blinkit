from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import SimulationInput, SimulationResult
from services.economics import calculate_metrics
from services.ai_engine import generate_strategic_insight

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)