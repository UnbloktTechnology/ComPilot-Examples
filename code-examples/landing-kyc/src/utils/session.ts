export const createSession = async (): Promise<{ token: string; expiresAt: number; externalCustomerId?: string }> => {
  const res = await fetch("/api/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return res.json();
}; 