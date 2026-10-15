"use client";
import { useState } from "react";
import LivingWorld from "./LivingWorld";
import "./world-canvas.css";

// Waking Life is the full-screen environment, not a card or framed image.
// Add the approved illustration as public/world/starter-bedroom.webp to activate it.
export default function WorldCanvas() {
  const [artAvailable, setArtAvailable] = useState(true);
  return (
    <div className="waking-world" aria-label="Your living Waking Life world">
      <div className="waking-world-land" />
      <div className="waking-world-ground" />
      <div className="waking-world-room">
        {artAvailable ? (
          <img className="waking-world-art" src="/world/starter-bedroom.webp" alt="" onError={() => setArtAvailable(false)} draggable="false" />
        ) : (
          <div className="waking-world-fallback"><LivingWorld /></div>
        )}
      </div>
      {artAvailable && (
        <div className="waking-world-life" aria-hidden="true">
          <div className="waking-world-person"><span className="waking-world-person-head" /><span className="waking-world-person-body" /></div>
          <div className="waking-world-pet"><span className="waking-world-pet-ear" /></div>
        </div>
      )}
    </div>
  );
}
