import { supabase } from "../lib/supabase";
import { completeQuest } from "./action";
export const dynamic = "force-dynamic";

const questIcons = {
  fitness: "⚡",
  cleaning: "🧹",
  development: "⚔️",
  general: "📜",
};

export default async function Home() { 
const { data: player, error: playerError } = await supabase
    .from("player_state")
    .select("level, xp, coins")
    .limit(1)
    .single();
  console.log("PLAYER:", player);
console.log("PLAYER ERROR:", playerError);

const level = player?.level ?? 1;
const xp = player?.xp ?? 0;
const coins = player?.coins ?? 0;
const xpNeeded = 1000 + ((level - 1) * 250);
const xpProgress = Math.min(100, Math.max(0, (xp / xpNeeded) * 100));
const { data: quests, error } = await supabase
  .from("quests")
  .select("*")
  .order("created_at", { ascending: true });

const allQuests = quests ?? [];

const today = new Date().toISOString().slice(0, 10);

const todaysQuests = allQuests.filter(
  (quest) => quest.quest_date === today
);

const activeQuests = todaysQuests.filter(
  (quest) => quest.status === "active"
);

const completedQuests = todaysQuests.filter(
  (quest) => quest.status === "completed"
);
return ( 
    <main className="shell">
      <header className="heroHeader">
        <div>
          <p className="eyebrow">LIFE RPG</p>
          <h1>Your adventure awaits.</h1>
        </div>

        <div className="levelBadge">LVL {level}</div>
      </header>

      <section className="card progressCard">
        <div className="statRow">
          <strong>⭐ {xp} / {xpNeeded} XP</strong>
          <strong>🪙 {coins}</strong>
        </div>

        <div className="xpBar">
          <div className="xpFill" style={{ width: `${xpProgress}%` }} />
        </div>

        <p className="muted">Your next level awaits.</p>
      </section>

      <section className="questSection">
        <div className="sectionTitle">
          <h2>Today's Quests</h2>
          <span>{completedQuests.length} / {todaysQuests.length}</span>
        </div>

        {error && (
          <article className="card quest">
            <div className="questInfo">
              <h3>⚠️ Quest connection failed</h3>
              <p>Unable to load quests from the realm.</p>
            </div>
          </article>
        )}

        {activeQuests.map((quest) => (
          <article className="card quest" key={quest.id}>
            <form action={completeQuest.bind(null, quest.id)}>
  <button className="questButton" type="submit">○</button>
</form>

            <div className="questInfo">
              <h3>
                {questIcons[quest.category] ?? "📜"} {quest.title}
              </h3>

              <p>
                +{quest.xp_reward} XP · +{quest.coin_reward} coins
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="card gameMaster">
        <p className="eyebrow">GAME MASTER</p>
        <h2>What happened?</h2>

        <form className="gmInput">
  <input
    name="message"
    type="text"
    placeholder="Tell the Game Master what happened..."
    autoComplete="off"
  />
  <button type="submit">➤</button>
</form>

        <p className="muted">
          Tell the Game Master what happened in your real life.
        </p>
      </section>

      <nav className="bottomNav">
        <div>🧙<span>Hero</span></div>
        <div className="active">🎮<span>Game</span></div>
        <div>💰<span>Money</span></div>
        <div>💬<span>GM</span></div>
      </nav>
    </main>
  );
}
