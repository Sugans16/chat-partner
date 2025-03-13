import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Tooltip, Button } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, InfoCircleOutlined, PhoneOutlined } from "@ant-design/icons";
import backgroundImage from "../resources/images/5_asfasw112.jpg";
import "../resources/css/signup.css";
import "../resources/css/style.css";
import db from "../resources/database/db";

const SignupPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

const addUser = async () => {
 await db.users.add({ username:userName, email, phonenumber: parseInt(phoneNumber), password,  status: false });
 alert("Account Created Successfully")
 setUserName("");
 setEmail("");
 setPhoneNumber("");
 setPassword("");
 navigate("/")
}

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
            value = {userName}
            onChange={(e)=> setUserName(e.target.value)}
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
            value = {email}
            onChange={(e)=> setEmail(e.target.value)}
            suffix={
              <Tooltip title="Enter a valid email">
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
        </div>
        <div className="input-group">
          <label className="input-label">Phone Number:</label>
          <Input type="number" min="0"
            className="input-field"
            placeholder="Enter your phone number"
            value = {phoneNumber}
            onChange={(e)=> setPhoneNumber(e.target.value)}
            prefix={<PhoneOutlined />}
            suffix={
              <Tooltip title="Enter your phone number">
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
            value = {password}
            onChange={(e)=> setPassword(e.target.value)}
            prefix={<LockOutlined />}
            suffix={
              <Tooltip title="Password should be strong">
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
        </div>

        <Button type="primary" className="signup-button" onClick={addUser}>
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
