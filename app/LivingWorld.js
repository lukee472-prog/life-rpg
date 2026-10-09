"use client";
import { useEffect, useState } from "react";
import "./room.css";
const spots = [{ x: 48, y: 52 }, { x: 54, y: 54 }, { x: 44, y: 53 }];
export default function LivingWorld() {
  const [spot, setSpot] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSpot(current => (current + 1) % spots.length), 8500);
    return () => clearInterval(timer);
  }, []);
  return <div className="life-room life-room-isometric" aria-label="Isometric bedroom game world">
    <div className="life-room-art" />
    <div className="life-room-avatar" style={{left: spots[spot].x + "%", top: spots[spot].y + "%"}}><span className="life-room-avatar-body">🧍🏻‍♂️</span><span className="life-room-shadow" /></div>
    <div className="life-room-dog"><span>🐕</span><span className="life-room-shadow" /></div>
  </div>;
}