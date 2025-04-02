/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
console.log(SOCKET_URL, "SOCKET_URL");

const WebSocketComponent = forwardRef(
  (
    {
      onMessage = () => {},
      onProgress = () => {},
      onSocket = () => {},
      onTypingStatus = () => {},
    },
    ref
  ) => {
    const [token, setToken] = useState("");
    const socketRef = useRef(null);

    // Memoize SOCKET_URL_NEW so it only recalculates if `token` changes
    const SOCKET_URL_NEW = useMemo(() => {
      return `${SOCKET_URL}?EIO=4&transport=websocket&token=${token}`;
    }, [token]);

    useEffect(() => {
      const loginsCookie = Cookies.get("logins");
      console.log("Logins Cookie:", loginsCookie);

      let newToken = "";
      if (loginsCookie) {
        try {
          newToken = JSON.parse(loginsCookie)[0]?.token || "";
          console.log("Parsed Token:", newToken);
        } catch (error) {
          console.error("Error parsing logins cookie:", error);
        }
      }

      setToken(newToken);
    }, []);

    useEffect(() => {
      if (!token || !SOCKET_URL_NEW) return;

      // Set up WebSocket connection
      socketRef.current = io(SOCKET_URL_NEW, {
        transports: ["websocket"],
        secure: true,
        rejectUnauthorized: false,
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to the server");
      });

      socketRef.current.on("message", (data) => {
        console.log(data, "message");
        handleIncomingData(data, "message");
      });

      socketRef.current.on("progressUpdate", (data) => {
        handleIncomingData(data, "progressUpdate");
      });

      socketRef.current.on("typingStatus", (data) => {
        console.log(data, "typingStatus");
        handleIncomingData(data, "typingStatus");
      });
      socketRef.current.on("failedStatus", (data) => {
        console.log(data, "failedStatus");
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Disconnected from the server:", reason);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      if (onSocket) onSocket(socketRef.current);

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SOCKET_URL_NEW]); // Only reconnect when SOCKET_URL_NEW changes

    const handleIncomingData = (data, type) => {
      if (data && typeof data === "object") {
        if (type === "message") {
          onMessage(data);
        } else if (type === "progressUpdate") {
          onProgress(data);
        } else if (type === "typingStatus") {
          onTypingStatus(data); // New handler for typing status
        }
      } else {
        try {
          const parsedData = JSON.parse(data);
          if (type === "message") {
            onMessage(parsedData);
          } else if (type === "progressUpdate") {
            onProgress(parsedData);
          } else if (type === "typingStatus") {
            onTypingStatus(parsedData); // New handler for typing status
          }
        } catch (error) {
          console.error("Error parsing data:", error);
        }
      }
    };

    const sendMessage = (phoneNumber, text) => {
      if (socketRef.current && socketRef.current.connected) {
        const messageData = { phoneNumber, text };
        socketRef.current.emit("message", JSON.stringify(messageData));
        console.log("Sent message:", messageData);
      } else {
        console.error("Socket is not connected.");
      }
    };

    useImperativeHandle(ref, () => ({
      sendMessage,
    }));

    return null;
  }
);

export default WebSocketComponent;
