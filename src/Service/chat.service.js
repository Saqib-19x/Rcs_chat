import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export const getChatLabels = async () => {
  try {
    const logins = Cookies.get("logins");
    let token = null;

    if (logins) {
      try {
        const parsedLogins = JSON.parse(logins);
        const currentLogin = parsedLogins.find(
          (login) => login.typerole === "agent"
        );

        if (currentLogin) {
          token = currentLogin.token;
        }
      } catch (error) {
        console.error("Failed to parse logins cookie:", error.message);
      }
    }

    if (!token) {
      throw new Error("No valid token found for the specified role.");
    }

    const response = await axios.get(`${API_URL}/api/v1/chat/labels`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(response.data, "Chat Labels Data line number 37");
    return response.data;
  } catch (error) {
    console.error("Error fetching chat labels:", error.message);
    throw error;
  }
};


// Function to update chat label
export const updateChatLabel = async (chatId, label) => {
    try {
      const logins = Cookies.get("logins");
      let token = null;
  
      if (logins) {
        try {
          const parsedLogins = JSON.parse(logins);
          const currentLogin = parsedLogins.find(
            (login) => login.typerole === "agent"
          );
  
          if (currentLogin) {
            token = currentLogin.token;
          }
        } catch (error) {
          console.error("Failed to parse logins cookie:", error.message);
        }
      }
  
      if (!token) {
        throw new Error("No valid token found for the specified role.");
      }
  
      const response = await axios.put(
        `${API_URL}/api/chat/label/${chatId}`,
        { label }, // Correct body format
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Chat label updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating chat label:", error.message);
      throw error;
    }
  };