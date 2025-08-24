import api from "./api";
import { getToken } from "./secureStorage";

export const getAllCategories = async () => {
  try {
    const response = await api.get("/tasks/get-categories");
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

export const getUserTasks = async (token: string) => {
  try {
    const response = await api.get("/tasks/get-tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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


export const getRecommendedTasks = async (token: string , mode: string, categories: string[]) => {
  try {
    const response = await api.get("/recommendations/newTasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        mode: mode,
        categories: categories
      }
    });
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