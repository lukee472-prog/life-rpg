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
      <form className="gmInput" action={formAction}>
        <input
          name="message"
          type="text"
          placeholder="Tell the Game Master what happened..."
          autoComplete="off"
        />

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
