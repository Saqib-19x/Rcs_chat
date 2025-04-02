import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined. Check environment variables.");
}

export const updateProfile = async (profile) => {
  try {
    const logins = Cookies.get("logins");
    let token = null;

    if (logins) {
      try {
        const parsedLogins = JSON.parse(logins);
        token = parsedLogins.find((login) => login.typerole === "agent")?.token;
      } catch (error) {
        console.error("Failed to parse logins cookie:", error.message);
      }
    }

    if (!token) {
      throw new Error("No valid token found for the specified role.");
    }

    const response = await axios.put(
      `${API_URL}/api/v1/profile/update`,
      profile,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Profile update error:", error.response?.data || error.message);
    throw error;
  }
};
