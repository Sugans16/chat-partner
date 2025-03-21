import "../resources/css/chatComponent.css"

const chatComponent = ({ messages }) => {
  return (
    <div className="container">
    <div className="chat-container">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.content}
          </div>
        ))
      ) : (
        <div className="welcome-message">Welcome! How can I assist you today? 😊</div>
      )}
    </div>
  </div>
  );
};
export default chatComponent;
