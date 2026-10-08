import Link from "next/link";
import { supabase } from "../lib/supabase";
import { completeQuest } from "./action";
import GameMasterForm from "./GameMasterForm";
import LivingWorld from "./LivingWorld";

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
    <main
  style={{
    ...styles.page,
    position: "relative",
    isolation: "isolate",
    background: "transparent",
  }}
> 
<div
  style={{
    position: "fixed",
    inset: 0,
    zIndex: -1,
    overflow: "hidden",
    pointerEvents: "none",
  }}
>
  <LivingWorld />
</div>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22,
      }}>
        <div>
          <div style={{
            color: "#ffc247",
            fontWeight: "bold",
            letterSpacing: 3,
            fontSize: 12,
          }}>
            LIFE RPG
          </div>

          <h1 style={{
            fontSize: 36,
            margin: "5px 0",
          }}>
            Quests
          </h1>
        </div>

        <div style={{
          color: "#ffc247",
          fontWeight: "bold",
          fontSize: 18,
        }}>
          👑 LVL {level}
        </div>
      </header>

      <section style={styles.card}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          fontWeight: "bold",
        }}>
          <span>⭐ {xp} / {xpNeeded} XP</span>
          <span>🪙 {coins}</span>
        </div>

        <div style={{
          background: "#081426",
          height: 10,
          borderRadius: 20,
          marginTop: 15,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "#ffc247",
            borderRadius: 20,
          }} />
        </div>
      </section>

      <section style={styles.card}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 20,
          }}>
            {formatDate(selectedDate, {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <Link href="/" style={styles.button}>
            Today
          </Link>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <Link
            href={`/?date=${previousWeek}`}
            style={{
              color: "#ffc247",
              fontSize: 25,
              textDecoration: "none",
            }}
          >
            ‹
          </Link>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            flex: 1,
            gap: 3,
          }}>
            {week.map((day) => {
              const selected = day === selectedDate;
              const isToday = day === today;

              return (
                <Link
                  key={day}
                  href={`/?date=${day}`}
                  style={{
                    textDecoration: "none",
                    textAlign: "center",
                    color: selected ? "#142033" : "#fff",
                    background: selected
                      ? "#ffc247"
                      : isToday
                        ? "#28486b"
                        : "transparent",
                    borderRadius: 12,
                    padding: "12px 0",
                    minWidth: 0,
                  }}
                >
                  <div style={{
                    fontSize: 10,
                    opacity: 0.8,
                  }}>
                    {formatDate(day, {
                      weekday: "short",
                    }).toUpperCase()}
                  </div>

                  <div style={{
                    fontSize: 19,
                    fontWeight: "bold",
                    marginTop: 8,
                  }}>
                    {Number(day.slice(-2))}
                  </div>

                  <div style={{
                    fontSize: 13,
                    color: selected
                      ? "#142033"
                      : "#ffc247",
                    height: 14,
                  }}>
                    {questDates.has(day) ? "●" : ""}
                  </div>
                </Link>
              );
            })}
          </div>

          <Link
            href={`/?date=${nextWeek}`}
            style={{
              color: "#ffc247",
              fontSize: 25,
              textDecoration: "none",
            }}
          >
            ›
          </Link>
        </div>
      </section>


      <section>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}>
          <div>
            <h2 style={{ margin: "0 0 5px" }}>
              ⚔️ Quests
            </h2>

            <span style={{
              color: "#aebed1",
              fontSize: 13,
            }}>
              {formatDate(selectedDate, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>

          <span style={{ color: "#ffc247" }}>
            {completed.length} / {selectedQuests.length}
          </span>
        </div>

        {error && (
          <p>⚠️ Unable to load quests.</p>
        )}

        {!error && orderedQuests.length === 0 && (
          <div style={styles.card}>
            No quests scheduled for this day.
          </div>
        )}

        {orderedQuests.map((quest) => {
          const done = quest.status === "completed";
          const colour =
            colours[quest.category] ?? "#ffc247";

          return (
            <article
              key={quest.id}
              style={{
                background: done ? "#dce6ed" : "#fff",
                color: "#152338",
                borderLeft: `6px solid ${colour}`,
                borderRadius: 15,
                padding: 15,
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: done ? 0.7 : 1,
              }}
            >
              {done ? (
                <span style={{
                  fontSize: 26,
                  color: "#159b61",
                }}>
                  ✓
                </span>
              ) : (
                <form
                  action={completeQuest.bind(
                    null,
                    quest.id
                  )}
                >
                  <button
                    type="submit"
                    aria-label={`Complete ${quest.title}`}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "2px solid #9aacc4",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  />
                </form>
              )}

              <span style={{ fontSize: 25 }}>
                {icons[quest.category] ?? "📜"}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{
                  fontSize: 16,
                  textDecoration: done
                    ? "line-through"
                    : "none",
                }}>
                  {quest.title}
                </strong>

                <div style={{
                  fontSize: 12,
                  color: "#547095",
                  marginTop: 5,
                }}>
                  +{quest.xp_reward} XP ·
                  +{quest.coin_reward} Coins
                </div>
              </div>

              <span style={{
                fontSize: 11,
                color: colour,
                fontWeight: "bold",
              }}>
                {done ? "DONE" : ""}
              </span>
            </article>
          );
        })}
      </section>

      <section style={{
        ...styles.card,
        marginTop: 28,
        background:
          "linear-gradient(135deg, #163c72, #152642)",
      }}>
        <div style={{
          color: "#ffc247",
          fontWeight: "bold",
          letterSpacing: 2,
          fontSize: 12,
        }}>
          ✨ GAME MASTER
        </div>

        <h2 style={{ margin: "12px 0" }}>
          What happened?
        </h2>

        <p style={{
          color: "#c2d0df",
          fontSize: 13,
        }}>
          Tell your Game Master what you've done,
          plan your day, or ask about your quests.
        </p>

        <GameMasterForm />
      </section>

      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#0a192d",
        borderTop: "1px solid #304767",
        display: "flex",
        justifyContent: "space-around",
        padding: "14px 4px 22px",
        zIndex: 10,
      }}>
        {[
          ["🛡️", "Hero"],
          ["📅", "Quests"],
          ["🪙", "Money"],
          ["🌌", "Dream"],
          ["💬", "GM"],
        ].map(([icon, label]) => (
          <div
            key={label}
            style={{
              textAlign: "center",
              fontSize: 11,
              color: label === "Quests"
                ? "#ffc247"
                : "#a5b6ce",
            }}
          >
            <div style={{ fontSize: 23 }}>
              {icon}
            </div>
            {label}
          </div>
        ))}
      </nav>
    </main>
  );
}
