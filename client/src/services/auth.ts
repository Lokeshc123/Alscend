import api from "./api";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/users/login", { email, password });
    return response.data;
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      // Backend responded with an error (e.g., 400, 401)
      errorMessage = error.response.data.message || "Login failed";
    } else if (error.request) {
      // Request was made but no response received (e.g., server down)
      errorMessage = "Server not responding. Please try again later.";
    } else {
      // Something else went wrong
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
