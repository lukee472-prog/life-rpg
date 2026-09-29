"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "../lib/supabase";

export async function completeQuest(questId) {
  const { data: quest, error: questError } = await supabase
    .from("quests")
    .select("id, xp_reward, coin_reward, status")
    .eq("id", questId)
    .single();

  if (questError || !quest || quest.status !== "active") {
    return;
  }

  const { data: player, error: playerError } = await supabase
    .from("player_state")
    .select("id, level, xp, coins")
    .limit(1)
    .single();

  if (playerError || !player) {
    return;
  }

  await supabase
    .from("player_state")
    .update({
      xp: player.xp + quest.xp_reward,
      coins: player.coins + quest.coin_reward,
    })
    .eq("id", player.id);

  await supabase
    .from("quests")
    .update({ status: "completed" })
    .eq("id", quest.id);

  revalidatePath("/");
}
