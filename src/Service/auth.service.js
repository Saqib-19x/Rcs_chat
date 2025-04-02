import axios from "axios";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

console.log(API_URL, "API_URL");

export const loginUser = async (formData) => {
  console.log(formData);
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/agents/agents/login`,
      formData
    );

    // Calculating the expiry time for the token
    const expiryTime = new Date(
      new Date().getTime() + response.data.tokenExpiry * 60000
    );
    // const expiryTimeString = expiryTime.toLocaleString();

    const newLogin = {
      token: response.data.token,
      typerole: response.data.type,
      username: response.data.username,
      tokenExpiry: expiryTime,
    };

    // Retrieving the existing logins from the cookies
    let existingLogins = Cookies.get("logins");
    existingLogins = existingLogins ? JSON.parse(existingLogins) : [];

    // Adding the new login to the array
    existingLogins.push(newLogin);

    // Storing the updated array in the cookies with the token expiration time
    Cookies.set("logins", JSON.stringify(existingLogins), {
      expires: expiryTime,
    });

    console.log(newLogin.token, "whilelogintoken");
    console.log(newLogin.typerole, "whilelogintyperole");
    console.log(newLogin.username, "res1");
    console.log(newLogin.tokenExpiry, "tokenExpiry");

    return response.data;
  } catch (error) {
    console.log("Login error", error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const token = Cookies.get("logins")
      ? JSON.parse(Cookies.get("logins")).pop().token
      : null;

    if (!token) {
      console.log("No token found for logout.");
      return;
    }
    const response = await axios.post(
      `${API_URL}/api/v1/agents/agents/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Cookies.remove("logins");
    console.log("Successfully logged out");
    return response.data;
  } catch (error) {
    console.log("Logout error", error.message);
    throw error;
  }
};

export const getChatsHistory = async (chatId) => {
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

    const responseContact = await axios.get(
      `${API_URL}/api/v1/chat/chat-history/${chatId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(responseContact.data, "getChatsHistory");
    return responseContact.data;
  } catch (error) {
    console.log("error", error.message);
    throw error;
  }
};

export const sendMessage = async (formData) => {
  try {
    const logins = Cookies.get("logins");
    let token = null;

    if (logins) {
      try {
        const parsedLogins = JSON.parse(logins);
        // Find the login object with the desired typerole
        const currentLogin = parsedLogins.find(
          (login) => login.typerole === "agent"
        );
        // Change 'user' to the desired typerole if needed
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

    const responseContact = await axios.post(
      `${API_URL}/api/chat/send-message`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(responseContact.data, "responseContact");
    return responseContact.data;
  } catch (error) {
    console.log("error", error.message);
    throw error;
  }
};

export const getChatsNumbers = async () => {
  try {
    const logins = Cookies.get("logins");
    let token = null;

    if (logins) {
      try {
        const parsedLogins = JSON.parse(logins);
        // Find the login object with the desired typerole
        const currentLogin = parsedLogins.find(
          (login) => login.typerole === "agent"
        );
        // Change 'user' to the desired typerole if needed
        if (currentLogin) {
          token = currentLogin.token;
          console.log(token, "trrkj");
        }
      } catch (error) {
        console.error("Failed to parse logins cookie:", error.message);
      }
    }

    if (!token) {
      throw new Error("No valid token found for the specified role.");
    }

    const responseContact = await axios.get(
      `${API_URL}/api/v1/chat/recent-messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(responseContact.data, "getSmsTemplateList");
    return responseContact.data;
  } catch (error) {
    console.log("error", error.message);
    throw error;
  }
};

export const searchChatsByNumber = async (phoneNumber) => {
  console.log(phoneNumber, "number1072");

  try {
    const logins = Cookies.get("logins");
    let token = null;

    if (logins) {
      try {
        const parsedLogins = JSON.parse(logins);
        // Find the login object with the desired typerole
        const currentLogin = parsedLogins.find(
          (login) => login.typerole === "agent"
        );
        if (currentLogin) {
          token = currentLogin.token;
          console.log(currentLogin, "login profile");
        }
      } catch (error) {
        console.error("Failed to parse logins cookie:", error.message);
      }
    }

    if (!token) {
      throw new Error("No valid token found for the specified role.");
    }

    const response = await axios.get(
      `${API_URL}/api/chat/search?phoneNumber=${encodeURIComponent(
        phoneNumber
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data, "response data");
    return response.data;
  } catch (error) {
    console.log("Chat search error", error.message);
    throw error;
  }
};

export const enrollAgentsByLink = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/agents/enroll-agent`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data, "Agent Assigned Successfully");
    return response.data;
  } catch (error) {
    console.log("Error:", error.message);
    throw error;
  }
};

// get all agents
export const getAllAgents = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/agents/agents`);
    return response.data;
  } catch (error) {
    console.log("Error:", error.message);
    throw error;
  }
};



// get profiles 

export const getProfile = async () => {
  try {
    // Retrieve the 'logins' cookie and parse it
    const logins = Cookies.get("logins");
    let token = null;
    if (logins) {
      try {
        const parsedLogins = JSON.parse(logins);
        // Find the login object with the desired typerole
        const currentLogin = parsedLogins.find(
          (login) => login.typerole === "agent"
        );
        // Change 'user' to the desired typerole if needed
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
    // Make the profile request with the token
    const responseContact = await axios.get(
      `${API_URL}/api/v1/profile/details`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(responseContact.data, "responseContact");
    return responseContact.data;
  } catch (error) {
    console.log("Profile fetch error", error.message);
    throw error;
  }
};