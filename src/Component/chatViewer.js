import React, { useEffect,useRef  } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import "../resources/css/chatComponent.css";

const ChatComponent = ({ messages }) => {
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // helper to extract code blocks and wrap with copy button
  const renderWithCopy = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    tempDiv.querySelectorAll("pre").forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code) return;
      hljs.highlightElement(code);
      const button = document.createElement("button");
      button.className = "copy-button";
      button.innerText = "Copy";

      button.onclick = () => {
        navigator.clipboard.writeText(code.innerText);
        button.innerText = "Copied!";
        setTimeout(() => (button.innerText = "Copy"), 2000);
      };

      pre.style.position = "relative";
      pre.appendChild(button);
    });

    return { __html: tempDiv.innerHTML };
  };

  return (
    <div className="container">
      <div className="chat-container">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role === "user" ? "user" : "assistant"}`}>
              <div dangerouslySetInnerHTML={renderWithCopy(marked(msg.content || ""))} />
            </div>
          ))
        ) : (
          <div className="welcome-message">Greetings! How can I assist you today? 😊</div>
        )}
         <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatComponent;