"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

interface User {
  id: string;
  platform_id: string;
  name: string;
  role: string;
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [password, setPassword] = useState("");
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
      setStars((prev) =>
        prev.map((star) => ({
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
    if (!email || !platformId || !password) {
      alert("Fill all fields");
      return;
    }
    setLoading(true);

    try {
      // Check users table for all three fields
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.trim())
        .eq("platform_id", platformId.trim())
        .eq("password", password)
        .single();

      if (userError || !userData) {
        alert("Invalid email, platform ID, or password");
        setLoading(false);
        return;
      }

      const user = userData as User;

      // ================= SAVE SESSION =================
      localStorage.setItem("currentUserId", user.id);
      localStorage.setItem("currentUserRole", user.role);
      localStorage.setItem("currentUserPlatformId", user.platform_id);
      localStorage.setItem("currentUserName", user.name);
      localStorage.setItem("currentUserEmail", user.email);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#1a1a3d",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
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
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "rgba(0,0,0,0.85)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 0 30px rgba(0, 170, 255, 0.7)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ color: "white", textAlign: "center", marginBottom: "10px" }}>
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Platform ID"
          value={platformId}
          onChange={(e) => setPlatformId(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "14px",
            backgroundColor: "#0af",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #0af",
  backgroundColor: "#111",
  color: "white",
  outline: "none",
  fontSize: "14px",
};



