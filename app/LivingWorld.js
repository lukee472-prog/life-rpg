
export default function LivingWorld() {
  return (
    <section
      style={{
        position: "relative",
        height: 290,
        borderRadius: 24,
        overflow: "hidden",
        border: "2px solid #385174",
        background:
          "linear-gradient(#78b9dc 0%, #c8e9ee 68%, #ad8062 68%)",
      }}
    >
      {/* Room window */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 25,
          width: 95,
          height: 100,
          background: "#8bd5fa",
          border: "8px solid #f3d7a3",
          borderRadius: 12,
          boxShadow: "0 5px 15px #35546a55",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            height: "100%",
            borderLeft: "5px solid #f3d7a3",
          }}
        />
      </div>

      {/* Room furniture */}
      <div
        style={{
          position: "absolute",
          right: 15,
          bottom: 45,
          fontSize: 65,
        }}
      >
        🛏️
      </div>

      <div
        style={{
          position: "absolute",
          left: 12,
          bottom: 38,
          fontSize: 45,
        }}
      >
        🪴
      </div>

      {/* Character and dog layers */}
      <div
        style={{
          position: "absolute",
          bottom: 34,
          left: "36%",
          fontSize: 78,
        }}
      >
        🧍
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "60%",
          fontSize: 58,
        }}
      >
        🐕
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "8px 12px",
          background: "#10233ccc",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        🏠 YOUR LIVING WORLD
      </div>
    </section>
  );
}
