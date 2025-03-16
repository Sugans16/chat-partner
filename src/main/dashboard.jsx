import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import db from "../resources/database/db";
import LeftPanel from "../Component/chatList"
import "../resources/css/dashboard.css"
import Chat from "../Component/chatViewer"




const Dashboard = () => {
  const messages = [
    { type: "user", text: "Hey!.." },
    { type: "assistant", text: "Hello, how can I help you?" },
    { type: "user", text: "I need some help in coding, Do you think you can help me.?" },
    { type: "assistant", text: "Sure! What do you need help with?" },
  ];
  const chatList = [
    { id: 1, name: "Python Introduction", date: "2024-03-15" },
    { id: 2, name: "Greetings from Sudhan", date: "2024-03-14" },
    { id: 3, name: "Welcome Greetings", date: "2024-03-12" },
  ];
  // const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState("");

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

  const handleLogout = async () => {
    if (loggedUser) {
      await db.users.where("username").equals(loggedUser).modify({ status: false });

      localStorage.removeItem("loggedUser");
      setLoggedUser(""); 
      navigate("/"); 
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {loggedUser} 🎉</h2>
      <div className="button-group">
        <Button type="default" onClick={() => navigate("/")}>Back</Button>
        <LeftPanel chats={chatList} />
        {/* <LeftPanel chats={chatList} onSelectChat={setSelectedChat} /> */}
        <Chat  messages={messages}/>
        <Button type="primary" danger onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;
