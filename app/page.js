const quests = [
  { name: "Training", xp: 50, coins: 15, icon: "⚡" },
  { name: "Clean bedroom", xp: 20, coins: 5, icon: "🧹" },
  { name: "Life RPG Development", xp: 30, coins: 10, icon: "⚔️" },
];

export default function Home() {
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
          <span>0 / 3</span>
        </div>

        {quests.map((quest) => (
          <article className="card quest" key={quest.name}>
            <button className="questButton">○</button>

            <div className="questInfo">
              <h3>
                {quest.icon} {quest.name}
              </h3>
              <p>
                +{quest.xp} XP · +{quest.coins} coins
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
