import { supabase } from "../lib/supabase";

export const dynamic = "force-dynamic";

const questIcons = {
  fitness: "⚡",
  cleaning: "🧹",
  development: "⚔️",
  general: "📜",
};

export default async function Home() {
  const { data: quests, error } = await supabase
    .from("quests")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: true });

  const activeQuests = quests ?? [];

  return (
    <main className="shell">
      <header className="heroHeader">
        <div>
          <p className="eyebrow">LIFE RPG</p>
          <h1>Your adventure awaits.</h1>
        </div>

        <div className="levelBadge">LVL 1</div>
      </header>

      <section className="card progressCard">
        <div className="statRow">
          <strong>⭐ 0 / 100 XP</strong>
          <strong>🪙 0</strong>
        </div>

        <div className="xpBar">
          <div className="xpFill" />
        </div>

        <p className="muted">Your next level awaits.</p>
      </section>

      <section className="questSection">
        <div className="sectionTitle">
          <h2>Today's Quests</h2>
          <span>0 / {activeQuests.length}</span>
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
            <button className="questButton">○</button>

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

        <div className="gmInput">
          <span>Made £240, trained and spent £20 on fuel...</span>
          <strong>➤</strong>
        </div>

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
