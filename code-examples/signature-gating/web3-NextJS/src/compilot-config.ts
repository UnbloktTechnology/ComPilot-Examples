export const generateChallenge = async (params: any) => {
  console.log("🔵 generateChallenge called with:", params);
  const res = await fetch("/api/challenge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res.json();
};