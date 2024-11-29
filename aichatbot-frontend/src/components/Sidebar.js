// aichatbot-frontend/src/components/Sidebar.js
// Displays the conversation history. For now, we'll display a simple list of messages.
// We'll update the Sidebar component to display a list of conversations and include a button to create new conversations.
// Since conversations are now associated with users, there's no need to modify Sidebar.js unless you want to enhance it further. However, for completeness, ensure that Sidebar.js correctly receives and displays conversations.
// Description: Displays the list of conversations, includes a search bar and a button to create new conversations.

import React, { useState } from "react";
import ConversationList from "./ConversationList";

function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  onRenameConversation,
  onDeleteConversation,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>History</h3>
        <button onClick={onCreateConversation}>+ New</button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
        onRenameConversation={onRenameConversation}
        onDeleteConversation={onDeleteConversation}
        searchQuery={searchQuery}
      />
    </div>
  );
}

export default Sidebar;
