"use client";

import React, { useEffect, useState } from "react";
import Messages from "../components/messages";
import Events from "../components/events/events";
import Reports from "../components/reports/reports";
import styles from "./dashboard.module.css";

type Section = "home" | "messages" | "events" | "reports";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>("home");

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [stars, setStars] = useState<
    { x: number; y: number; size: number; opacity: number }[]
  >([]);

  // ---------- AUTH GATE ----------
  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setAuthorized(true);
    setCheckingAuth(false);
  }, []);

  // ---------- STARFIELD ----------
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
          opacity: Math.min(
            Math.max(star.opacity + (Math.random() - 0.5) * 0.05, 0.3),
            1
          ),
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // ---------- LOADING STATE ----------
  if (checkingAuth) {
    return (
      <div
        style={{
          height: "100vh",
          background: "black",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  // ---------- SECTION RENDER ----------
  const renderSection = () => {
    switch (activeSection) {
      case "messages":
        return <Messages onBack={() => setActiveSection("home")} />;
      case "events":
        return <Events onBack={() => setActiveSection("home")} />;
      case "reports":
        return <Reports onBack={() => setActiveSection("home")} />;
      default:
        return null;
    }
  };

  // ---------- UI ----------
  return (
    <div className={styles.dashboard}>
      {/* Starfield */}
      {stars.map((star, i) => (
        <div
          key={i}
          className={styles.star}
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Title */}
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>School Connect</h1>
        <div className={styles.divider}></div>
      </div>

      {/* Navigation */}
      {activeSection === "home" && (
        <div className={styles.navWrapper}>
          <button
            onClick={() => setActiveSection("messages")}
            className={styles.toggle}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveSection("events")}
            className={styles.toggle}
          >
            Events
          </button>
          <button
            onClick={() => setActiveSection("reports")}
            className={styles.toggle}
          >
            Reports
          </button>
        </div>
      )}

      {/* Section Content */}
      <div className={styles.sectionContent}>
        {activeSection !== "home" && renderSection()}
      </div>
    </div>
  );
}






