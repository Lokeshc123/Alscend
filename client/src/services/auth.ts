import api from "./api";
import { saveToken } from "./secureStorage";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/users/login", { email, password });

    const token = response.data.token;

    if (token) {
      // Save the token to secure storage
      await saveToken(token);
    }
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


export const registerUser = async (name : string , email : string , password : string) => {
  try {
    const response = await api.post("/users/register", { name, email, password });

    const token = response.data.token;

    if (token) {
      // Save the token to secure storage
      await saveToken(token);
    }
    return response.data;
  }
  catch (error: any) {
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
}