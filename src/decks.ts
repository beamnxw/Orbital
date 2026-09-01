import type { DeckDef, DeckId } from "./types.ts";

export const DECKS: DeckDef[] = [
  {
    id: "signal",
    name: "Signal",
    label: "inbox, threads, archive",
    duties: "Inbound stream. Threads stay intact. Archive is a decision.",
  },
  {
    id: "orbit",
    name: "Orbit",
    label: "calendar, holds, reminders",
    duties: "Time. Holds, reminders, calendar moves.",
  },
  {
    id: "vault",
    name: "Vault",
    label: "invoices, receipts, ledger",
    duties: "Money artifacts. No other deck books spend.",
  },
  {
    id: "lens",
    name: "Lens",
    label: "scrape, enrich, dedupe",
    duties: "Sources in. Duplicates out. Hands residue to Forge.",
  },
  {
    id: "forge",
    name: "Forge",
    label: "reports, charts, briefs",
    duties: "Turns residue into a brief you can approve.",
  },
  {
    id: "drift",
    name: "Drift",
    label: "outreach, follow ups, send queue",
    duties: "Outbound queue. Nothing leaves until you approve.",
  },
];

export const DECK_BY_ID: Record<DeckId, DeckDef> = Object.fromEntries(
  DECKS.map((d) => [d.id, d]),
) as Record<DeckId, DeckDef>;
