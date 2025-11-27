import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { databases, realtime, IDGen, QueryBuilder } from "../appwrite";
import "../styles/PageContainer.css";

const DB_ID = "692763d30025a34057be";
const CONVO_ID = "conversations";
const MSG_ID = "messages";

const ChatPage = () => {
  const { itemId, ownerId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const borrowerId = currentUser?._id;

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const chatBoxRef = useRef(null);
  const unsubscribeRef = useRef(null); // Store unsubscribe function

  // Scroll to the bottom of the chat window
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  // Load or create a conversation
  useEffect(() => {
    async function loadOrCreateConversation() {
      const result = await databases.listDocuments(DB_ID, CONVO_ID, [
        QueryBuilder.equal("itemId", itemId),
        QueryBuilder.equal("borrowerId", borrowerId),
      ]);

      let convo;

      if (result.total > 0) {
        convo = result.documents[0];
      } else {
        convo = await databases.createDocument(DB_ID, CONVO_ID, IDGen.unique(), {
          itemId,
          ownerId,
          borrowerId,
        });
      }

      setConversation(convo);
    }

    if (itemId && borrowerId) {
      loadOrCreateConversation();
    }
  }, [itemId, borrowerId]);

  // Load existing messages
  useEffect(() => {
    if (!conversation) return;

    async function loadMessages() {
      const res = await databases.listDocuments(DB_ID, MSG_ID, [
        QueryBuilder.equal("conversationId", conversation.$id),
        QueryBuilder.orderAsc("$createdAt"),
      ]);

      setMessages(res.documents);
      scrollToBottom();
    }

    loadMessages();
  }, [conversation]);

  // Listen to realtime message updates
  useEffect(() => {
    if (!conversation) return;

    const channel = `databases.${DB_ID}.collections.${MSG_ID}.documents`;

    const unsubscribe = realtime.subscribe(channel, (event) => {
      if (
        event.events.includes("databases.*.collections.*.documents.*.create") &&
        event.payload.conversationId === conversation.$id
      ) {
        setMessages((prev) => [...prev, event.payload]);
        scrollToBottom();
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
        } catch (e) {
          console.log("ignore unsubscribe error:", e);
        }
      }
    };
  }, [conversation]);

  // Send a new message
  const sendMessage = async () => {
    if (!text.trim()) return;

    await databases.createDocument(DB_ID, MSG_ID, IDGen.unique(), {
      conversationId: conversation.$id,
      senderId: borrowerId,
      receiverId: ownerId,
      content: text,
      sentAt: new Date().toISOString(),
    });

    setText("");
  };

  if (!conversation) {
    return <div className="page-container">Loading chat...</div>;
  }

  return (
    <div className="page-container chat-page">
      <h2>Chat</h2>

      {/* Chat message list */}
      <div
        ref={chatBoxRef}
        style={{
          height: "60vh",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: "8px",
          background: "#fafafa",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.$id}
            style={{
              margin: "8px 0",
              textAlign: msg.senderId === borrowerId ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "10px",
                background:
                  msg.senderId === borrowerId ? "#4c8bf5" : "#e5e5ea",
                color: msg.senderId === borrowerId ? "white" : "black",
                maxWidth: "60%",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input field and send button */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 9,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            color: "black",
            backgroundColor: "white",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            flex: 1,
            padding: "10px 8px",
            borderRadius: "8px",
            background: "#4c8bf5",
            color: "white",
            border: "none",
            whiteSpace: "nowrap",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
