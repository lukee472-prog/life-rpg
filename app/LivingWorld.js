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
    <div className="life-room-avatar" style={{left: spots[spot].x + "%", top: spots[spot].y + "%"}}><span className="life-room-avatar-body"><span className="sprite-head" /><span className="sprite-hair" /><span className="sprite-face" /><span className="sprite-body" /><span className="sprite-arm left" /><span className="sprite-arm right" /><span className="sprite-leg left" /><span className="sprite-leg right" /></span><span className="life-room-shadow" /></div>
    <div className="life-room-dog"><span className="life-room-dog-sprite"><span className="dog-body" /><span className="dog-head" /><span className="dog-ear" /><span className="dog-snout" /><span className="dog-tail" /><span className="dog-leg one" /><span className="dog-leg two" /></span><span className="life-room-shadow" /></div>
  </div>;
}