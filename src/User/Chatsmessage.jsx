/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AtSign, CheckCheck, Paperclip, Pencil, Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { getChatsHistory } from "@/Service/auth.service";
import WebSocketComponent from "@/Routes/Websocket";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Chatsmessage({
  phoneNumber,
  image,
  sendMessage,
  onCampaignHistoryUpdate,
}) {
  const { id: chatId } = useParams();
  // console.log("Chat ID:", chatId);
  const [chatsMessage, setChatsMessage] = useState({
    phoneNumber: phoneNumber,
    text: "",
    chatId: chatId,
  });
  const [assignAgentsLists, setAssignAgentsLists] = useState([]);
  const [selectedAgentNames, setSelectedAgentNames] = useState([]);
  const [assignResponse, setAssignResponse] = useState(null);
  const [messages, setMessages] = useState({});
  const [chatHistory, setChatHistory] = useState({});
  const [typingStatus, setTypingStatus] = useState(null);
  const chatContainerRef = useRef(null);
  const [campaignHistory, setCampaignHistory] = useState([]);

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        if (chatId) {
          const data = await getChatsHistory(chatId);
          const historicalMessages = data?.messages || [];
          const campaignData = data?.campaignHistory || [];

          // Get the latest campaign info
          const latestCampaign = campaignData[campaignData.length - 1] || {};

          // Only update if the data has changed
          onCampaignHistoryUpdate({
            campaigns: campaignData,
            latest: {
              campaignName: latestCampaign.campaignName || "No campaign",
              templateName: latestCampaign.templateName || "No template",
            },
          });

          setChatHistory((prevHistory) => ({
            ...prevHistory,
            [phoneNumber]: historicalMessages,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    if (phoneNumber) {
      setChatsMessage({
        phoneNumber: phoneNumber,
        text: "",
        chatId: chatId,
      });
      fetchChatHistory();
    }
  }, [phoneNumber, chatId]);

  // Add campaignHistory to the props being passed up
  useEffect(() => {
    if (onCampaignHistoryUpdate) {
      onCampaignHistoryUpdate(campaignHistory);
    }
  }, [campaignHistory, onCampaignHistoryUpdate]);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message) => {
    if (!message?.message?.senderPhoneNumber || !message?.message?.text) {
      console.error("Invalid message structure:", message);
      return;
    }

    const incomingMessage = {
      text: message.message.text,
      time: new Date(message.message.sendTime),
      type: "incoming",
      senderPhoneNumber: message.message.senderPhoneNumber,
    };

    setMessages((prevMessages) => {
      const currentMessages =
        prevMessages[incomingMessage.senderPhoneNumber] || [];

      // Check for duplicates
      const isDuplicate = currentMessages.some(
        (msg) =>
          msg.text === incomingMessage.text &&
          msg.time.getTime() === incomingMessage.time.getTime()
      );

      // If not a duplicate, add the message
      if (!isDuplicate) {
        return {
          ...prevMessages,
          [incomingMessage.senderPhoneNumber]: [
            ...currentMessages,
            incomingMessage,
          ],
        };
      }

      return prevMessages;
    });
  }, []);

  // Handle typing status
  const handleTypingStatus = (typingData) => {
    if (
      typingData?.typingStatus?.eventType === "IS_TYPING" &&
      typingData?.typingStatus?.senderPhoneNumber
    ) {
      setTypingStatus({
        senderPhoneNumber: typingData.typingStatus.senderPhoneNumber,
        time: new Date(typingData.typingStatus.time),
      });

      setTimeout(() => {
        setTypingStatus(null);
      }, 3000);
    }
  };

  // Handle message submission
  const handleChatsSubmit = async (event) => {
    event.preventDefault();

    // Log current state with explicit chatId
    console.log("Current chatsMessage:", chatsMessage);
    console.log("Current chatId from params:", chatId);

    if (chatsMessage.phoneNumber && chatsMessage.text) {
      console.log("Phone number and text are provided");

      // Ensure we're using the chatId from params
      const currentChatId = chatId;
      console.log("Using chatId:", currentChatId);

      // Create the outgoing message object
      const outgoingMessage = {
        text: chatsMessage.text,
        time: new Date(),
        type: "outgoing",
        phoneNumber: chatsMessage.phoneNumber,
        chatId: currentChatId,
      };
      console.log("Outgoing message:", outgoingMessage);

      // Send message via WebSocket with explicit chatId
      console.log("Sending message via WebSocket with chatId:", currentChatId);
      sendMessage(chatsMessage.phoneNumber, chatsMessage.text, currentChatId);

      // Update messages state
      setMessages((prevMessages) => {
        const currentMessages = prevMessages[chatsMessage.phoneNumber] || [];
        const updatedMessages = {
          ...prevMessages,
          [chatsMessage.phoneNumber]: [...currentMessages, outgoingMessage],
        };
        return updatedMessages;
      });

      // Clear the input text field but preserve chatId
      setChatsMessage({
        phoneNumber: chatsMessage.phoneNumber,
        text: "",
        chatId: currentChatId,
      });
    } else {
      console.log("Either phoneNumber or text is missing");
    }
  };

  // Scroll to bottom effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, chatHistory, typingStatus, phoneNumber]);

  // Render messages
  const renderMessages = () => {
    // Get messages and history for current phone number
    const currentMessages = messages[phoneNumber] || [];
    const currentHistory = chatHistory[phoneNumber] || [];
    const combinedMessages = [...currentHistory, ...currentMessages];

    return combinedMessages.map((message, index) => (
      <Message
        key={`message-${index}`}
        message={message}
        isIncoming={message.type === "incoming"}
        avatarSrc={image}
      />
    ));
  };

  // Render typing indicator
  const renderTypingIndicator = () => {
    if (typingStatus && typingStatus.senderPhoneNumber === phoneNumber) {
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={image} alt="Sender Avatar" />
          </Avatar>
          <div className="max-w-xs rounded-lg p-1 bg-border text-accent-foreground px-3 py-2 text-xs">
            <span className="typing-animation">Typing...</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // If no chat is selected
  if (!chatId) {
    return (
      <div className="p-4 w-full flex flex-col h-full items-center justify-center">
        <img src={graycel} className="w-7" alt="" />
        <p className="text-sm font-semibold mt-1 text-accent-foreground">
          No chat selected. Please select a chat to start messaging.
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="p-1 w-full h-full flex flex-col ">
        {/* Chat Header */}
        <div className="flex items-center justify-between gap-4 sticky   z-10 min-h-[60px] p-4 ">
          <Avatar className="w-10 h-10">
            <AvatarImage src={image} alt="User Avatar" />
            <AvatarFallback className="bg-gray-200  text-gray-600 text-lg">
              CN
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center flex-grow">
            <h3 className="text-lg font-semibold text-gray-900">
              {phoneNumber}
            </h3>
            <h3 className="text-sm font-medium text-green-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </h3>
          </div>
        </div>

        {/* WebSocket Component */}
        <WebSocketComponent
          onMessage={handleWebSocketMessage}
          onTypingStatus={handleTypingStatus}
        />

        {/* Chat Messages Container */}
        <div
          className="flex-grow p-2  flex flex-col gap-3 overflow-y-auto h-[calc(100vh-200px)] custom-scrollbar"
          ref={chatContainerRef}
        >
          {renderMessages()}
          {renderTypingIndicator()}
        </div>

        {/* Message Input Form */}
        <div className="px-4 sticky bottom-0 z-10  text-xs  ">
          <form
            onSubmit={handleChatsSubmit}
            className="flex items-center   rounded-md p-3  border  "
          >
            <TooltipProvider>
              {/* Paperclip Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Paperclip className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Input Field */}
            <input
              value={chatsMessage.text}
              onChange={(e) =>
                setChatsMessage({
                  ...chatsMessage,
                  text: e.target.value,
                })
              }
              placeholder="Type a message..."
              className="flex-1 text-xs outline-none placeholder:text-xs "
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleChatsSubmit(e);
                }
              }}
            />

            {/* Send Button */}
            <Button
              type="submit"
              className=" text-xs"
              size="sm"
              variant="outline"
            >
              <Send className="w-1 h-1" /> Send
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

// Message Component
// Message Component
const Message = ({ message, isIncoming, avatarSrc }) => {
  if (message.type === "system") {
    return (
      <div className="text-center text-xs text-gray-500 font-semibold my-2">
        {message.text}
      </div>
    );
  }

  return (
    <div
      className={`flex items-end gap-2 ${
        isIncoming ? "justify-start" : "justify-end"
      }`}
    >
      {isIncoming && (
        <img src={avatarSrc} alt="Avatar" className="w-8 h-8 rounded-full" />
      )}

      <div className="max-w-[60%] flex flex-col">
        {/* Message Bubble */}
        <div
          className={`rounded-lg px-4 py-2 text-sm border ${
            isIncoming ? "bg-gray-100 text-gray-800" : "bg-black text-white"
          }`}
        >
          <p className="break-all truncate text-ellipsis text-xs text-wrap">
            {message.text}
          </p>
        </div>

        {/* Timestamp & Read Receipts */}
        <span
          className={`text-[10px] text-gray-500 mt-1 ${
            isIncoming ? "text-left" : "text-right"
          }`}
        >
          {new Date(message.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {!isIncoming && <CheckCheck className="w-4 h-4 text-blue-500 self-end" />}
    </div>
  );
};
// chat message

// hiiii message
