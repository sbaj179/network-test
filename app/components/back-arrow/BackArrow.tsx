"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface BackArrowProps {
  onBack?: () => void;
}

export default function BackArrow({ onBack }: BackArrowProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        zIndex: 1000,
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "24px",
        cursor: "pointer",
      }}
      aria-label="Go back"
    >
      ←
    </button>
  );
}
