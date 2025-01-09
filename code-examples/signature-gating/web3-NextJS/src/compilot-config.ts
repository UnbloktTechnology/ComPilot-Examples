//This config file is used to generate a challenge by using the API created in the backend.

export const generateChallenge = async (params: any) => {
  const res = await fetch("/api/challenge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  return res.json();
};
