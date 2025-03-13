import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import db from "../resources/database/db";
import "../resources/css/dashboard.css"

const Dashboard = () => {
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
        <h1>Hello Buddy</h1>
        <Button type="primary" danger onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;
