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

return {
  message: reply || "The Game Master has nothing to say.",
};
  } catch (error) {
    console.error("GAME MASTER ERROR:", error);

    return {
      message: "The Game Master couldn't respond. Try again.",
    };
  }
}
