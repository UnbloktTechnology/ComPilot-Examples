//This config file is used to generate a challenge by using the API created in the backend.

export const createSession = async (): Promise<{ token: string; expiresAt: number; externalCustomerId?: string }> => {
  const res = await fetch("/api/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return res.json();
};
