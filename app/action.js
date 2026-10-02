"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "../lib/supabase";

export async function completeQuest(questId) {
  const { error } = await supabase.rpc("complete_quest", {
    p_quest_id: questId,
  });

  if (error) {
    console.error("COMPLETE QUEST ERROR:", error);
    return;
  }

  revalidatePath("/");
}


export async function sendGameMasterMessage(formData) {
  const message = formData.get("message")?.toString().trim();

  if (!message) {
    return;
  }

  console.log("GAME MASTER MESSAGE:", message);

  return {
    success: true,
    message: `Message received: "${message}"`,
  };
}
