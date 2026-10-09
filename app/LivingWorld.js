"use client";

import { useEffect, useState } from "react";

const spots = [{ x: 47, y: 66, label: "Relaxing" }, { x: 30, y: 60, label: "At the desk" }, { x: 62, y: 64, label: "Exploring" }];

export default function LivingWorld() {
  const [spot, setSpot] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSpot(current => (current + 1) % spots.length), 7500);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="life-room" aria-label="Illustrated bedroom with your character and dog">
      <div className="life-room-wall" />
      <div className="life-room-wall-trim" />
      <div className="life-room-window"><div className="life-room-sky"><span>✦</span><span>✧</span><span>✦</span></div><div className="life-room-window-cross" /></div>
      <div className="life-room-poster"><span>LEVEL UP</span><strong>★</strong></div>
      <div className="life-room-shelf"><span>📚</span><span>🪴</span><span>🏆</span></div>
      <div className="life-room-floor" />
      <div className="life-room-rug" />
      <div className="life-room-desk"><div className="life-room-monitor">✦</div><div className="life-room-desk-top" /><div className="life-room-desk-leg left" /><div className="life-room-desk-leg right" /><div className="life-room-chair" /></div>
      <div className="life-room-bed"><div className="life-room-pillow" /><div className="life-room-blanket" /></div>
      <div className="life-room-lamp"><div className="life-room-lamp-shade" /><div className="life-room-lamp-pole" /></div>
      <div className="life-room-plant">🌿</div>
      <div className="life-room-avatar" style={{ left: spots[spot].x + "%", top: spots[spot].y + "%" }}><span className="life-room-avatar-body">🧍🏻‍♂️</span><span className="life-room-shadow" /></div>
      <div className="life-room-dog"><span>🐕</span><span className="life-room-shadow" /></div>
      <div className="life-room-glow" />
    </div>
  );
}
