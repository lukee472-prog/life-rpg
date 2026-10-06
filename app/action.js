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


export async function sendGameMasterMessage(previousState, formData) {
  const message = formData.get("message")?.toString().trim();

  if (!message) {
    return { message: "" };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-6-luna",
        instructions:
  `You are the Game Master interpreter for Life RPG.

Your job is to understand what the player wants to do in real life.

If the player wants to add or plan a task, return ONLY valid JSON in exactly this format:
{"action":"create_quest","title":"Quest title","category":"fitness","difficulty":"medium"}

Allowed categories: fitness, cleaning, development, general.
Allowed difficulties: tiny, small, medium, hard, epic.

Choose a short, clear quest title.
Do not claim XP, coins, quests, or completions have happened. The Life RPG game engine handles those.

If the message is not asking to create a quest, return:
{"action":"none","reply":"Your short Game Master response here"}`,
        input: message,
      }),
    });

    if (!response.ok) {
      console.error("OPENAI ERROR:", await response.text());
      return {
        message: "The Game Master couldn't respond. Try again.",
      };
    }

   const data = await response.json();

const reply = data.output
  ?.filter((item) => item.type === "message")
  .flatMap((item) => item.content ?? [])
  .filter((item) => item.type === "output_text")
  .map((item) => item.text)
  .join("\n")
  .trim();

if (!reply) {
  return { message: "The Game Master has nothing to say." };
}

let command;

try {
  command = JSON.parse(reply);
} catch {
  return { message: "The Game Master couldn't understand that command." };
}

if (command.action === "create_quest") {
  const rewards = {
    tiny: { xp: 50, coins: 15 },
    small: { xp: 100, coins: 25 },
    medium: { xp: 200, coins: 50 },
    hard: { xp: 400, coins: 100 },
    epic: { xp: 1000, coins: 250 },
  };

  const reward = rewards[command.difficulty] ?? rewards.small;

  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase.rpc("create_quest", {
  p_title: command.title,
  p_category: command.category,
  p_xp_reward: reward.xp,
  p_coin_reward: reward.coins,
  p_quest_date: today,
});

  if (error) {
    console.error("CREATE QUEST ERROR:", error);

    return {
      message: "I understood the quest, but couldn't add it.",
    };
  }

  revalidatePath("/");

  return {
    message: `Quest added: ${command.title} — +${reward.xp} XP · +${reward.coins} coins`,
  };
}

return {
  message: command.reply || "Tell me what you'd like to do.",
};
  } catch (error) {
    console.error("GAME MASTER ERROR:", error);

    return {
      message: "The Game Master couldn't respond. Try again.",
    };
  }
}
