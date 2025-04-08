import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Dropdown, Menu } from "antd";
import {
  ContainerFilled,
  PlusOutlined,
  SendOutlined,
  IdcardFilled,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  SyncOutlined
} from "@ant-design/icons";
import db from "../resources/database/db";
import LeftPanel from "../Component/chatList";
import Chat from "../Component/chatViewer";
import "../resources/css/dashboard.css";

const Dashboard = () => {
  const { TextArea } = Input;
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [chatName, setChatName] = useState("New Chat");
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState("");
  const [isLeftPanelVisible, setLeftPanelVisible] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const storedUser = localStorage.getItem("loggedUser");
      if (storedUser) {
        setLoggedUser(storedUser);
      } else {
        navigate("/");
      }
    };
    checkLoggedInUser();
  }, [navigate]);

  useEffect(() => {
    const fetchChatList = async () => {
      if (loggedUser) {
        const chats = await db.chatLists
          .where("username")
          .equals(loggedUser)
          .toArray();
          const sortedChats = chats.sort((a, b) => b.id - a.id);
        setChatList(sortedChats);
      }
    };
    fetchChatList();
  }, [loggedUser]);

  const handleSendMessage = async () => {
    setLeftPanelVisible(false);
    if (textMessage.trim() === "") return;

    const userMessage = {
      role: "user",
      content: textMessage,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const requestBody = {
      messages: updatedMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 10000,
      top_p: 1,
      stream: false,
      stop: null,
    };

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);

      const data = await response.json();
      if (!data.choices || data.choices.length === 0) return;

      const assistantMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      const fullMessages = [...updatedMessages, assistantMessage];
      setMessages(fullMessages);

      let finalChatId = chatId;
      let finalChatName = chatName;

      // 🔍 If it's a new chat or name is still "New Chat", generate new title and insert
      if (!chatId || chatName === "New Chat") {
        const titleRequest = {
          messages: [
            ...fullMessages,
            {
              role: "user",
              content: "Based on this conversation, generate a short and meaningful title for this chat.",
            },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_completion_tokens: 30,
          top_p: 1,
          stream: false,
        };

        const titleResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(titleRequest),
        });

        const titleData = await titleResponse.json();
        finalChatName =
          titleData.choices?.[0]?.message?.content?.trim()?.replace(/["']/g, "") || "New Chat";

        finalChatId = await db.chatLists.add({
          username: loggedUser,
          name: finalChatName,
          date: new Date().toISOString().split("T")[0],
        });

        await db.chatMessages.add({
          id: finalChatId,
          chatId: finalChatId,
          username: loggedUser,
          name: finalChatName,
          messages: fullMessages,
        });

        setChatId(finalChatId);
        setChatName(finalChatName);
      } else {
        // 💾 Update existing chat
        await db.chatMessages
          .where({ chatId: finalChatId, username: loggedUser })
          .modify({ messages: fullMessages });
      }

      // 🔁 Refresh chat list UI
      const updatedChatList = await db.chatLists
        .where("username")
        .equals(loggedUser)
        .toArray();
        const sortedChats = updatedChatList.sort((a, b) => b.id - a.id);
      setChatList(sortedChats);
    } catch (error) {
      console.error("Error during message send:", error);
    }

    setTextMessage("");
    
  };

  const handleSelectChat = async (chat) => {
    const chatMessages = await db.chatMessages
      .where({ chatId: chat.id, username: loggedUser })
      .toArray();

    if (chatMessages.length > 0) {
      const selectedMessages = chatMessages[0].messages;
      setMessages(selectedMessages);
      setChatId(chat.id);
      setChatName(chat.name);
    } else {
      setMessages([]);
      setChatId(null);
      setChatName("New Chat");
    }

    setLeftPanelVisible(false);
  };

  const handleLogout = async () => {
    if (loggedUser) {
      await db.users.where("username").equals(loggedUser).modify({ status: false });
      localStorage.removeItem("loggedUser");
      setLoggedUser("");
      navigate("/");
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<SettingOutlined />}>
        Configuration
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        Account
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="dashboard-container">
      <h2>Welcome, {loggedUser} 🎉</h2>
      <Button
        type="default"
        onClick={() => setLeftPanelVisible(!isLeftPanelVisible)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: "10",
          fontSize: "larger",
        }}
        className="toggle-button"
        title="Chat List"
      >
        <ContainerFilled />
      </Button>
      <Button
        type="default"
        onClick={() => window.location.reload()}
        style={{
          position: "absolute",
          top: "20px",
          left: "80px",
          zIndex: "10",
          fontSize: "larger",
        }}
        className="toggle-button"
        title="Start New Chat"
      >
      <SyncOutlined />
      </Button>
      <div className="button-group">
        {isLeftPanelVisible && <LeftPanel chats={chatList} onSelectChat={handleSelectChat} />}
        <Chat messages={messages} />
      </div>

      <div className="chat-input-container">
        <button className="icon-button" onClick={() => console.log("Add clicked")} title="Add">
          <PlusOutlined />
        </button>
        <TextArea
          placeholder="Type your message..."
          autoSize={{ minRows: 2, maxRows: 6 }}
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button className="icon-button send" onClick={handleSendMessage} title="Send">
          <SendOutlined />
        </button>
      </div>

      <Dropdown overlay={menu} placement="bottomRight">
        <Button
          type="default"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: "10",
            fontSize: "larger",
          }}
          className="toggle-button"
          
        >
          <IdcardFilled />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Dashboard;
