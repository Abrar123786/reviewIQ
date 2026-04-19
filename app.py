from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import analyze_review
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

# 🔹 INIT DB
def init_db():
    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        review TEXT,
        result TEXT,
        category TEXT,
        created_at TEXT
    )
    """)

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return "AI Review Analyzer Running"


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    reviews = data.get("reviews", [])

    if not reviews:
        return jsonify({"error": "No reviews provided"})

    results = []

    feature_counts = {
        "battery": {"positive": 0, "negative": 0, "neutral": 0},
        "packaging": {"positive": 0, "negative": 0, "neutral": 0},
        "delivery": {"positive": 0, "negative": 0, "neutral": 0},
        "quality": {"positive": 0, "negative": 0, "neutral": 0}
    }

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    # 🔥 PROCESS REVIEWS
    for review in reviews:
        try:
            parsed = analyze_review(review)   # ✅ NOW RETURNS DICT

            if not isinstance(parsed, dict):
                raise ValueError("Invalid AI response")

            results.append(parsed)

            # 🔹 STORE DB
            cursor.execute("""
            INSERT INTO reviews (review, result, category, created_at)
            VALUES (?, ?, ?, ?)
            """, (
                review,
                str(parsed),
                "general",
                datetime.now().isoformat()
            ))

            # 🔹 COUNT FEATURES
            features = parsed.get("features", {})

            for feature in feature_counts:
                sentiment = features.get(feature, "neutral")

                if sentiment not in ["positive", "negative", "neutral"]:
                    sentiment = "neutral"

                feature_counts[feature][sentiment] += 1

        except Exception as e:
            print("ERROR:", e)
            continue

    conn.commit()
    conn.close()

    # 🔹 PERCENTAGES
    feature_percentages = {}

    for feature in feature_counts:
        total = sum(feature_counts[feature].values())
        feature_percentages[feature] = {}

        for sentiment in feature_counts[feature]:
            count = feature_counts[feature][sentiment]
            percentage = (count / total) * 100 if total > 0 else 0
            feature_percentages[feature][sentiment] = round(percentage, 2)

    # 🔹 TREND
    mid = len(results) // 2
    first_half = results[:mid]
    second_half = results[mid:]

    trend = {}

    for feature in feature_counts:
        first_neg = sum(
            1 for r in first_half
            if r.get("features", {}).get(feature) == "negative"
        )
        second_neg = sum(
            1 for r in second_half
            if r.get("features", {}).get(feature) == "negative"
        )

        if second_neg > first_neg:
            trend[feature] = "increasing complaints"
        elif second_neg < first_neg:
            trend[feature] = "decreasing complaints"
        else:
            trend[feature] = "stable"

    # 🔥 INSIGHTS
    insights = []

    for feature, sentiments in feature_percentages.items():
        neg = sentiments["negative"]
        pos = sentiments["positive"]

        if neg > 30:
            insights.append(f"High dissatisfaction detected in {feature}.")
        elif pos > 50:
            insights.append(f"{feature.capitalize()} is performing well.")
        else:
            insights.append(f"{feature.capitalize()} shows mixed feedback.")

    # 🔹 CRITICAL ISSUE
    worst_feature = max(
        feature_percentages,
        key=lambda f: feature_percentages[f]["negative"]
    )

    insights.append(f"Critical issue: {worst_feature}")

    # 🔹 TREND INSIGHTS
    for feature, t in trend.items():
        if t == "increasing complaints":
            insights.append(f"{feature} complaints are increasing")

    return jsonify({
        "total_reviews": len(reviews),
        "feature_summary": feature_counts,
        "feature_percentages": feature_percentages,
        "trend": trend,
        "insights": insights,
        "results": results
    })


@app.route("/history")
def history():
    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM reviews")
    data = cursor.fetchall()

    conn.close()

    return jsonify(data)


if __name__ == "__main__":
    init_db()
    app.run(debug=True)