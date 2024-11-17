export const getScenarioWebhook = async (address: string) => {
  // wait 3 seconds to get the webhook response to be sure it is in redis
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await fetch(`/api/kyc/scenario-webhook?address=${address}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return (await response.json()) as unknown;
};
