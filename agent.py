import ollama
import json
import re

FEATURES = [
    "battery",
    "camera",
    "display",
    "performance",
    "delivery",
    "packaging",
    "price",
    "quality"
]


def clean_text(text):
    text = str(text)
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def validate_features(features):
    validated = {}

    for feature, value in features.items():

        if feature not in FEATURES:
            continue

        if value not in [
            "positive",
            "negative",
            "neutral"
        ]:
            continue

        validated[feature] = value

    return validated


def fallback_response():
    return {
        "overall_sentiment": "neutral",
        "features": {},
        "summary": "Unable to analyze review properly."
    }


def analyze_review(review):

    cleaned_review = clean_text(review)

    prompt = f"""
Analyze this customer review.

Return ONLY JSON.

Required format:

{{
  "overall_sentiment": "positive",
  "features": {{
    "battery": "positive",
    "camera": "neutral",
    "display": "neutral",
    "performance": "neutral",
    "delivery": "negative",
    "packaging": "neutral",
    "price": "neutral",
    "quality": "neutral"
  }},
  "summary": "Brief summary of the review"
}}

Rules:
- Use ONLY positive, negative, or neutral
- Include ONLY features mentioned in the review
- Do not invent features
- Do not mark unmentioned features as neutral

Review:
{cleaned_review}
"""

    for attempt in range(3):

        try:

            response = ollama.chat(
                model="llama3",
                format="json",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            raw_output = response["message"]["content"]

            print("\n====================")
            print("RAW JSON RESPONSE")
            print("====================")
            print(raw_output)
            print("====================\n")

            parsed = json.loads(raw_output)

            sentiment = parsed.get(
                "overall_sentiment",
                "neutral"
            )

            if sentiment not in [
                "positive",
                "negative",
                "neutral"
            ]:
                sentiment = "neutral"

            features = validate_features(
                parsed.get("features", {})
            )

            summary = str(
                parsed.get(
                    "summary",
                    ""
                )
            ).strip()

            if not summary:
                summary = (
                    f"Overall {sentiment} customer feedback."
                )

            return {
                "overall_sentiment": sentiment,
                "features": features,
                "summary": summary
            }

        except Exception as e:

            print("\n====================")
            print("ANALYSIS ERROR")
            print("====================")
            print(e)
            print("====================\n")

    return fallback_response()


if __name__ == "__main__":

    review = (
        "Battery life is excellent, "
        "camera quality is amazing, "
        "but delivery was late and packaging was damaged."
    )

    result = analyze_review(review)

    print(
        json.dumps(
            result,
            indent=4
        )
    )