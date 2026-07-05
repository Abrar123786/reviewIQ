from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import analyze_review
import sqlite3
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ----------------------------------
# FEATURES TRACKED
# ----------------------------------
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


# ----------------------------------
# DATABASE INITIALIZATION
# ----------------------------------
def init_db():
    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        review TEXT NOT NULL,
        result TEXT NOT NULL,
        category TEXT,
        created_at TEXT
    )
    """)

    conn.commit()
    conn.close()


# ----------------------------------
# HOME ROUTE
# ----------------------------------
@app.route("/")
def home():
    return jsonify({
        "status": "running",
        "message": "AI Review Analyzer Running Successfully"
    })


# ----------------------------------
# ANALYZE REVIEWS
# ----------------------------------
@app.route("/analyze", methods=["POST"])
def analyze():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Invalid JSON request"
            }), 400

        reviews = data.get("reviews", [])

        if not reviews:
            return jsonify({
                "error": "No reviews provided"
            }), 400

        results = []
        processed_reviews = 0

        feature_counts = {
            feature: {
                "positive": 0,
                "negative": 0,
                "neutral": 0
            }
            for feature in FEATURES
        }

        conn = sqlite3.connect("reviews.db")
        cursor = conn.cursor()

        # ----------------------------------
        # PROCESS REVIEWS
        # ----------------------------------
        for review in reviews:

            try:
                parsed = analyze_review(review)

                if not isinstance(parsed, dict):
                    continue

                processed_reviews += 1
                results.append(parsed)

                cursor.execute("""
                INSERT INTO reviews
                (review, result, category, created_at)
                VALUES (?, ?, ?, ?)
                """, (
                    review,
                    json.dumps(parsed),
                    "general",
                    datetime.now().isoformat()
                ))

                features = parsed.get("features", {})

                for feature in FEATURES:

                    if feature not in features:
                        continue

                    sentiment = features[feature]

                    if sentiment not in [
                        "positive",
                        "negative",
                        "neutral"
                    ]:
                        sentiment = "neutral"

                    feature_counts[feature][sentiment] += 1

            except Exception as e:
                print("Review Error:", e)
                continue

        conn.commit()
        conn.close()

        # ----------------------------------
        # FEATURE PERCENTAGES
        # ----------------------------------
        feature_percentages = {}

        for feature in FEATURES:

            total = sum(
                feature_counts[feature].values()
            )

            feature_percentages[feature] = {}

            for sentiment in [
                "positive",
                "negative",
                "neutral"
            ]:

                count = feature_counts[feature][sentiment]

                percentage = (
                    count / total * 100
                    if total > 0 else 0
                )

                feature_percentages[feature][
                    sentiment
                ] = round(percentage, 2)

        # ----------------------------------
        # TREND ANALYSIS
        # ----------------------------------
        trend = {}

        mid = len(results) // 2

        first_half = results[:mid]
        second_half = results[mid:]

        for feature in FEATURES:

            first_neg = sum(
                1
                for r in first_half
                if r.get(
                    "features",
                    {}
                ).get(feature) == "negative"
            )

            second_neg = sum(
                1
                for r in second_half
                if r.get(
                    "features",
                    {}
                ).get(feature) == "negative"
            )

            if second_neg > first_neg:
                trend[feature] = "increasing complaints"

            elif second_neg < first_neg:
                trend[feature] = "decreasing complaints"

            else:
                trend[feature] = "stable"

        mentioned_features = set()

        for r in results:
            features = r.get("features", {})

            for feature, sentiment in features.items():
                if sentiment != "neutral":
                    mentioned_features.add(feature)
        # ----------------------------------
        # INSIGHTS
        # ----------------------------------
        print("NEW INSIGHT LOGIC RUNNING")
        insights = []

        for feature in mentioned_features:

            positive = feature_percentages[feature]["positive"]
            negative = feature_percentages[feature]["negative"]

            if negative >= 50:
                insights.append(
                    f"Customers reported significant issues with {feature}."
                )

            elif positive >= 50:
                insights.append(
                    f"Customers expressed satisfaction with {feature}."
                )

        # ----------------------------------
        # CRITICAL ISSUE
        # ----------------------------------
        negative_features = [
            f for f in mentioned_features
            if feature_percentages[f]["negative"] > 0
        ]

        if negative_features:

            worst_feature = max(
                negative_features,
                key=lambda f: feature_percentages[f]["negative"]
            )

            insights.append(
                f"Critical issue identified: {worst_feature}"
            )

        # ----------------------------------
        # TREND INSIGHTS
        # ----------------------------------
        for feature, value in trend.items():

            if (
                feature in mentioned_features
                and value == "increasing complaints"
            ):
                insights.append(
                    f"{feature.capitalize()} complaints are increasing."
                )
        # ----------------------------------
        # RESPONSE
        # ----------------------------------
        return jsonify({

            "status": "success",

            "total_reviews": len(reviews),

            "processed_reviews": processed_reviews,

            "feature_summary": feature_counts,

            "feature_percentages": feature_percentages,

            "trend": trend,

            "insights": insights,

            "results": results

        })

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# ----------------------------------
# HISTORY
# ----------------------------------
@app.route("/history", methods=["GET"])
def history():

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT *
    FROM reviews
    ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    return jsonify(rows)


# ----------------------------------
# CLEAR DATABASE
# ----------------------------------
@app.route("/clear", methods=["POST"])
def clear_database():

    conn = sqlite3.connect("reviews.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM reviews")

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Database cleared successfully"
    })


# ----------------------------------
# MAIN
# ----------------------------------
if __name__ == "__main__":

    init_db()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )