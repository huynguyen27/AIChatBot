// aichatbot-frontend/src/components/ConversationList.js
// A new component to list all conversations.
// Description: Renders the list of conversations, integrating rename and delete functionalities.

import React from "react";
import ConversationItem from "./ConversationItem";

function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
  searchQuery,
}) {
  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ul className="conversation-list">
      {filteredConversations.length > 0 ? (
        filteredConversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeConversationId}
            onSelect={onSelectConversation}
            onRename={onRenameConversation}
            onDelete={onDeleteConversation}
          />
        ))
      ) : (
        <li className="no-conversations">No conversations found.</li>
      )}
    </ul>
  );
}

export default ConversationList;
