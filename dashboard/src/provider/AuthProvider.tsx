import type { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const request = new Request("http://localhost:4000/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    try {
      const response = await fetch(request);
      if (!response.ok) {
        return Promise.reject(new Error("Invalid login"));
      }
      if (response.ok) {
        const data = await response.json();
        const token = data.accessToken;

        //mapper for user data
        const user  = {
          ...data.user,
          id: data.user.user_id,
          name: data.user.user_name,
          email: data.user.user_email,
        }
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
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
