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
    if (!id) {
      console.error("No currentUserId found");
      return;
    }
    setCurrentUserId(id);
  }, []);

  // ================= USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (!error && data) setUsers(data as User[]);
    };
    fetchUsers();
  }, []);

  // ================= MESSAGES =================
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) setMessages(data as MessageRow[]);
    };
    fetchMessages();
  }, []);

  // ================= REALTIME =================
  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as MessageRow]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ================= SEND =================
  const sendMessage = async () => {
    if (!input.trim() || !currentUserId) return;

    const { error } = await supabase.from("messages").insert({
      text: input.trim(),
      sender_id: currentUserId,
    });

    if (error) {
      console.error("Error sending message:", error.message);
      return;
    }

    setInput("");
  };

  const getSender = (id: string) => users.find((u) => u.id === id);

  // ================= AUTOSCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= STARS =================
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([]);
  useEffect(() => {
    const tempStars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5,
    }));
    setStars(tempStars);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prev) =>
        prev.map((star) => ({
          ...star,
          x: (star.x + Math.random() * 0.3) % window.innerWidth,
          y: (star.y + Math.random() * 0.3) % window.innerHeight,
          opacity: Math.min(Math.max(star.opacity + (Math.random() - 0.5) * 0.05, 0.3), 1),
        }))
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100vh", backgroundColor: "black", color: "white", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Starfield */}
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            backgroundColor: "white",
            opacity: star.opacity,
            pointerEvents: "none",
          }}
        />
      ))}

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
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", zIndex: 1 }}>
        {messages.length === 0 && <p style={{ opacity: 0.5, textAlign: "center" }}>No messages yet.</p>}

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
                  backgroundColor: isMe ? "#0af" : "#444",
                  color: isMe ? "black" : "white",
                  padding: "12px 16px",
                  borderRadius: "16px",
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "15px", borderTop: "1px solid #222", display: "flex", gap: "10px", backgroundColor: "#050505", zIndex: 1 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "14px", backgroundColor: "#111", color: "white", border: "1px solid #0af", borderRadius: "20px" }}
        />
        <button onClick={sendMessage} style={{ padding: "14px 20px", backgroundColor: "#0af", borderRadius: "20px", fontWeight: 600 }}>
          Send
        </button>
      </div>
    </div>
  );
}


