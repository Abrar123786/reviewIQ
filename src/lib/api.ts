export async function analyzeReviews(reviews: string[]) {
  const res = await fetch("http://127.0.0.1:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reviews }),
  });

  if (!res.ok) throw new Error("API failed");

  return res.json();
}