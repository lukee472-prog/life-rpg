"use client";

import { useState } from "react";
import Link from "next/link";
import { completeQuest } from "./action";
import GameMasterForm from "./GameMasterForm";
import LivingWorld from "./LivingWorld";
import "./waking.css";

const icons = { fitness: "⚡", cleaning: "🧹", development: "💻", general: "📜" };
const colors = { fitness: "#51bf85", cleaning: "#66b9e9", development: "#e98bb5", general: "#eab45f" };
const tabs = [["home", "⌂", "Home"], ["quests", "✦", "Quests"], ["money", "◈", "Money"], ["habits", "◎", "Habits"], ["dream", "☾", "Dream"]];
const format = (day, opts) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts }).format(new Date(day + "T12:00:00Z"));

export default function WakingScreen({ today, selectedDate, week, previousWeek, nextWeek, level, xp, coins, xpNeeded, progress, quests, questDates, hasError }) {
  const [tab, setTab] = useState("home");
  const [gmOpen, setGmOpen] = useState(false);\n  const [questsExpanded, setQuestsExpanded] = useState(false);
  const completed = quests.filter(q => q.status === "completed").length;
  const panel = tab !== "home" || questsExpanded;
  return (
    <main className="waking-app">
      <div className="world-backdrop" aria-hidden="true"><LivingWorld /></div>
      <div className="waking-tint" aria-hidden="true" />

      <header className="waking-top">
        <div className="waking-brand-row">
          <div><div className="waking-eyebrow">YOUR LIFE, YOUR ADVENTURE</div><div className="waking-title">Life <span>RPG</span><span className="waking-spark"> ✦</span></div></div>
          <div className="waking-level">✦ LEVEL {level}</div>
        </div>
        <div className="waking-stats">
          <div className="waking-stat-label"><span>⚡ {xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP</span><span className="waking-coins">🪙 {coins.toLocaleString()}</span></div>
          <div className="waking-xp-track"><div className="waking-xp-fill" style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="waking-calendar">
          <div className="waking-calendar-top"><strong>{format(selectedDate, { month: "long", year: "numeric" })}</strong><Link href="/" className="waking-today">Today ↗</Link></div>
          <div className="waking-week"><Link className="waking-arrow" href={`/?date=${previousWeek}`} aria-label="Previous week">‹</Link>
            {week.map(day => <Link key={day} href={`/?date=${day}`} className={`waking-day ${day === selectedDate ? "selected" : ""} ${day === today ? "is-today" : ""}`}><small>{format(day, { weekday: "short" }).slice(0, 2)}</small><strong>{Number(day.slice(-2))}</strong><i>{questDates.includes(day) ? "•" : " "}</i></Link>)}
            <Link className="waking-arrow" href={`/?date=${nextWeek}`} aria-label="Next week">›</Link>
          </div>
        </div>
      </header>

      <div className="waking-room-label"><span className="waking-live-dot" /> MY LITTLE CORNER OF THE WORLD</div>

      <section className={`waking-quest-drawer ${panel ? "panel-open" : ""}`} aria-label="Your quests">
        <div className="waking-quest-heading"><div><span className="waking-quest-overline">{panel ? "YOUR ADVENTURE" : "TODAY'S ADVENTURE"}</span><h2>{tab === "money" ? "Money" : tab === "habits" ? "Habits" : tab === "dream" ? "Dreamscape" : "Your quests"} <span>✦</span></h2><p>{format(selectedDate, { weekday: "long", day: "numeric", month: "long" })}</p></div>{(tab === "home" || tab === "quests") && <span className="waking-quest-count">{completed}/{quests.length}</span>}<button type="button" className="waking-quest-toggle" onClick={() => setQuestsExpanded(v => !v)} aria-expanded={panel} aria-label={panel ? "Collapse quest panel" : "Expand quest panel"}>{panel ? "⌄ Less" : "⌃ More"}</button></div>
        {(tab === "home" || tab === "quests") ? (
          <div className="waking-quest-scroll">
            {hasError && <p className="waking-empty">Unable to load quests right now.</p>}
            {!hasError && quests.length === 0 && <div className="waking-empty">No quests for this day yet. Tell your Game Master what you're planning ✨</div>}
            {quests.map(q => {
              const done = q.status === "completed";
              return <article className={`waking-quest ${done ? "done" : ""}`} key={q.id} style={{ "--quest-accent": colors[q.category] || colors.general }}>
                {done ? <div className="waking-check completed">✓</div> : <form action={completeQuest.bind(null, q.id)}><button type="submit" className="waking-check" aria-label={`Complete ${q.title}`} /></form>}
                <span className="waking-quest-icon">{icons[q.category] || "📜"}</span>
                <div className="waking-quest-copy"><strong>{q.title}</strong><small>+{q.xp_reward} XP <span>·</span> +{q.coin_reward} coins</small></div>
                {done && <span className="waking-done">DONE</span>}
              </article>;
            })}
          </div>
        ) : <div className="waking-placeholder">{tab === "money" ? "Your money kingdom is coming together. For now, tell your Game Master about your income, bills or savings." : tab === "habits" ? "Small actions. Big character growth. Habit tracking is coming to this space." : "A different world awaits. Your Dreamscape will grow as you progress in real life."}<p>Nothing has been changed in your saved game.</p></div>}
      </section>

      <div className="waking-gm">
        {gmOpen && <div className="waking-gm-caption"><span>✦ YOUR GAME MASTER</span><button onClick={() => setGmOpen(false)} aria-label="Close Game Master">×</button></div>}
        <GameMasterForm />
      </div>
      <nav className="waking-nav" aria-label="Main navigation">
        {tabs.map(([id, icon, label]) => <button key={id} type="button" onClick={() => { setTab(id); setGmOpen(false); setQuestsExpanded(false); }} className={`waking-nav-item ${tab === id ? "active" : ""}`} aria-current={tab === id ? "page" : undefined}><span className="waking-nav-icon">{icon}</span><span>{label}</span></button>)}
      </nav>
    </main>
  );
}
