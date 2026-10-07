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
const ukDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const today = ukDate;
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);

const tomorrow = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(tomorrowDate);
const { data: activeQuests, error: activeQuestError } =
  await supabase
    .from("quests")
    .select("id, title, quest_date")
    .eq("status", "active")
    .order("quest_date", { ascending: true });

if (activeQuestError) {
  console.error("ACTIVE QUEST ERROR:", activeQuestError);
}

const questList = (activeQuests ?? [])
  .map((quest) => `${quest.id}: ${quest.title} - ${quest.quest_date}`)
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

ACTIVE QUESTS (including overdue and future quests):
${questList || "No active quests."}

Quest dates are shown beside each quest.
For rescheduling, you may use ANY quest in this list, including overdue quests.
For completing quests, only use quests dated today.
The player may describe ONE OR MULTIPLE things in the same message.

Always return this structure:
{"actions":[],"reply":""}

If the player wants to add or plan a new task, include the calendar date it should happen:
{"action":"create_quest","title":"Quest title","category":"fitness","difficulty":"medium","quest_date":"YYYY-MM-DD"}

Today's date in the player's timezone is ${today}.

Interpret dates from normal language.

Examples:
"Add a run tomorrow" = the next calendar day.
"I have a run Wednesday" = the next appropriate Wednesday.
"Dentist next Friday" = the Friday of next week.
"Clean the car on the 15th" = the next appropriate 15th.
"Add meditation today" = today's date.

If the player gives no day or date, use today's date.

Always return quest_date in YYYY-MM-DD format.
Never return a date earlier than today unless the player is clearly describing something that already happened.
If the player wants to move, postpone, reschedule, push, or change the date of an existing quest, return:
{"action":"reschedule_quest","quest_id":123,"quest_date":"YYYY-MM-DD"}

The quest_id MUST be the ID of the existing quest the player means.
Interpret the new date from normal language using today's date above.
Only reschedule when you are confident which quest the player means.
If the player clearly completed one of today's active quests, add:
{"action":"complete_quest","quest_id":123}

If they clearly completed multiple quests, include each completion as a separate item in the actions array.

Example:
{"actions":[{"action":"complete_quest","quest_id":123},{"action":"complete_quest","quest_id":456}],"reply":""}

For rescheduling, the quest_id may be any existing active quest ID from the ACTIVE QUESTS list, including overdue or future quests. For completing quests, only use quests dated today.
Never invent a quest ID.
Use meaning, not exact wording.

For example:
"bedroom sorted" can match "Tidy Room".
"bike ride done" can match a cycling quest.

Only complete a quest when the player clearly says they actually did it.
If they say they did NOT complete something, do not complete it.

If you are not confident which quest they mean, do not guess. Leave it out of actions and explain briefly in reply.

Allowed categories: fitness, cleaning, development, general.
Allowed difficulties: tiny, small, medium, hard, epic.

For new quests, choose a short clear title and appropriate category and difficulty.

Do not claim XP, coins, quests, or completions have changed.
The backend handles all game state.

If the player asks what quests, tasks, jobs, or things they still have left to do today, answer using ONLY TODAY'S ACTIVE QUESTS above.

Do not invent quests or mention completed quests.

If there are active quests, return:
{"actions":[],"reply":"You still have: Quest 1, Quest 2."}

If there are no active quests, return:
{"actions":[],"reply":"You've completed everything for today."}

For any other message where there is no action to perform, return:
{"actions":[],"reply":"Your short Game Master response here."}`,
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

const actions = Array.isArray(command.actions)
  ? command.actions
  : command.action
    ? [command]
    : [];

const results = [];

const rewards = {
  tiny: { xp: 50, coins: 15 },
  small: { xp: 100, coins: 25 },
  medium: { xp: 200, coins: 50 },
  hard: { xp: 400, coins: 100 },
  epic: { xp: 1000, coins: 250 },
};

for (const action of actions) {
  if (action.action === "create_quest") {
    const reward = rewards[action.difficulty] ?? rewards.small;

    const { error } = await supabase.rpc("create_quest", {
      p_title: action.title,
      p_category: action.category,
      p_xp_reward: reward.xp,
      p_coin_reward: reward.coins,
      p_quest_date:
  /^\d{4}-\d{2}-\d{2}$/.test(action.quest_date)
    ? action.quest_date
    : today,
    });

    if (error) {
      console.error("CREATE QUEST ERROR:", error);
      results.push(`Couldn't add: ${action.title}`);
      continue;
    }

    results.push(`Quest added: ${action.title}`);
  }

  if (action.action === "complete_quest") {
    const quest = activeQuests?.find(
      (item) => item.id === Number(action.quest_id)
    );

    if (!quest) {
      results.push("I couldn't confidently match one of those quests.");
      continue;
    }

    const { error: completeError } = await supabase.rpc(
      "complete_quest",
      {
        p_quest_id: quest.id,
      }
    );

    if (completeError) {
      console.error("COMPLETE QUEST ERROR:", completeError);
      results.push(`Couldn't complete: ${quest.title}`);
      continue;
    }

    results.push(`Quest complete: ${quest.title}`);
  }
  if (action.action === "reschedule_quest") {
  const quest = activeQuests?.find(
    (item) => item.id === Number(action.quest_id)
  );

  if (!quest) {
    results.push("I couldn't confidently match that quest.");
    continue;
  }

  const { error: rescheduleError } = await supabase.rpc(
    "reschedule_quest",
    {
      p_quest_id: quest.id,
      p_quest_date: action.quest_date,
    }
  );

  if (rescheduleError) {
    console.error("RESCHEDULE QUEST ERROR:", rescheduleError);
    results.push(`Couldn't reschedule: ${quest.title}`);
    continue;
  }

  results.push(`Quest moved: ${quest.title} → ${action.quest_date}`);
}
}

if (results.length > 0) {
  revalidatePath("/");

  return {
    message: results.join(" · "),
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
