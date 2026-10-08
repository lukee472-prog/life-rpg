
"use client";

import { useEffect, useState } from "react";

const activities = [
  { name: "Relaxing", x: 49, y: 72, icon: "🧍" },
  { name: "Using computer", x: 26, y: 49, icon: "🧑‍💻" },
  { name: "Reading", x: 73, y: 48, icon: "📖" },
  { name: "Cleaning", x: 56, y: 65, icon: "🧹" },
  { name: "Petting dog", x: 42, y: 76, icon: "🧎" },
];

export default function LivingWorld() {
  const [activity, setActivity] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivity((current) => {
        let next = Math.floor(Math.random() * activities.length);
        return next === current
          ? (next + 1) % activities.length
          : next;
      });
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const current = activities[activity];

  const furniture = [
    { icon: "🖥️", x: 23, y: 34, label: "Computer" },
    { icon: "🛏️", x: 72, y: 34, label: "Bed" },
    { icon: "🪴", x: 13, y: 63, label: "Plant" },
    { icon: "🛋️", x: 77, y: 74, label: "Sofa" },
    { icon: "📚", x: 48, y: 26, label: "Books" },
  ];

  return (
    <section
      aria-label="Your living room"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at center, #534037, #171d2d)",
        color: "white",
      }}
    >
      {/* Isometric floor */}
      <div
        style={{
          position: "absolute",
          width: "69%",
          height: "69%",
          top: "16%",
          left: "16%",
          transform: "rotate(45deg)",
          background:
            "repeating-linear-gradient(0deg, #ad7852 0px, #ad7852 23px, #986443 24px, #986443 26px)",
          border: "10px solid #47352e",
          boxShadow: "0 25px 45px #0008",
        }}
      />

      {/* Furniture */}
      {furniture.map((item) => (
        <div
          key={item.label}
          title={item.label}
          style={{
            position: "absolute",
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: "translate(-50%, -50%)",
            fontSize: "clamp(24px, 8vw, 42px)",
            filter: "drop-shadow(2px 8px 3px #0008)",
          }}
        >
          {item.icon}
        </div>
      ))}

      {/* Dog */}
      <div
        style={{
          position: "absolute",
          left: "39%",
          top: "79%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(27px, 9vw, 46px)",
        }}
      >
        🐕
      </div>

      {/* Moving character */}
      <div
        style={{
          position: "absolute",
          left: `${current.x}%`,
          top: `${current.y}%`,
          transform: "translate(-50%, -50%)",
          transition: "left 1.8s ease-in-out, top 1.8s ease-in-out",
          fontSize: "clamp(29px, 10vw, 50px)",
          filter: "drop-shadow(0 7px 4px #0008)",
        }}
      >
        {current.icon}
      </div>

      {/* Activity indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          padding: "8px 12px",
          borderRadius: 12,
          background: "#101827d9",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        ✨ {current.name}
      </div>
    </section>
  );
}

