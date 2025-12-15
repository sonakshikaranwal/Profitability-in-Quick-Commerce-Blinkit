def generate_strategic_insight(metrics, company, city):
    cm = metrics["contribution_margin"]
    profit = metrics["net_profit_monthly"]
    
    # Rule-based Logic (Hard-coded Strategy Frameworks)
    verdict = ""
    recommendation = ""

    if cm < 0:
        verdict = "CRITICAL: Negative Unit Economics"
        recommendation = (
            f"Strategy: Retrenchment. {company} is losing money on every order in {city}. "
            "Immediate Action: Reduce discounts below 5% and increase minimum order value "
            "to improve AOV. Do not expand dark stores."
        )
    elif cm > 0 and profit < 0:
        verdict = "Growth Phase: Cash Burn"
        recommendation = (
            f"Strategy: Market Penetration. {company} has healthy unit economics but lacks volume. "
            "Action: Increase marketing spend to boost order density. "
            "You are covering variable costs, just need to cover fixed costs."
        )
    else:
        verdict = "Sustainable: Profitable"
        recommendation = (
            f"Strategy: Product Development. {company} is generating free cash flow in {city}. "
            "Action: Reinvest profits into private label brands (higher margin) "
            "or expand to adjacent tier-2 cities."
        )

    # Note: You can replace this return with an actual OpenAI/Gemini API call 
    # passing these variables into the prompt for a more dynamic answer.
    
    return verdict, recommendation