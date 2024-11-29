// aichatbot-frontend/src/components/ConversationItem.js
// A new component to represent each conversation item.
// Description: Represents an individual conversation with options to rename and delete.

import React, { useState } from "react";

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onRename,
  onDelete,
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(conversation.name);

  const handleRename = () => {
    if (newName.trim() === "") {
      alert("Conversation name cannot be empty.");
      return;
    }
    onRename(conversation.id, newName);
    setIsRenaming(false);
  };

  return (
    <li
      className={`conversation-item ${isActive ? "active" : ""}`}
      onClick={() => onSelect(conversation.id)}
    >
      {isRenaming ? (
        <div className="rename-container">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onClick={(e) => e.stopPropagation()} // Prevent triggering onSelect
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRename();
            }}
          >
            Save
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(false);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span>{conversation.name}</span>
          <div className="action-buttons">
            <button
              className="rename-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
            >
              Rename
            </button>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conversation.id);
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default ConversationItem;
