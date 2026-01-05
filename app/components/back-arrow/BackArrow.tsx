"use client";
import React from "react";

interface BackArrowProps {
  onBack: () => void;
}

export default function BackArrow({ onBack }: BackArrowProps) {
  return (
    <button
      onClick={onBack}
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "24px",
        cursor: "pointer",
      }}
    >
      ←
    </button>
  );
}

