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
  const messages = [
    { type: "user", text: "Hey!.." },
    { type: "assistant", text: "Hello, how can I help you?" },
    {
      type: "user",
      text: "I need some help in coding, Do you think you can help me.?",
    },
    { type: "assistant", text: "Sure! What do you need help with?" },
  ];
  const chatList = [
    { id: 1, name: "Python Introduction", date: "2024-03-15" },
    { id: 2, name: "Greetings from Sudhan", date: "2024-03-14" },
    { id: 3, name: "Welcome Greetings", date: "2024-03-12" },
  ];
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

  const handleSendMessage = () => {
    if (textMessage.trim() !== "") {
      console.log("Sending Message:", textMessage);
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
