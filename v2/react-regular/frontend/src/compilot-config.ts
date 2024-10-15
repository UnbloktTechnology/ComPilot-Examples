export const createSession = () => {
  // make sure your backend is running on port 5002
  return fetch("http://localhost:5002/api/create-session", { method: "POST" }).then(
    (res) => res.json()
  );
};
