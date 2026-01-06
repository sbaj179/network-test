"use client";
import React, { useState, useEffect } from "react";
import BackArrow from "../back-arrow/BackArrow";

interface EventsProps {
  onBack: () => void;
}

export default function Events({ onBack }: EventsProps) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [
    { name: "Maths", time: "08:00 - 08:50" },
    { name: "Accounting", time: "08:50 - 09:40" },
    { name: "Life Sciences", time: "09:40 - 10:30" },
    { name: "Physical Sciences", time: "10:40 - 11:30" },
    { name: "IsiXhosa", time: "11:30 - 12:20" },
    { name: "English", time: "13:05 - 13:55" },
    { name: "Rugby Match", time: "13:55 - 14:15" },
  ];

  const eventNotes: Record<string, string> = {
    Monday: "Maths & Accounting homework due.",
    Tuesday: "Life Sciences lab session.",
    Wednesday: "Physical Sciences test, Rugby match.",
    Thursday: "IsiXhosa home language practice, Rugby match.",
    Friday: "English essay submission.",
  };

  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([]);

  // Starfield background
  useEffect(() => {
    const tempStars = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.5,
    }));
    setStars(tempStars);

    const interval = setInterval(() => {
      setStars(prev =>
        prev.map(star => ({
          ...star,
          x: (star.x + Math.random() * 0.2) % window.innerWidth,
          y: (star.y + Math.random() * 0.2) % window.innerHeight,
          opacity: Math.min(Math.max(star.opacity + (Math.random() - 0.5) * 0.03, 0.3), 1),
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", overflowY: "auto", color: "white" }}>
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

      {/* BackArrow */}
      <div style={{ position: "absolute", top: 15, left: 15, zIndex: 10 }}>
        <BackArrow onBack={onBack} />
      </div>

      {/* Page Content */}
      <div style={{ position: "relative", zIndex: 1, padding: "20px" }}>
        <h2 style={{ marginTop: "50px", textAlign: "center" }}>Weekly Events</h2>

        {/* Day Selector */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                backgroundColor: selectedDay === day ? "#0af" : "#111",
                color: "white",
                padding: "10px 15px",
                border: "1px solid #0af",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Periods */}
        <div style={{ marginBottom: "20px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
          {periods.map(period => (
            <div
              key={period.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
                padding: "8px 12px",
                border: "1px solid #0af",
                borderRadius: "8px",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              <span>{period.name}</span>
              <span style={{ opacity: 0.7 }}>{period.time}</span>
            </div>
          ))}
        </div>

        {/* Event Note */}
        <div style={{ textAlign: "center" }}>
          <strong>Note:</strong> {eventNotes[selectedDay]}
        </div>
      </div>
    </div>
  );
}




