"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  opacity: number;
  speed: number;
}

export default function Home() {
  const router = useRouter();
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars: Star[] = [];
    for (let i = 0; i < 300; i++) {
      generatedStars.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
      });
    }
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prevStars) =>
        prevStars.map((star) => ({
          ...star,
          top: (star.top + star.speed / 50) % 100,
        }))
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {/* Render Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={styles.star}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Title */}
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>School Connect</h1>
        <hr className={styles.divider} />
      </div>

      {/* Navigation Wrapper */}
      <div className={styles.navWrapper}>
        <button
          className={styles.toggle}
          onClick={() => router.push("/components/messages")}
        >
          Messages
        </button>
        <button
          className={styles.toggle}
          onClick={() => router.push("/components/events")}
        >
          Events
        </button>
        <button
          className={styles.toggle}
          onClick={() => router.push("/components/reports")}
        >
          Reports
        </button>
      </div>
    </div>
  );
}



