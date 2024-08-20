// Moved to utils/fetchAcessToken
// export const getAccessToken = async (address: string) => {
//   const response = await fetch(`/api/kyc/access-token?address=${address}`, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     method: "GET",
//   });
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const { accessToken } = await response.json();
//   return accessToken as string;

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
