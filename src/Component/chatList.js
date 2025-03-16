import { useState } from "react";
import "../resources/css/LeftPanel.css";

const LeftPanel = ({ chats = [], onSelectChat }) => {
  const [search, setSearch] = useState("");

  const filteredChats = chats
    .filter((chat) => chat.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="left-panel">
      <input
        type="text"
        className="search-bar"
        placeholder="Search chats..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="chat-list">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="chat-item"
              onClick={() => onSelectChat(chat)}
            >
              <div className="chat-name">
                {chat.name}
                <span className="tooltip">
                  {chat.name}
                </span>
              </div>
              <div className="chat-date">
                {new Date(chat.date).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="no-chats">No chats found.</div>
        )}
      </div>
    </div>
  );
};
export default LeftPanel;
