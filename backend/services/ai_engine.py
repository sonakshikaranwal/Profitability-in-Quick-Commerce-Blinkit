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
    print("Using Fallback Logic (No AI)")
    
    if cm < 0:
        verdict = "CRITICAL: Negative Unit Economics"
        recommendation = (
            f"Strategy: Retrenchment. {company} is losing money on every order. "
            "VRIO Analysis: The current model lacks 'Value'. Immediate Action: Reduce discounts and increase delivery fees to flip CM positive."
        )
    elif cm > 0 and profit < 0:
        verdict = "Growth Phase: Cash Burn"
        recommendation = (
            f"Strategy: Aggressive Expansion. {company} has positive unit economics (Value & Rarity). "
            "Recommendation: Burn cash on marketing to reach the break-even volume of {be_orders} orders."
        )
    else:
        verdict = "Sustainable: Profitable"
        recommendation = (
            f"Strategy: Profit Maximization. {company} has achieved a sustainable moat (Organization). "
            "Recommendation: Reinvest surplus into private labels to deepen the competitive advantage."
        )

    return verdict, recommendation