"use client";
import "./world-canvas.css";

// The bedroom is a cut-out world element, not a framed background image.
// Its silhouette is masked in CSS until the transparent source asset is published.
export default function WorldCanvas() {
  return (
    <div className="waking-world" aria-label="Waking Life bedroom world">
      <div className="waking-world-room">
        <img
          className="waking-world-art"
          src="/world/D6162B35-0720-4E71-948D-5BEAB77BEDAD.png"
          alt="Your starter bedroom"
          draggable="false"
        />
      </div>
    </div>
  );
}
