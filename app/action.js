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
const today = new Date().toISOString().slice(0, 10);

const { data: todaysActiveQuests, error: activeQuestError } =
  await supabase
    .from("quests")
    .select("id, title")
    .eq("status", "active")
    .eq("quest_date", today);

if (activeQuestError) {
  console.error("ACTIVE QUEST ERROR:", activeQuestError);
}

const questList = (todaysActiveQuests ?? [])
  .map((quest) => `${quest.id}: ${quest.title}`)
  .join("\n");
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

Your job is to understand what the player wants to do in their real life and return ONLY valid JSON.

TODAY'S ACTIVE QUESTS:
${questList || "No active quests."}

If the player wants to add or plan a new task, return:
{"action":"create_quest","title":"Quest title","category":"fitness","difficulty":"medium"}

If the player says they completed, finished, did, sorted, cleaned, achieved, or otherwise clearly completed one of today's active quests, match their meaning to the most appropriate quest from TODAY'S ACTIVE QUESTS and return:
{"action":"complete_quest","quest_id":123}

The quest_id MUST be an ID from TODAY'S ACTIVE QUESTS.
Never invent a quest ID.
Use meaning, not exact wording. For example, "bedroom sorted" can match "Tidy Room", and "bike ride done" can match a cycling quest.

If you are not confident which quest they mean, do not guess. Return:
{"action":"none","reply":"Which quest did you complete?"}

Allowed categories: fitness, cleaning, development, general.
Allowed difficulties: tiny, small, medium, hard, epic.

For new quests, choose a short clear title and appropriate category and difficulty.
Do not claim XP, coins, quests, or completions have changed. The backend handles all game state.

If the message is neither creating nor completing a quest, return:
{"action":"none","reply":"Your short Game Master response here."}`,
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
if (command.action === "complete_quest") {
  const quest = todaysActiveQuests?.find(
    (item) => item.id === Number(command.quest_id)
  );

  if (!quest) {
    return {
      message: "I couldn't confidently match that to one of today's active quests.",
    };
  }

  const { error: completeError } = await supabase.rpc(
    "complete_quest",
    {
      p_quest_id: quest.id,
    }
  );

  if (completeError) {
    console.error("COMPLETE QUEST ERROR:", completeError);

    return {
      message: "I found the quest, but couldn't complete it.",
    };
  }

  revalidatePath("/");

  return {
    message: `Quest complete: ${quest.title}`,
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
