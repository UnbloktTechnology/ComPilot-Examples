import { useEffect, useState } from "react";

const useTestUser = () => {
  const [userId, setUserId] = useState<string>("random");

  useEffect(() => {
    // Check if userId exists in localStorage
    let storedUserId = localStorage.getItem("bankExampleUserId");

    if (!storedUserId) {
      // If no userId found, generate a random one
      storedUserId = Math.random().toString(36).substr(2, 9); // Generates a random string of 9 characters
      localStorage.setItem("bankExampleUserId", storedUserId);
    }

    // Set the userId state to the retrieved or generated userId
    setUserId(storedUserId);
  }, []);
  console.log("userId", userId);
  return { id: userId, name: "Alice" as const, avatar: "alice-user" as const };
};

export default useTestUser;
