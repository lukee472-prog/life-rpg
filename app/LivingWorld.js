"use client";
import { useEffect, useState } from "react";
import "./room.css";
import "./layered-room.css";
const initialRoom = {
  floor: "oak",
  walls: "warm",
  furniture: {
    bed: { tier: 1, x: 25, y: 45 },
    sofa: { tier: 1, x: 34, y: 71 },
    tv: { tier: 1, x: 60, y: 64 },
    desk: { tier: 1, x: 75, y: 42 },
    gym: { tier: 1, x: 78, y: 73 },
  },
};
const spots = [{ x: 48, y: 52 }, { x: 54, y: 54 }, { x: 44, y: 53 }];
export default function LivingWorld() {
  const [spot, setSpot] = useState(0);
  const [room] = useState(initialRoom);
  useEffect(() => {
    const timer = setInterval(() => setSpot(current => (current + 1) % spots.length), 8500);
    return () => clearInterval(timer);
  }, []);
  return <div className="life-room life-room-isometric" aria-label="Isometric bedroom game world">
    <div className="layered-room">
      <div className="layered-floor" data-material={room.floor} />
      <div className="layered-walls" data-finish={room.walls}><div className="wall-left"/><div className="wall-right"/><div className="room-window"/></div>
      {Object.entries(room.furniture).map(([kind, item]) => (
        <div key={kind} className={`furniture furniture-${kind}`} data-tier={item.tier} style={{left: item.x + "%", top: item.y + "%"}}>
          <span className="furniture-object" />
        </div>
      ))}
    </div>
    <div className="life-room-avatar" style={{left: spots[spot].x + "%", top: spots[spot].y + "%"}}><span className="life-room-avatar-body"><span className="sprite-head" /><span className="sprite-hair" /><span className="sprite-face" /><span className="sprite-body" /><span className="sprite-arm left" /><span className="sprite-arm right" /><span className="sprite-leg left" /><span className="sprite-leg right" /></span><span className="life-room-shadow" /></div>
    <div className="life-room-dog"><span className="life-room-dog-sprite"><span className="dog-body" /><span className="dog-head" /><span className="dog-ear" /><span className="dog-snout" /><span className="dog-tail" /><span className="dog-leg one" /><span className="dog-leg two" /></span><span className="life-room-shadow" /></div>
  </div>;
}