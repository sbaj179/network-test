"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

interface User {
  id: string;
  platform_id: string;
  name: string;
  role: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [platformId, setPlatformId] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const [stars, setStars] = useState<
    { x: number; y: number; size: number; opacity: number }[]
  >([]);

  // ================= STARS INIT =================
  useEffect(() => {
    const tempStars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5,
    }));
    setStars(tempStars);
  }, []);

  // ================= STARS ANIMATE =================
  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prev =>
        prev.map(star => ({
          ...star,
          x: (star.x + Math.random() * 0.3) % window.innerWidth,
          y: (star.y + Math.random() * 0.3) % window.innerHeight,
          opacity: Math.min(
            Math.max(star.opacity + (Math.random() - 0.5) * 0.05, 0.3),
            1
          ),
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // ================= LOGIN =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!platformId || !role) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("platform_id", platformId.trim())
      .eq("role", role)
      .single();

    if (error || !data) {
      setLoading(false);
      alert("Invalid Platform ID or role");
      return;
    }

    const user = data as User;

    // ================= SESSION =================
    localStorage.setItem("currentUserId", user.id);
    localStorage.setItem("currentUserRole", user.role);
    localStorage.setItem("currentUserPlatformId", user.platform_id);
    localStorage.setItem("currentUserName", user.name);

    // ================= NAVIGATE =================
    router.push("/dashboard");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#3f51b5",
        position: "relative",
        overflow: "hidden",
      }}
    >
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

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0, 170, 255, 0.7)",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "300px",
        }}
      >
        <h2 style={{ color: "white", textAlign: "center" }}>Login</h2>

        <input
          type="text"
          placeholder="Platform ID"
          value={platformId}
          onChange={e => setPlatformId(e.target.value)}
          style={inputStyle}
          required
        />

        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={inputStyle}
          required
        >
          <option value="" disabled hidden>
            Role
          </option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            backgroundColor: "#0af",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #0af",
  backgroundColor: "#111",
  color: "white",
  outline: "none",
};


