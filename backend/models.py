from pydantic import BaseModel
from typing import Optional

class SimulationInput(BaseModel):
    company_name: str
    city_tier: str
    aov: float              # Average Order Value (e.g., 450)
    orders_per_day: int     # Volume (e.g., 2000)
    delivery_cost: float    # Cost per delivery (e.g., 65)
    commission_rate: float  # Margin taken from items (e.g., 0.15 for 15%)
    discount_rate: float    # Discount given to user (e.g., 10%)
    fixed_cost_monthly: float # Dark store rent + salaries (e.g., 150000)

class SimulationResult(BaseModel):
    revenue_per_order: float
    variable_cost_per_order: float
    contribution_margin: float
    net_profit_monthly: float
    break_even_orders: float
    strategic_verdict: str
    ai_recommendation: str