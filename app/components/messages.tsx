"use client";

import React, { useEffect, useRef, useState } from "react";
import BackArrow from "../components/back-arrow/BackArrow";
import { supabase } from "../../lib/supabaseClient";

interface MessagesProps {
  onBack: () => void;
}

interface MessageRow {
  id: string;
  client_id?: string;
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
  }, []);

  // ================= USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("users").select("*");
      if (data) setUsers(data as User[]);
    };
    fetchUsers();
  }, []);

  // ================= INITIAL MESSAGES =================
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (data) setMessages(data as MessageRow[]);
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
        (payload: { new: MessageRow }) => {
          const incoming = payload.new;

          setMessages((prev) => {
            const index = prev.findIndex(
              (m) => m.client_id && m.client_id === incoming.client_id
            );
            if (index !== -1) {
              const newArr = [...prev];
              newArr[index] = incoming; // replace temp with real message
              return newArr;
            }
            return [...prev, incoming]; // append new message
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

    const clientId = crypto.randomUUID();

    const optimisticMessage: MessageRow = {
      id: clientId,
      client_id: clientId,
      text: input.trim(),
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
    };

    // Show message instantly
    setMessages((prev) => [...prev, optimisticMessage]);
    setInput("");

    // Insert into DB with client_id
    await supabase.from("messages").insert({
      text: optimisticMessage.text,
      sender_id: optimisticMessage.sender_id,
      client_id: clientId,
    });
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
    setStars(
      Array.from({ length: starCount }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 20 + 10,
      }))
    );
  }, []);

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const h = d.getHours();
    const m = d.getMinutes();
    const hh = h % 12 || 12;
    const mm = m < 10 ? `0${m}` : m;
    return `${hh}:${mm} ${h >= 12 ? "PM" : "AM"}`;
  };

  const getBubbleColor = (role?: string, isMe?: boolean) => {
    if (isMe) return "#0af";
    if (role === "teacher") return "#4caf50";
    if (role === "parent") return "#fbc02d";
    if (role === "student") return "#e91e63";
    return "#888";
  };

  return (
    <div style={{ height: "100vh", background: "black", color: "white", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Starfield */}
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.left}vw`,
            top: `${s.top}vh`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "white",
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s infinite alternate`,
            pointerEvents: "none",
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Back Arrow */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <BackArrow onBack={onBack} />
      </div>

      {/* Title */}
      <div style={{ paddingTop: 70, textAlign: "center" }}>
        <h2>Accountability Chat</h2>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.length === 0 && <p style={{ opacity: 0.5, textAlign: "center" }}>No messages yet.</p>}
        {messages.map((msg) => {
          const sender = getSender(msg.sender_id);
          const isMe = msg.sender_id === currentUserId;

          return (
            <div key={msg.id} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "75%" }}>
              {sender && (
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {sender.name} ({sender.role})
                </div>
              )}
              <div
                style={{
                  background: getBubbleColor(sender?.role, isMe),
                  color: "black",
                  padding: "12px 16px",
                  borderRadius: 16,
                }}
              >
                {msg.text}
              </div>
              <div style={{ fontSize: 10, opacity: 0.5, textAlign: "right" }}>
                {formatTime(msg.created_at)}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: 15, borderTop: "1px solid #222", display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 14,
            background: "#111",
            color: "white",
            border: "1px solid #0af",
            borderRadius: 20,
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "14px 20px",
            background: "#0af",
            borderRadius: 20,
            fontWeight: 600,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}











