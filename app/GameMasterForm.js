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
    <>
      
<form
  action={formAction}
  style={{
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: 10,
  }}
>

        

<button
  type="submit"
  disabled={pending}
  style={{
    flexShrink: 0,
    background: "#1689ff",
    color: "#ffffff",
    border: "none",
    borderRadius: 14,
    padding: "11px 16px",
    fontSize: 18,
    fontWeight: "bold",
    cursor: "pointer",
    opacity: pending ? 0.6 : 1,
  }}
>
  {pending ? "..." : "➤"}
</button>



        <button type="submit" disabled={pending}>
          {pending ? "..." : "➤"}
        </button>
      </form>

      {state?.message && (
        <div className="gmResponse">
          🧙 Game Master: {state.message}
        </div>
      )}
    </>
  );
}
