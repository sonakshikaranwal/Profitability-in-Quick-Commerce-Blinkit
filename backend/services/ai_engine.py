import os
from dotenv import load_dotenv

# Try to import OpenAI, but handle the case where it might fail securely
try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

# Load environment variables from .env file
load_dotenv()

def generate_strategic_insight(metrics, company, city):
    """
    Generates a strategic verdict using OpenAI (Real AI) or falls back to logic (Hardcoded).
    """
    
    # 1. SETUP: Prepare the data for the prompt
    cm = metrics["contribution_margin"]
    profit = metrics["net_profit_monthly"]
    be_orders = metrics["break_even_orders"]
    
    api_key = os.getenv("OPENAI_API_KEY")

    # 2. REAL AI MODE: If Key exists, ask GPT
    if HAS_OPENAI and api_key:
        try:
            client = OpenAI(api_key=api_key)
            
            # The Prompt: We give the AI the persona of a Senior Strategy Consultant
            prompt = (
                f"Act as a Senior Strategy Consultant for a Quick Commerce company. "
                f"Analyze these financials for {company} operating in a {city} environment:\n"
                f"- Contribution Margin per Order: ₹{cm}\n"
                f"- Monthly Net Profit: ₹{profit}\n"
                f"- Break-Even Orders Needed: {be_orders}\n\n"
                f"Task 1: Give a 3-word strategic verdict (e.g., 'Aggressive Growth Viable').\n"
                f"Task 2: Provide a 2-sentence strategic recommendation using the VRIO framework. "
                f"Focus on whether they should burn cash to grow or cut costs to survive."
            )

            response = client.chat.completions.create(
                model="gpt-3.5-turbo", # Use "gpt-4" if you have access and budget
                messages=[
                    {"role": "system", "content": "You are an expert in Unit Economics and Business Strategy."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.7
            )

            # Parse the response
            content = response.choices[0].message.content
            
            # Simple parsing logic (assuming GPT follows instructions)
            # We split by newlines or just return the whole blob
            lines = content.split('\n')
            verdict = lines[0].replace("Task 1:", "").strip()
            recommendation = content.replace(lines[0], "").replace("Task 2:", "").strip()

            return verdict, recommendation

        except Exception as e:
            print(f"OpenAI API Error: {e}")
            # Fall through to the backup logic below
            pass

    # 3. BACKUP MODE: Hardcoded Logic (If API fails or no key)
    # This ensures your professor always sees a working app even if the API breaks.
# 3. BACKUP MODE (Expanded Logic)

    # CASE 1: Losing money on every order (Negative CM)
    if cm < 0:
        verdict = "CRITICAL: Negative Unit Economics"
        recommendation = (
            f"Strategy: Survival Mode. {company} is losing ₹{abs(cm)} on every single order in {city}. "
            "Action: Your logistics costs are too high. Immediate pivot required: Increase delivery fees or enforce a Minimum Order Value (MOV)."
        )

    # CASE 2: Making money per order, but margins are razor thin (< ₹15)
    elif 0 <= cm < 15:
        verdict = "Vulnerable: Razor-Thin Margins"
        recommendation = (
            f"Strategy: Efficiency Focus. With a low CM of ₹{cm}, {company} is vulnerable to slight cost increases. "
            "Recommendation: Do not scale yet. Focus on 'Process Efficiency' (VRIO)—reduce warehouse picking times to improve margins first."
        )

    # CASE 3: Healthy Unit Economics, but still burning significant cash (High Fixed Costs)
    elif cm >= 15 and profit < -50000:
        verdict = "Growth Phase: High Cash Burn"
        recommendation = (
            f"Strategy: Aggressive Scaling. Your core unit economics are healthy (₹{cm} CM), but fixed costs are high. "
            f"Action: You are in the 'Valley of Death'. You must burn cash on marketing to double order volume and cover the fixed overheads."
        )

    # CASE 4: Almost Profitable (Small Loss)
    elif cm >= 15 and -50000 <= profit < 0:
        verdict = "Promising: Near Break-Even"
        recommendation = (
            f"Strategy: Conversion Optimization. {company} is just short of profitability in {city}. "
            "Action: Avoid drastic structural changes. Use targeted notifications to increase order frequency by just 10% to cross the line."
        )

    # CASE 5: Profitable (0 to 50k)
    elif 0 <= profit < 50000:
        verdict = "Sustainable: Marginally Profitable"
        recommendation = (
            f"Strategy: Defensive Consolidation. The model works. "
            "Recommendation: Secure this position. Lock in exclusive supplier contracts (Rarity) to defend against new entrants like Zepto or Blinkit."
        )

    # CASE 6: Highly Profitable (> 50k)
    else:
        verdict = "Dominant: Market Leader"
        recommendation = (
            f"Strategy: Moat Building. {company} is generating a strong surplus of ₹{profit:,.0f}. "
            "VRIO Analysis: Capitalize on 'Organization'. Reinvest profits into Private Labels (higher margins) to build an unassailable competitive advantage."
        )

    return verdict, recommendation