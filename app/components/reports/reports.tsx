"use client";
import React from "react";
import BackArrow from "../back-arrow/BackArrow";

interface ReportsProps {
  onBack: () => void;
}

export default function Reports({ onBack }: ReportsProps) {
  const subjects = ["Life Sciences", "Maths", "Accounting", "Physical Sciences", "IsiXhosa", "English"];
  const terms = ["Term 1", "Term 2", "Term 3", "Term 4"];

  return (
    <div style={{ color: "white", padding: "20px", position: "relative", height: "100%" }}>
      <BackArrow onBack={onBack} />

      <h2 style={{ marginTop: "50px" }}>Reports</h2>

      {subjects.map((subj) => (
        <div key={subj} style={{ marginBottom: "10px" }}>
          <strong>{subj}</strong>
          <div style={{ display: "flex", gap: "20px" }}>
            {terms.map((term) => (
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

