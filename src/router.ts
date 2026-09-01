import type { DeckId, RouteResult } from "./types.ts";

const RULES: { deck: DeckId; keys: string[]; reason: string }[] = [
  {
    deck: "signal",
    keys: ["inbox", "thread", "archive", "mail", "email", "message", "reply"],
    reason: "inbox and thread language",
  },
  {
    deck: "orbit",
    keys: [
      "calendar",
      "remind",
      "hold",
      "meeting",
      "schedule",
      "deadline",
      "friday",
      "tomorrow",
    ],
    reason: "time and calendar language",
  },
  {
    deck: "vault",
    keys: [
      "invoice",
      "receipt",
      "ledger",
      "pay",
      "spend",
      "credit",
      "usd",
      "sol",
      "fee",
    ],
    reason: "money and ledger language",
  },
  {
    deck: "lens",
    keys: [
      "scrape",
      "enrich",
      "dedupe",
      "url",
      "source",
      "research",
      "docs",
      "paper",
    ],
    reason: "source and research language",
  },
  {
    deck: "drift",
    keys: [
      "outreach",
      "follow up",
      "follow-up",
      "send",
      "queue",
      "dm",
      "deployer",
    ],
    reason: "outbound language",
  },
  {
    deck: "forge",
    keys: ["report", "chart", "brief", "write", "summary", "site", "readme"],
    reason: "brief and report language",
  },
];

export function routeBrief(text: string): RouteResult {
  const t = text.toLowerCase();
  for (const rule of RULES) {
    const hit = rule.keys.find((k) => t.includes(k));
    if (hit) return { deckId: rule.deck, reason: `${rule.reason} (${hit})` };
  }
  return {
    deckId: "forge",
    reason: "no specific deck cue, Forge drafts a brief",
  };
}

export function titleFromBrief(brief: string): string {
  const line = brief.trim().split("\n")[0] ?? "Untitled";
  if (!line) return "Untitled";
  return line.length > 72 ? `${line.slice(0, 69)}...` : line;
}
