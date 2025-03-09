import React from "react";
import { useNavigate } from "react-router-dom";
import { Input, Tooltip, Button } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, InfoCircleOutlined } from "@ant-design/icons";
import backgroundImage from "../resources/images/5_asfasw112.jpg";
import "../resources/css/signup.css";
import "../resources/css/style.css";

const SignupPage = () => {
  const navigate = useNavigate(); // For navigation

  return (
    <div className="signup-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="signup-box">
        <h2 className="signup-title">Join Us</h2>

        <div className="input-group">
          <label className="input-label">Username</label>
          <Input
            className="input-field"
            placeholder="Enter your username"
            prefix={<UserOutlined />}
            suffix={
              <Tooltip title="Enter a unique username">
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <Input
            className="input-field"
            type="email"
            placeholder="Enter your email"
            prefix={<MailOutlined />}
            suffix={
              <Tooltip title="Enter a valid email">
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <Input.Password
            className="input-field"
            placeholder="Create a password"
            prefix={<LockOutlined />}
            suffix={
              <Tooltip title="Password should be strong">
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
        </div>

        <Button type="primary" className="signup-button">
          Sign Up
        </Button>

        <div className="redirect-container">
          <span className="login-text">Already have an account?</span>
          <span className="login-link" onClick={() => navigate("/")}>
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
