"use client";
import React, { useState } from "react";
import BackArrow from "../back-arrow/BackArrow";

interface EventsProps {
  onBack: () => void;
}

export default function Events({ onBack }: EventsProps) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timetable: Record<string, { time: string; label: string }[]> = {
    Monday: [
      { time: "07:40 – 08:25", label: "Maths" },
      { time: "08:25 – 09:10", label: "Accounting" },
      { time: "09:10 – 09:55", label: "Life Sciences" },
      { time: "10:10 – 10:20", label: "Break" },
      { time: "10:20 – 11:05", label: "Physical Sciences" },
      { time: "11:05 – 11:50", label: "IsiXhosa" },
      { time: "12:00 – 12:45", label: "Lunch Break" },
      { time: "12:45 – 13:30", label: "English" },
      { time: "13:30 – 14:15", label: "Study / Class" },
      { time: "15:30", label: "Rugby Practice" },
    ],
    Tuesday: [
      { time: "07:40 – 08:25", label: "Maths" },
      { time: "08:25 – 09:10", label: "Accounting" },
      { time: "09:10 – 09:55", label: "Life Sciences" },
      { time: "10:10 – 10:20", label: "Break" },
      { time: "10:20 – 11:05", label: "Physical Sciences" },
      { time: "11:05 – 11:50", label: "IsiXhosa" },
      { time: "12:00 – 12:45", label: "Lunch Break" },
      { time: "12:45 – 13:30", label: "English" },
      { time: "13:30 – 14:15", label: "Study / Class" },
      { time: "15:30", label: "Rugby Practice" },
    ],
    Wednesday: [
      { time: "07:40 – 08:25", label: "Maths" },
      { time: "08:25 – 09:10", label: "Accounting" },
      { time: "09:10 – 09:55", label: "Life Sciences" },
      { time: "10:10 – 10:20", label: "Break" },
      { time: "10:20 – 11:05", label: "Physical Sciences" },
      { time: "11:05 – 11:50", label: "IsiXhosa" },
      { time: "12:00 – 12:45", label: "Lunch Break" },
      { time: "12:45 – 13:30", label: "English" },
      { time: "13:30 – 14:15", label: "Study / Class" },
      { time: "15:30", label: "Rugby Practice" },
    ],
    Thursday: [
      { time: "07:40 – 08:25", label: "Maths" },
      { time: "08:25 – 09:10", label: "Accounting" },
      { time: "09:10 – 09:55", label: "Life Sciences" },
      { time: "10:10 – 10:20", label: "Break" },
      { time: "10:20 – 11:05", label: "Physical Sciences" },
      { time: "11:05 – 11:50", label: "IsiXhosa" },
      { time: "12:00 – 12:45", label: "Lunch Break" },
      { time: "12:45 – 13:30", label: "English" },
      { time: "13:30 – 14:15", label: "Study / Class" },
      { time: "15:30", label: "Rugby Practice" },
    ],
    Friday: [
      { time: "07:40 – 08:25", label: "Maths" },
      { time: "08:25 – 09:10", label: "Accounting" },
      { time: "09:10 – 09:55", label: "Life Sciences" },
      { time: "10:10 – 10:20", label: "Break" },
      { time: "10:20 – 11:05", label: "Physical Sciences" },
      { time: "11:05 – 11:50", label: "IsiXhosa" },
      { time: "12:00 – 12:45", label: "Lunch Break" },
      { time: "12:45 – 13:30", label: "English" },
      { time: "13:30 – 14:15", label: "School Ends" },
    ],
    Saturday: [{ time: "11:00", label: "Rugby Match" }],
    Sunday: [],
  };

  const [selectedDay, setSelectedDay] = useState<string>("Monday");

  return (
    <div
      style={{
        color: "white",
        padding: "20px",
        position: "relative",
        height: "100%",
      }}
    >
      <BackArrow onBack={onBack} />

      <h2 style={{ marginTop: "50px" }}>Weekly Events</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {days.map((day) => (
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

      <div>
        {timetable[selectedDay].length === 0 ? (
          <p style={{ opacity: 0.6 }}>No events today.</p>
        ) : (
          timetable[selectedDay].map((event, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <strong>{event.time}</strong> — {event.label}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


