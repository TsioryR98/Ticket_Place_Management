import type { AuthProvider } from "react-admin";

const backendUrl = process.env.BACKEND_URL;
export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const request = new Request("https://tickify-backend.onrender.com/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    try {
      const response = await fetch(request);
      if (response.ok) {
        const { tokens } = await response.json();
        localStorage.setItem("token", tokens.accessToken); // save token
        return Promise.resolve();
      }
      return Promise.reject(new Error("Invalid login"));
    } catch (error) {
      throw new Error("Network error");
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  checkAuth: function (params: any): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkError: function (error: any): Promise<void> {
    throw new Error("Function not implemented.");
  },
};
