"use client";

import React, { useEffect, useRef, useState } from "react";
import BackArrow from "../components/back-arrow/BackArrow";
import { supabase } from "../../lib/supabaseClient";

interface MessagesProps {
  onBack: () => void;
}

interface MessageRow {
  id: string;
  text: string;
  sender_id: string;
  created_at?: string;
}

interface User {
  id: string;
  platform_id: string;
  name: string;
  role: string;
}

export default function Messages({ onBack }: MessagesProps) {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ================= CURRENT USER =================
  useEffect(() => {
    const id = localStorage.getItem("currentUserId");
    if (id) setCurrentUserId(id);
    else console.error("No currentUserId found");
  }, []);

  // ================= USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (!error && data) setUsers(data as User[]);
    };
    fetchUsers();
  }, []);

  // ================= INITIAL MESSAGES =================
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data as MessageRow[]);
      }
    };
    fetchMessages();
  }, []);

  // ================= REALTIME (SINGLE SOURCE OF TRUTH) =================
  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as MessageRow;

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!input.trim() || !currentUserId) return;

    const messageText = input.trim();
    setInput("");

    try {
      const { error } = await supabase.from("messages").insert({
        text: messageText,
        sender_id: currentUserId,
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Error sending message:", err.message);
      alert("Failed to send message");
    }
  };

  const getSender = (id: string) => users.find((u) => u.id === id);

  // ================= AUTOSCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= STARFIELD =================
  const starCount = 80;
  const [stars, setStars] = useState<
    { left: number; top: number; size: number; opacity: number; duration: number }[]
  >([]);

  useEffect(() => {
    const tempStars = Array.from({ length: starCount }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 20 + 10,
    }));
    setStars(tempStars);
  }, []);

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const h = d.getHours();
    const m = d.getMinutes();
    const hh = h % 12 === 0 ? 12 : h % 12;
    const mm = m < 10 ? `0${m}` : m;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${hh}:${mm} ${ampm}`;
  };

  const getBubbleColor = (role: string | undefined, isMe: boolean) => {
    if (isMe) return "#0af";
    switch (role) {
      case "teacher":
        return "#4caf50";
      case "parent":
        return "#fbc02d";
      case "student":
        return "#e91e63";
      default:
        return "#888";
    }
  };

  const getTextColor = (role: string | undefined, isMe: boolean) => {
    if (isMe) return "black";
    return "black";
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Starfield */}
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${star.left}vw`,
            top: `${star.top}vh`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: "50%",
            backgroundColor: "white",
            opacity: star.opacity,
            pointerEvents: "none",
            animation: `twinkle ${star.duration}s infinite alternate`,
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.3; transform: translateY(0px); }
          to { opacity: 1; transform: translateY(1.5px); }
        }
      `}</style>

      {/* Back Arrow */}
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackArrow onBack={onBack} />
      </div>

      {/* Title */}
      <div style={{ padding: "20px", paddingTop: "70px", textAlign: "center", zIndex: 1 }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>Accountability Chat</h2>
        <div style={{ height: "1px", backgroundColor: "#333", marginTop: "12px" }} />
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 1,
        }}
      >
        {messages.length === 0 && (
          <p style={{ opacity: 0.5, textAlign: "center" }}>No messages yet.</p>
        )}

        {messages.map((msg) => {
          const sender = getSender(msg.sender_id);
          const isMe = msg.sender_id === currentUserId;

          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                maxWidth: "75%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {sender && (
                <span style={{ fontSize: "12px", opacity: 0.7 }}>
                  {sender.name} ({sender.role})
                </span>
              )}
              <div
                style={{
                  backgroundColor: getBubbleColor(sender?.role, isMe),
                  color: getTextColor(sender?.role, isMe),
                  padding: "12px 16px",
                  borderRadius: "16px",
                }}
              >
                {msg.text}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  opacity: 0.5,
                  marginTop: "2px",
                  alignSelf: "flex-end",
                }}
              >
                {formatTime(msg.created_at)}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "15px",
          borderTop: "1px solid #222",
          display: "flex",
          gap: "10px",
          backgroundColor: "#050505",
          zIndex: 1,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "14px",
            backgroundColor: "#111",
            color: "white",
            border: "1px solid #0af",
            borderRadius: "20px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "14px 20px",
            backgroundColor: "#0af",
            borderRadius: "20px",
            fontWeight: 600,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}









