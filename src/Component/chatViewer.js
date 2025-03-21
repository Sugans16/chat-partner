import React, { useEffect } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; 
import "../resources/css/chatComponent.css"

const ChatComponent = ({ messages }) => {
  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);

      if (!block.parentElement.querySelector(".copy-button")) {
        const button = document.createElement("button");
        button.innerText = "Copy";
        button.className = "copy-button";
        button.onclick = () => {
          navigator.clipboard.writeText(block.innerText);
          button.innerText = "Copied!";
          setTimeout(() => (button.innerText = "Copy"), 2000);
        };
        block.parentElement.style.position = "relative";
        block.parentElement.appendChild(button);
      }
    });
  }, [messages]);

  return (
    <div className="container">
    <div className="chat-container">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role === "user" ? "user" : "assistant"}`}>
            <div dangerouslySetInnerHTML={{ __html: marked(msg.content) }} />
          </div>
        ))
      ) : (
        <div className="welcome-message">Greetings! How can I assist you today? 😊</div>
      )}
    </div>
    </div>
  );
};

export default ChatComponent;