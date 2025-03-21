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
} from "@ant-design/icons";
import db from "../resources/database/db";
import LeftPanel from "../Component/chatList";
import Chat from "../Component/chatViewer";
import "../resources/css/dashboard.css";

const Dashboard = () => {
  const { TextArea } = Input;
  // const messages = [];
  const [messages, setMessages] = useState([ ]);
  const [chatList, setChatList] = useState([ { id: 1, name: "Python Introduction", date: "2024-03-15" },
    { id: 2, name: "Greetings from Sudhan", date: "2024-03-14" },
    { id: 3, name: "Welcome Greetings", date: "2024-03-12" } ]);
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

  const handleSendMessage = async () => {
    if (textMessage.trim() !== "") {
      console.log("Sending Message:", textMessage);
      const userMessage = {
        role: "user",
        content: textMessage
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
  
      const requestBody = {
        messages: [...messages, userMessage],
        model: "llama-3.3-70b-versatile",
        temperature: 1,
        max_completion_tokens: 10000,
        top_p: 1,
        stream: false,
        stop: null
      };
  
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("AI Response:", data);
        if (data.choices && data.choices.length > 0) {
          const assistantMessage = {
            role: "assistant",
            content: data.choices[0].message.content
          };
  
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        }
  
      } catch (error) {
        console.error("Error fetching response:", error);
      }
  
      setTextMessage(""); 
    }
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
      >
        <ContainerFilled />
      </Button>
      <div className="button-group">
        {isLeftPanelVisible && <LeftPanel chats={chatList} />}
        <Chat messages={messages} />
      </div>
      <div className="chat-input-container">
        <button
          className="icon-button"
          onClick={() => console.log("Add clicked")}
        >
          <PlusOutlined />
        </button>
        <TextArea
          placeholder="Type your message..."
          autoSize={{ minRows: 2, maxRows: 6 }}
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
        />
        <button className="icon-button send" onClick={handleSendMessage}>
          <SendOutlined />
        </button>
      </div>
      <Dropdown overlay={menu} placement="bottomRight">
        <Button
          type="default"
          style={{ position: "absolute", top: "20px", right: "20px", zIndex: "10", fontSize: "larger" }}
          className="toggle-button"
        >
          <IdcardFilled />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Dashboard;
