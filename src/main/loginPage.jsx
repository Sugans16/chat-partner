import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../resources/images/5_asfasw112.jpg";
import { Input, Tooltip, Button } from "antd";
import { UserOutlined, InfoCircleOutlined, LockOutlined } from "@ant-design/icons";
import "../resources/css/loginpage.css";
import "../resources/css/style.css";
import db from "../resources/database/db";

const LoginPage = () => {
  const navigate = useNavigate(); 
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const storedUser = localStorage.getItem("loggedUser"); 

      if (storedUser) {
        const user = await db.users.where("username").equals(storedUser).first();
        if (user && user.status === true) {
          navigate("/dashboard"); 
        }
      }
    };

    checkLoggedInUser();
  }, [navigate]);

  const handleLogin = async () => {
    const user = await db.users.get({ username: userName });

    if (user) {
      if (user.password === password) {
        await db.users.update(user.id, { status: true });
        localStorage.setItem("loggedUser", userName); 
        alert("Login Successful! 🎉");
        navigate("/dashboard"); 
      } else {
        alert("Incorrect password! ❌");
      }
    } else {
      alert("User not found! ❌");
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="login-box">
        <h2 className="login-title">Welcome</h2>

        <div className="input-group">
          <label className="input-label">Username</label>
          <Input
            className="input-field"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            prefix={<UserOutlined />}
            suffix={
              <Tooltip title="Enter your username">
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <Input.Password
            className="input-field"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockOutlined />}
            suffix={
              <Tooltip title="Enter your password">
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
        </div>
        <Button type="primary" className="login-button" onClick={handleLogin}>
          Login
        </Button>
        <div className="register-container">
          <span className="register-text">New here?</span>
          <span className="register-link" onClick={() => navigate("/signup")}>
            Create an account
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
