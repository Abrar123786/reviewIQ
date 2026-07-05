export const getAnalysisData = () => {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem("reviewAnalysis");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};