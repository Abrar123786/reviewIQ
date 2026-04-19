import ollama
import json
import re


def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_json(text):
    match = re.search(r'\{.*?\}', text, re.DOTALL)
    return match.group() if match else None


def fix_json(text):
    if not text:
        return None

    # balance braces
    open_braces = text.count('{')
    close_braces = text.count('}')
    if close_braces < open_braces:
        text += '}' * (open_braces - close_braces)

    # remove trailing commas
    text = re.sub(r',\s*}', '}', text)
    text = re.sub(r',\s*]', ']', text)

    return text


def analyze_review(review):
    cleaned_review = clean_text(review)

    prompt = f"""
You are a STRICT JSON generator.

Return ONLY valid JSON.
No explanation. No markdown. No extra text.

Rules:
- Every feature MUST be: positive, negative, or neutral
- NEVER leave any field empty
- If not mentioned → neutral
- Summary must be ONE short meaningful sentence

Format:

{{
  "overall_sentiment": "positive/negative/neutral",
  "features": {{
    "battery": "positive/negative/neutral",
    "packaging": "positive/negative/neutral",
    "delivery": "positive/negative/neutral",
    "quality": "positive/negative/neutral"
  }},
  "summary": "short sentence"
}}

Review: {cleaned_review}
"""

    for _ in range(2):  # retry
        try:
            response = ollama.chat(
                model='llama3',
                messages=[{'role': 'user', 'content': prompt}]
            )

            raw = response['message']['content'].strip()

            json_text = extract_json(raw)
            json_text = fix_json(json_text)

            parsed = json.loads(json_text)

            # 🔥 VALIDATE overall sentiment
            if parsed.get("overall_sentiment") not in ["positive", "negative", "neutral"]:
                parsed["overall_sentiment"] = "neutral"

            # 🔥 VALIDATE FEATURES STRICTLY
            features = parsed.get("features", {})

            for key in ["battery", "packaging", "delivery", "quality"]:
                value = features.get(key)
                if value not in ["positive", "negative", "neutral"]:
                    features[key] = "neutral"

            parsed["features"] = features

            # 🔥 FIX SUMMARY
            if "summary" not in parsed or not parsed["summary"].strip():
                sentiment = parsed.get("overall_sentiment", "neutral")
                parsed["summary"] = f"Overall {sentiment} customer feedback."

            return parsed

        except Exception:
            continue

    # 🔥 FINAL FALLBACK (NEVER BREAK SYSTEM)
    return {
        "overall_sentiment": "neutral",
        "features": {
            "battery": "neutral",
            "packaging": "neutral",
            "delivery": "neutral",
            "quality": "neutral"
        },
    "summary": "Unable to analyze review properly."
    }


# 🔹 test
if __name__ == "__main__":
    review = "Battery is good but packaging is bad"
    print(analyze_review(review))