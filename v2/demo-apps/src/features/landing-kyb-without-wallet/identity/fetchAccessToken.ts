interface AccessTokenRequest {
  userId: string;
}

interface AccessTokenResponse {
  accessToken: string;
}

export async function fetchAccessToken(
  requestData: AccessTokenRequest,
): Promise<AccessTokenResponse> {
  try {
    const response = await fetch(`/api/landing-kyb-not-wallet/access-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = (await response.json()) as AccessTokenResponse;
    return data;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Error fetching access token");
  }
}
