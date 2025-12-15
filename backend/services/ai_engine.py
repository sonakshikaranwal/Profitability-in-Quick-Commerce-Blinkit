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
    cm = metrics["contribution_margin"]
    profit = metrics["net_profit_monthly"]
    be_orders = metrics["break_even_orders"]
    
    api_key = os.getenv("OPENAI_API_KEY")

    # DEBUG: Check if key exists
    if not api_key:
        return "System Error", "Error: OPENAI_API_KEY is missing in Vercel Environment Variables."

    if HAS_OPENAI:
        try:
            client = OpenAI(api_key=api_key)
            prompt = (
                f"Act as a Strategy Consultant. Analyze {company} in {city}.\n"
                f"Metrics: CM={cm}, Profit={profit}, BreakEven={be_orders}.\n"
                f"Task 1: 3-word verdict.\n"
                f"Task 2: 1-sentence recommendation."
            )

            # Use gpt-4o-mini or gpt-3.5-turbo for speed (Critical for Vercel)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo", 
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.7
            )

            content = response.choices[0].message.content
            lines = content.split('\n')
            verdict = lines[0].replace("Task 1:", "").strip()
            recommendation = content.replace(lines[0], "").replace("Task 2:", "").strip()

            return verdict, recommendation

        except Exception as e:
            # RETURN THE ACTUAL ERROR TO THE FRONTEND
            return "AI Connection Failed", f"OpenAI Error: {str(e)}"

    return "Library Error", "The 'openai' library is not installed on the server."