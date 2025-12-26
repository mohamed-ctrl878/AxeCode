import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// SocketChatTest.jsx
// Single-file React component to test Socket.io integration with Strapi
// Usage:
// 1. Put this file in src/components/SocketChatTest.jsx
// 2. Install dependency: npm install socket.io-client
// 3. Set env vars in project root (.env) or rely on defaults below:
//    REACT_APP_STRAPI_URL=http://localhost:1337
//    REACT_APP_SOCKET_URL=http://localhost:1337
// 4. Import and render <SocketChatTest /> in your App
//
// Purpose: connect to a Socket.io server, join a conversation room, listen for "new-message"
// events and send messages through Strapi REST so the lifecycle hook broadcasts them.

export default function SocketChatTest() {
  const STRAPI_URL = "http://localhost:1338";
  const SOCKET_URL = STRAPI_URL;

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [conversationId, setConversationId] = useState(1);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(1);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesRef = useRef([]);
  messagesRef.current = messages;

  // helper to append message safely
  const pushMessage = (m) => {
    setMessages((prev) => {
      // avoid duplicates if same id exists
      if (!m || !m.id) return [...prev, m];
      if (prev.some((x) => x.id === m.id)) return prev;
      return [...prev, m];
    });
  };

  // create socket and attach listeners
  const connectSocket = () => {
    if (socket) return; // already connected

    const s = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      autoConnect: true,
    });

    s.on("connect", () => {
      console.log("Socket connected", s.id);
      setConnected(true);
      // join the current conversation if provided
      if (conversationId) s.emit("join-conversation", Number(conversationId));
    });

    s.on("disconnect", (reason) => {
      console.log("Socket disconnected", reason);
      setConnected(false);
      setSocket(null);
    });

    s.on("connect_error", (err) => {
      console.error(
        "Socket connect_error",
        err && err.message ? err.message : err
      );
    });

    s.on("new-message", (msg) => {
      console.log("new-message event", msg);
      pushMessage(msg);
    });

    setSocket(s);
  };

  // cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinConversation = () => {
    if (!socket) return;
    socket.emit("join-conversation", Number(conversationId));
    console.log(`Requested join-conversation ${conversationId}`);
  };

  const leaveConversation = () => {
    if (!socket) return;
    socket.emit("leave-conversation", Number(conversationId));
    console.log(`Requested leave-conversation ${conversationId}`);
  };

  const disconnectSocket = () => {
    if (!socket) return;
    socket.disconnect();
    setSocket(null);
    setConnected(false);
  };

  // send message via Strapi REST so lifecycle will broadcast
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch(`${STRAPI_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          data: {
            text: text.trim(),
            users_permissions_user: Number(userId),
            conversation: Number(conversationId),
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to send message", res.status, errText);
        alert("Failed to send message: " + res.status);
        return;
      }

      const payload = await res.json();
      console.log("Message saved (server response):", payload);
      setText("");
      // Do not push message locally; lifecycle should broadcast it
    } catch (e) {
      console.error(e);
      alert("Error sending message: " + (e.message || e));
    }
  };

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  // small helper to render a safe string
  const safeText = (val) =>
    val === undefined || val === null ? "" : String(val);

  // UI
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 16,
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>
        SocketChatTest (Strapi + Socket.io)
      </h2>

      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <label style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 12 }}>Strapi URL</span>
          <input
            value={STRAPI_URL}
            disabled
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 12 }}>Socket URL</span>
          <input
            value={SOCKET_URL}
            disabled
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 12 }}>
            JWT Token (optional — for authenticated sockets & REST)
          </span>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste JWT here or leave empty for unauthenticated"
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 12 }}>Your user ID (sender)</span>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 12 }}>Conversation ID</span>
          <input
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={connectSocket}
          disabled={!!socket}
          style={{
            padding: "8px 12px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Connect Socket
        </button>

        <button
          onClick={joinConversation}
          style={{
            padding: "8px 12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Join Conversation
        </button>

        <button
          onClick={leaveConversation}
          style={{
            padding: "8px 12px",
            background: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Leave Conversation
        </button>

        <button
          onClick={disconnectSocket}
          style={{
            padding: "8px 12px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Disconnect
        </button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 6 }}>
          Connection:{" "}
          {connected ? (
            <span style={{ color: "#16a34a" }}>Connected</span>
          ) : (
            <span style={{ color: "#dc2626" }}>Disconnected</span>
          )}
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: 12,
            height: 240,
            overflow: "auto",
            background: "#f9fafb",
          }}
        >
          {messages.length === 0 ? (
            <div style={{ color: "#6b7280" }}>
              No messages yet — listen for <code>new-message</code> events
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  padding: 8,
                  borderRadius: 6,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  background: "white",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {safeText(m?.sender?.id ?? m?.sender ?? "unknown")}
                </div>
                <div style={{ fontSize: 13, color: "#111827" }}>
                  {safeText(m?.text ?? (m?.attributes && m.attributes.text))}
                </div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>
                  {safeText(m?.createdAt ?? m?.attributes?.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message to send via REST (will trigger lifecycle & broadcast)"
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 12px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Send
        </button>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
        Notes: This component sends messages through Strapi REST API so that
        lifecycles run and broadcast through the socket. If you want to emit
        directly via socket (not recommended for persistence), you can add a{" "}
        <code>{"socket.emit('send-message', {{}})"}</code> producer in this
        component.
      </div>
    </div>
  );
}
