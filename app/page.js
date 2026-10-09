import Link from "next/link";
import { supabase } from "../lib/supabase";
import { completeQuest } from "./action";
import GameMasterForm from "./GameMasterForm";
import WakingScreen from "./WakingScreen";

export const dynamic = "force-dynamic";

const icons = {
  fitness: "⚡",
  cleaning: "🧹",
  development: "💻",
  general: "📜",
};

const colours = {
  fitness: "#24c879",
  cleaning: "#35a9ff",
  development: "#f15b9c",
  general: "#ffc247",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#081426",
    color: "#fff",
    padding: "22px 16px 110px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#142844",
    border: "1px solid #304767",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  button: {
    background: "#ffc247",
    color: "#142033",
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

function dateString(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(iso, amount) {
  const date = new Date(iso + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + amount);
  return dateString(date);
}

function formatDate(iso, options) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    ...options,
  }).format(new Date(iso + "T12:00:00Z"));
}

export default async function Home({ searchParams }) {
  const params = await searchParams;

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const requestedDate = params?.date;

  const selectedDate =
    typeof requestedDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) &&
    !Number.isNaN(
      new Date(requestedDate + "T12:00:00Z").getTime()
    )
      ? requestedDate
      : today;

  const selectedDay = new Date(
    selectedDate + "T12:00:00Z"
  );

  const mondayOffset =
    (selectedDay.getUTCDay() + 6) % 7;

  const monday = addDays(
    selectedDate,
    -mondayOffset
  );

  const week = Array.from(
    { length: 7 },
    (_, index) => addDays(monday, index)
  );

  const previousWeek = addDays(selectedDate, -7);
  const nextWeek = addDays(selectedDate, 7);

  const { data: player } = await supabase
    .from("player_state")
    .select("level, xp, coins")
    .limit(1)
    .single();

  const { data: quests, error } = await supabase
    .from("quests")
    .select("*")
    .order("created_at", { ascending: true });

  const allQuests = quests ?? [];

  const level = player?.level ?? 1;
  const xp = player?.xp ?? 0;
  const coins = player?.coins ?? 0;

  const xpNeeded = 1000 + (level - 1) * 250;
  const progress = Math.min(
    100,
    (xp / xpNeeded) * 100
  );

  const selectedQuests = allQuests.filter(
    (quest) => quest.quest_date === selectedDate &&
      quest.status !== "cancelled"
  );

  const completed = selectedQuests.filter(
    (quest) => quest.status === "completed"
  );

  const orderedQuests = [
    ...selectedQuests.filter(
      (quest) => quest.status === "active"
    ),
    ...completed,
  ];

  const questDates = new Set(
    allQuests
      .filter((quest) => quest.status === "active")
      .map((quest) => quest.quest_date)
  );

  return (
    <WakingScreen
      today={today}
      selectedDate={selectedDate}
      week={week}
      previousWeek={previousWeek}
      nextWeek={nextWeek}
      level={level}
      xp={xp}
      coins={coins}
      xpNeeded={xpNeeded}
      progress={progress}
      quests={orderedQuests}
      questDates={[...questDates]}
      hasError={Boolean(error)}
    />
  );
}
