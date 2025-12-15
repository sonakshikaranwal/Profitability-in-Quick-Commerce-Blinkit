def calculate_metrics(data):
    # 1. Revenue Dynamics
    platform_revenue_per_order = data.aov * data.commission_rate 
    
    # 2. Variable Costs (Per Order)
    variable_cost = data.delivery_cost + (data.aov * (data.discount_rate / 100))
    
    # 3. Contribution Margin (CM)
    contribution_margin = platform_revenue_per_order - variable_cost
    
    # 4. Total Monthly Math
    monthly_volume = data.orders_per_day * 30
    gross_contribution = contribution_margin * monthly_volume
    
    net_profit_monthly = gross_contribution - data.fixed_cost_monthly
    
    # 5. Break Even Point (BEP)
    # FIX: JSON cannot handle "infinity". We use -1 to represent "Impossible/Infinite"
    if contribution_margin > 0:
        break_even_orders_monthly = data.fixed_cost_monthly / contribution_margin
    else:
        break_even_orders_monthly = -1  # -1 indicates "Impossible to break even"

    return {
        "revenue_per_order": round(platform_revenue_per_order, 2),
        "variable_cost_per_order": round(variable_cost, 2),
        "contribution_margin": round(contribution_margin, 2),
        "net_profit_monthly": round(net_profit_monthly, 2),
        "break_even_orders": round(break_even_orders_monthly, 0)
    }