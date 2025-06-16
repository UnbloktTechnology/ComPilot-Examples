export const generateChallengeKYC = async (params: any) => {
  console.log("🔵 generateChallengeKYC called with:", params);
  const res = await fetch("/api/challenge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, workflowType: "kyc" }),
  });
  return res.json();
};

export const generateChallengeSignatureGating = async (params: any) => {
  console.log("🔵 generateChallengeSignatureGating called with:", params);
  const res = await fetch("/api/challenge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, workflowType: "signatureGating" }),
  });
  return res.json();
};