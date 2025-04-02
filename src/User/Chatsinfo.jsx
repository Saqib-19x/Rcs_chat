/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet";
import { getChatsNumbers, searchChatsByNumber } from "@/Service/auth.service";
import { useNavigate } from "react-router-dom";
import Chatsmessage from "./Chatsmessage";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Chatdetails from "./Chatdetails";
import WebSocketComponent from "@/Routes/Websocket";
import { Info, ListFilter, MessageSquare, Search, Star } from "lucide-react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"; // WhatsApp-style arrows

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getChatLabels } from "@/Service/chat.service";
import AgentsLayout from "@/Layout/NewLayout";
import { MessageCircle, MessageSquareText, Send } from "lucide-react"; // Icons for platforms

export default function ChatInfo() {
  const [chatsLists, setChatsLists] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedChatInfo, setSelectedChatInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isActiveChatSelected, setIsActiveChatSelected] = useState(false);
  const [imageCache, setImageCache] = useState({});
  const [campaignHistory, setCampaignHistory] = useState({
    campaigns: [],
    latest: {
      campaignName: "",
      templateName: "",
    },
  });
  const webSocketRef = useRef();
  const navigate = useNavigate();
  const [position, setPosition] = React.useState("All Chats");
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState("");

  const fetchChatsNumber = async () => {
    try {
      const response = await getChatsNumbers();
      setChatsLists(response || []);
      console.log("Fetched chats:", response);
      console.log(response.length, "line number 39");

      response?.forEach((chat) => {
        console.log(chat.recentMessage?.isRead, "isRead");
      });
    } catch (error) {
      console.error("Error fetching chat data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatsNumber();
  }, []);

  const getCachedImageUrl = useCallback(
    (id) => {
      if (!imageCache[id]) {
        const newUrl = `https://picsum.photos/seed/${id}/200`;
        setImageCache((prev) => ({ ...prev, [id]: newUrl }));
        return newUrl;
      }
      return imageCache[id];
    },
    [imageCache]
  );

  const handleChatClick = (chatinfo) => {
    setSelectedPhoneNumber(chatinfo.phoneNumber);
    setSelectedChatInfo(chatinfo);
    setIsActiveChatSelected(true);
    setChatsLists((prevChats) =>
      prevChats.map((chat) =>
        chat.phoneNumber === chatinfo.phoneNumber
          ? { ...chat, recentMessage: { ...chat.recentMessage, isRead: true } }
          : chat
      )
    );
    navigate(`/chatinfo/${chatinfo._id}`);
  };

  useEffect(() => {
    setIsActiveChatSelected(false);
  }, []);

  const totalChats = chatsLists.length;

  // get chats Lables

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const data = await getChatLabels();
        console.log(
          "Fetched labels line number 113:",
          data.labels,
          "113 line number"
        ); // Debugging

        if (!Array.isArray(data.labels)) {
          throw new Error("Invalid labels format");
        }

        setLabels([...data.labels]); // Ensure it's an array
      } catch (err) {
        console.error("Error fetching labels:", err);
        setError(err.message);
        setLabels([]); // Ensure labels is always an array
      }
    };

    fetchLabels();
  }, []);

  //   search api here .....................................................

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() === "") {
        // If search query is cleared, reset to original state
        fetchChatsNumber();
      } else {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchChatsByNumber(searchQuery);
      console.log(results, "results787");
      setChatsLists(results);
    } catch (error) {
      console.error("Error fetching search results:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWebSocketMessage = useCallback((message) => {
    const sendTime = message.message.sendTime;
    const parsedTime = new Date(sendTime);

    if (isNaN(parsedTime.getTime())) {
      console.error("Invalid sendTime:", sendTime);
      return;
    }

    const incomingMessage = {
      text: message.message.text,
      time: parsedTime,
      type: "incoming",
      senderPhoneNumber: message.message.senderPhoneNumber,
      _id: message.message._id,
      isRead: false,
    };

    // Update chats list dynamically
    setChatsLists((prevChats) => {
      // Check if the phone number exists
      const updatedChats = prevChats.map((chat) => {
        if (chat.phoneNumber === incomingMessage.senderPhoneNumber) {
          return {
            ...chat,
            recentMessage: incomingMessage, // Update recent message
          };
        }
        return chat;
      });

      // If no chat with the phone number exists, create a new one
      if (
        !updatedChats.find(
          (chat) => chat.phoneNumber === incomingMessage.senderPhoneNumber
        )
      ) {
        updatedChats.push({
          phoneNumber: incomingMessage.senderPhoneNumber,
          recentMessage: incomingMessage,
        });
      }

      // Sort chats to show the most recent message on top
      return updatedChats.sort((a, b) => {
        const aTime = new Date(a.recentMessage.time);
        const bTime = new Date(b.recentMessage.time);
        return bTime - aTime; // Sort by descending time
      });
    });
  }, []);

  const handleCampaignHistoryUpdate = useCallback((history) => {
    setCampaignHistory(history);
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "whatsapp":
        return <MessageCircle className="w-4 h-4 text-green-500" />; // WhatsApp icon
      case "rcs":
        return <Send className="w-4 h-4 text-blue-500" />; // RCS icon
      case "sms":
        return <MessageSquareText className="w-4 h-4 text-gray-500" />; // SMS icon
      default:
        return <MessageSquareText className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Fragment>
      <AgentsLayout>
        <Helmet>
          <title>Chats | RCS Celetel</title>
        </Helmet>
        <WebSocketComponent
          onMessage={handleWebSocketMessage}
          ref={webSocketRef}
        />

        <div className="flex flex-col md:flex-row p-2 mt-2 h-[calc(100vh-75px)] space-x-0 md:space-x-2 overflow-hidden">
          {/* Sidebar */}
          {/* <div className=" h-full"> */}

          <Card className=" w-[25%] md:w-[25%]  flex flex-col">
            <div className="p-3 flex justify-between items-center shadow-sm rounded-lg">
              <div className="flex items-center gap-1">
                <h2 className="text-base font-semibold text-gray-900">Chats</h2>
                <span className="text-xs text-muted-foreground">
                  (
                  {
                    chatsLists.filter((chat) => !chat.recentMessage?.isRead)
                      .length
                  }{" "}
                  unread)
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={loading || labels.length === 0}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border-gray-300 shadow-sm"
                  >
                    <ListFilter className="w-4 h-4 text-gray-500" /> {position}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 p-2 shadow-md rounded-md">
                  <DropdownMenuLabel className="flex justify-center text-xs font-medium text-gray-700">
                    Select Labels
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {error ? (
                    <p className="text-xs text-red-500 px-2">{error}</p>
                  ) : labels.length === 0 ? (
                    <p className="text-xs text-gray-500 px-2">
                      No labels available
                    </p>
                  ) : (
                    <DropdownMenuRadioGroup
                      value={position}
                      onValueChange={(value) => setPosition(value)}
                      className="text-xs"
                    >
                      {labels.map((label) => (
                        <DropdownMenuRadioItem
                          key={label}
                          value={label}
                          className="text-xs"
                        >
                          {label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="p-4">
              <div className="relative">
                <Input
                  placeholder="Search numbers..."
                  className="pl-8 pr-3 py-2 text-xs rounded-md border focus:ring-2 focus:ring-blue-500/30 outline-none placeholder:text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            <div className="h-full overflow-hidden">
              <div className="overflow-y-auto max-h-96 custom-scrollbar">
                {loading ? (
                  <p>Loading...</p>
                ) : chatsLists.length === 0 ? (
                  <p className="text-center text-xs font-semibold">
                    No results found
                  </p>
                ) : (
                  chatsLists.map((chatinfo) => (
                    <div
                      key={chatinfo.recentMessage._id}
                      className={`border-b cursor-pointer transition-colors hover:bg-muted ${
                        selectedPhoneNumber === chatinfo.phoneNumber
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() => handleChatClick(chatinfo)}
                    >
                      <div className="flex p-4 items-center py-4 space-x-2">
                        {/* Avatar */}
                        <div className="relative">
                          <Avatar className="border-2 border-blue-300 shadow-md rounded-full">
                            <AvatarImage
                              src={getCachedImageUrl(
                                chatinfo.recentMessage._id
                              )}
                              alt="Avatar"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          {/* Platform Icon */}
                          <div className="absolute bottom-0 right-0 h-4 w-4 bg-white rounded-full p-0.5 shadow-md flex items-center justify-center">
                            {getPlatformIcon(chatinfo.platform)}
                          </div>
                        </div>

                        <div className="w-40 overflow-hidden">
                          <div className="flex space-x-1">
                            <p
                              className={`text-xs ${
                                chatinfo.recentMessage.isRead
                                  ? "font-normal"
                                  : "font-bold"
                              }`}
                            >
                              {chatinfo.phoneNumber}
                            </p>
                            <p>
                              {chatinfo.recentMessage.isSender ? (
                                <ArrowUpRight className="w-3 h-3 text-blue-500" />
                              ) : (
                                <ArrowDownLeft className="w-3 h-3 text-green-500" />
                              )}
                            </p>
                            <p className="text-xs font-bold text-green-500">
                              6
                            </p>
                          </div>

                          <p
                            className={`text-xs mt-1 text-muted-foreground truncate ${
                              !chatinfo.recentMessage.isRead
                                ? "font-bold"
                                : "font-normal"
                            }`}
                          >
                            {chatinfo.recentMessage.text}
                          </p>
                        </div>

                        <p className="text-xs text-gray-400">3m</p>
                        <p className="text-xs text-gray-400">
                          <Star className="w-3 h-3" />
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
          {/* </div> */}

          {/* Chat Section */}
          <div className="flex flex-1 flex-col h-full overflow-hidden">
            {isActiveChatSelected && (
              <Chatsmessage
                image={
                  selectedChatInfo?.recentMessage?._id
                    ? getCachedImageUrl(selectedChatInfo.recentMessage._id)
                    : undefined
                }
                phoneNumber={selectedPhoneNumber}
                sendMessage={(phoneNumber, text, chatId) =>
                  webSocketRef.current.sendMessage(phoneNumber, text, chatId)
                }
                type={selectedChatInfo?.recentMessage?.type || ""}
                text={selectedChatInfo?.recentMessage?.text || ""}
                time={selectedChatInfo?.recentMessage?.time || ""}
                onCampaignHistoryUpdate={handleCampaignHistoryUpdate}
              />
            )}
          </div>

          {/* Chat Details */}
          <div className="w-[25%] md:w-[25%] md:rounded-lg overflow-auto ">
            {isActiveChatSelected && selectedPhoneNumber && (
              <Chatdetails
                phoneNumber={selectedPhoneNumber}
                campaignHistory={campaignHistory || []}
              />
            )}
          </div>

          {!isActiveChatSelected && (
            <div className="flex justify-center items-center h-full w-full">
              <p className="text-gray-500 text-lg whitespace-nowrap text-center">
                Select a chat to view details
              </p>
            </div>
          )}
        </div>
      </AgentsLayout>
    </Fragment>
  );
}
