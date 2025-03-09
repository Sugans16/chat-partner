import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../resources/images/5_asfasw112.jpg";
import { Input, Tooltip, Button } from "antd";
import { UserOutlined, InfoCircleOutlined, LockOutlined } from "@ant-design/icons";
import "../resources/css/loginpage.css";
import "../resources/css/style.css";

const LoginPage = () => {
  const navigate = useNavigate(); 

  return (
    <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="login-box">
        <h2 className="login-title">Welcome</h2>

        <div className="input-group">
          <label className="input-label">Username</label>
          <Input
            className="input-field"
            placeholder="Enter your username"
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
            prefix={<LockOutlined />}
            suffix={
              <Tooltip title="Enter your password">
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
        </div>
        <Button type="primary" className="login-button">
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
