import { useState } from "react";

const ChatUI = () => {
    const [selectedChat, setSelectedChat] = useState(null);

    // Dummy data for chats and details
    const chatList = [
        { id: 1, name: "John Doe", lastMessage: "Hey, how's it going?" },
        { id: 2, name: "Jane Smith", lastMessage: "Let's catch up tomorrow!" },
        { id: 3, name: "David Johnson", lastMessage: "Check out this link." },
    ];

    const chatDetails = {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
    };

    // This will simulate selecting a chat from the chat list
    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
    };

    return (
        <div className="h-screen flex">
            {/* Chat List */}
            <div className="w-1/4 border-r border-gray-300 p-4">
                <h2 className="text-xl font-semibold mb-4">Chats</h2>
                <ul>
                    {chatList.map((chat) => (
                        <li
                            key={chat.id}
                            onClick={() => handleSelectChat(chat)}
                            className={`cursor-pointer p-2 ${selectedChat?.id === chat.id ? "bg-blue-100" : ""
                                }`}
                        >
                            <div className="font-semibold">{chat.name}</div>
                            <div className="text-sm text-gray-500">{chat.lastMessage}</div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Window */}
            <div className="w-2/4 p-4 flex flex-col justify-between border-r border-gray-300">
                <div>
                    <h2 className="text-xl font-semibold">
                        {selectedChat ? selectedChat.name : "Select a chat"}
                    </h2>
                    <div className="chat-messages mt-4 space-y-2">
                        {/* Example Messages */}
                        {selectedChat ? (
                            <>
                                <div className="bg-blue-200 p-2 rounded-lg">
                                    Hello, how can I help you?
                                </div>
                                <div className="bg-gray-200 p-2 rounded-lg">
                                    Can you tell me more about your services?
                                </div>
                            </>
                        ) : (
                            <p>No chat selected</p>
                        )}
                    </div>
                </div>
                {/* Chat Input */}
                {selectedChat && (
                    <div className="chat-input flex space-x-2 mt-4">
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                            placeholder="Type a message..."
                        />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            Send
                        </button>
                    </div>
                )}
            </div>

            {/* Chat Details/Info */}
            <div className="w-1/4 p-4">
                {selectedChat ? (
                    <>
                        <h2 className="text-xl font-semibold">Details</h2>
                        <div className="mt-4">
                            <div className="text-gray-600">Name: {chatDetails.name}</div>
                            <div className="text-gray-600">Email: {chatDetails.email}</div>
                            <div className="text-gray-600">Phone: {chatDetails.phone}</div>
                        </div>
                    </>
                ) : (
                    <p>Select a chat to view details</p>
                )}
            </div>
        </div>
    );
};

export default ChatUI;
