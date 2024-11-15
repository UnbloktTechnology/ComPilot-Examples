//This config file is used to generate a challenge by using the API created in the backend.
//make sure the backend is running on port 5001
export const generateChallenge = async (params: any) => {
  const res = await fetch("http://localhost:5001/api/generate-web3-challenge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  return res.json();
};
