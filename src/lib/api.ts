export async function analyzeReviews(reviews: string[]) {
  await new Promise((res) => setTimeout(res, 1000));

  return {
    total_reviews: reviews.length,
    results: reviews.map((r) => ({
      summary: r,
      overall_sentiment: Math.random() > 0.5 ? "positive" : "negative",
      features: {
        battery: "neutral",
        packaging: "neutral",
        delivery: "neutral",
        quality: "neutral",
      },
    })),
    insights: [
      "Battery feedback is mixed",
      "Packaging needs improvement",
      "Delivery complaints increasing",
    ],
  };
}