"use client";
import React, { useEffect, useState } from "react";
import BackArrow from "../back-arrow/BackArrow";

interface ReportsProps {
  onBack: () => void;
}

export default function Reports({ onBack }: ReportsProps) {
  const subjects = ["Life Sciences", "Maths", "Accounting", "Physical Sciences", "IsiXhosa", "English"];
  const terms = ["Term 1", "Term 2", "Term 3", "Term 4"];

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
    <div style={{ color: "white", padding: "20px", position: "relative", height: "100%" }}>
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

      <BackArrow onBack={onBack} />

      <h2 style={{ marginTop: "50px" }}>Reports</h2>

      {subjects.map(subj => (
        <div key={subj} style={{ marginBottom: "10px" }}>
          <strong>{subj}</strong>
          <div style={{ display: "flex", gap: "20px" }}>
            {terms.map(term => (
              <div key={term} style={{ minWidth: "80px" }}>
                {term}: 85% (Level 7)
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <strong>Teacher Comments:</strong>
        <textarea
          style={{
            width: "100%",
            height: "100px",
            backgroundColor: "#111",
            color: "white",
            border: "1px solid #0af",
          }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Principal Signature: _____________________</strong>
      </div>
    </div>
  );
}

