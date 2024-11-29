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
            const errorData = await res.json();
            console.error('Challenge generation failed:', errorData);
            throw new Error('Failed to generate challenge');
        }

        const data = await res.json();
        console.log('Challenge generated:', data);
        return data;
    } catch (error) {
        console.error('Error generating challenge:', error);
        throw error;
    }
};
