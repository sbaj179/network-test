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
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // ================= LOGIN =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !platformId || !password || !role) {
      triggerShake();
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.trim())
      .eq("platform_id", platformId.trim())
      .eq("password", password)
      .eq("role", role)
      .single();

    if (error || !data) {
      triggerShake();
      setLoading(false);
      return;
    }

    const user = data as User;

    localStorage.setItem("currentUserId", user.id);
    localStorage.setItem("currentUserRole", user.role);
    localStorage.setItem("currentUserPlatformId", user.platform_id);
    localStorage.setItem("currentUserName", user.name);
    localStorage.setItem("currentUserEmail", user.email);

    router.push("/dashboard");
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  // ================= STARFIELD (CSS ONLY) =================
  const starCount = 90;
  const stars = Array.from({ length: starCount });

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "radial-gradient(circle at top, #1a1a5d 0%, #0a0a2a 45%, #000 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Starfield */}
      {stars.map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            borderRadius: "50%",
            background: "white",
            opacity: Math.random() * 0.5 + 0.3,
            animation: `twinkle ${Math.random() * 20 + 10}s infinite alternate`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className={shake ? "shake" : ""}
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#000",
          padding: "42px",
          borderRadius: "18px",
          border: "1px solid rgba(0,170,255,0.35)",
          boxShadow:
            "0 0 40px rgba(0,170,255,0.6), inset 0 0 60px rgba(0,170,255,0.35)",
          animation: "breathing 2.8s ease-in-out infinite",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            color: "#0af",
            textAlign: "center",
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "1px",
            marginBottom: "6px",
          }}
        >
          School-Connect
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Platform ID"
          value={platformId}
          onChange={(e) => setPlatformId(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="" disabled hidden>
            Select Role
          </option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "14px",
            background: "#0af",
            color: "#000",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Authenticating…" : "Login"}
        </button>
      </form>

      {/* Animations */}
      <style>{`
        @keyframes twinkle {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }

        @keyframes breathing {
          0%, 100% {
            box-shadow:
              0 0 40px rgba(0,170,255,0.6),
              inset 0 0 60px rgba(0,170,255,0.35);
          }
          50% {
            box-shadow:
              0 0 65px rgba(0,170,255,0.9),
              inset 0 0 85px rgba(0,170,255,0.55);
          }
        }

        .shake {
          animation: shake 0.45s;
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #0af",
  backgroundColor: "#0b0b0b",
  color: "white",
  fontSize: "15px",
  outline: "none",
};



