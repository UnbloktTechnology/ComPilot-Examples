//This config file is used to generate a challenge by using the API created in the backend.

export const generateChallenge = async (params: any) => {
  console.log("🔴 KYC Challenge function called with params:", params);

  const challengeParams = {
    type: 'KYC',
    ...params
  };

  const res = await fetch("/api/challenge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(challengeParams),
  });

  const data = await res.json();
  console.log("Challenge response:", data);
  return data;
};

export const generateChallengeKYB = async (params: any) => {
  console.log("🔵 KYB Challenge function called with params:", params);

  const challengeParams = {
    ...params,
    type: 'KYB'
  };
  console.log("Challenge params for KYB:", challengeParams);

  const res = await fetch("/api/challenge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(challengeParams),
  });

  const data = await res.json();
  console.log("Challenge message received:", data.message);
  return data;
};

// Ajout des fonctions de création de session
export const createSessionKYC = async () => {
  const response = await fetch('/api/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workflowType: 'KYC' })
  });
  return response.json();
};

export const createSessionKYB = async () => {
  const response = await fetch('/api/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workflowType: 'KYB' })
  });
  return response.json();
};
