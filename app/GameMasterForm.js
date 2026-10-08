
"use client";

import { useActionState } from "react";
import { sendGameMasterMessage } from "./action";

const initialState = {
  message: "",
};

export default function GameMasterForm() {
  const [state, formAction, pending] = useActionState(
    sendGameMasterMessage,
    initialState
  );

  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <form
        action={formAction}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: 10,
          margin: 0,
        }}
      >
        <input
          name="message"
          type="text"
          placeholder="Tell your Game Master..."
          autoComplete="off"
          required
          style={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            padding: "12px 4px",
            color: "#ffffff",
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 16,
          }}
        />

        <button
          type="submit"
          disabled={pending}
          style={{
            flexShrink: 0,
            background: "#1689ff",
            color: "#ffffff",
            border: "none",
            borderRadius: 12,
            padding: "10px 16px",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          {pending ? "..." : "➤"}
        </button>
      </form>

      {state?.message && (
        <div
          style={{
            marginTop: 10,
            color: "#ffffff",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          🧙 Game Master: {state.message}
        </div>
      )}
    </div>
  );
}
