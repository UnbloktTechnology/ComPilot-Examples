//This config file is used to generate a challenge by using the API created in the backend.

export const generateChallengeKYB = async (params: any) => {
    try {
        const res = await fetch("/api/landing-kyb/challenge", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        if (!res.ok) {
            throw new Error('Failed to generate challenge');
        }

        return await res.json();
    } catch (error) {
        throw error;
    }
};
