import { randomUUID } from "node:crypto";
import { DECK_BY_ID } from "./decks.ts";
import { routeBrief, titleFromBrief } from "./router.ts";
import type { DeckId, Job, LogEntry, MemoryNote, Store } from "./types.ts";

function now(): string {
  return new Date().toISOString();
}

function nid(): string {
  return randomUUID().slice(0, 8);
}

function log(
  store: Store,
  kind: LogEntry["kind"],
  text: string,
  jobId: string | null,
  deckId: DeckId | null,
): void {
  store.log.unshift({
    id: nid(),
    at: now(),
    kind,
    text,
    jobId,
    deckId,
  });
  store.log = store.log.slice(0, 200);
}

export function draftOutput(job: Job): string {
  const deck = DECK_BY_ID[job.deckId];
  const lines: Record<DeckId, string> = {
    signal: `Signal draft\nThread captured.\nSuggested archive label: orbital/${job.id}.\nReady for your archive call.`,
    orbit: `Orbit draft\nHold created from the brief.\nReminder armed.\nConfirm to pin it on the calendar.`,
    vault: `Vault draft\nLedger line prepared.\nNo funds moved.\nApprove to commit the line.`,
    lens: `Lens draft\nSources pulled. Duplicates dropped.\nResidue ready for Forge.\nApprove to store this scrape in Lens memory.`,
    forge: `Forge draft\nBrief assembled from the assignment.\nShape: one page, three beats, one ask.\nApprove to file this in Forge memory.`,
    drift: `Drift draft\nOutbound item sitting in the send queue.\nNo message left the building.\nApprove to keep it queued for send.`,
  };
  return lines[job.deckId] ?? `${deck.name} draft ready.`;
}

export function issue(store: Store, brief: string, forceDeck?: DeckId): Job {
  const trimmed = brief.trim();
  if (!trimmed) throw new Error("brief is empty");
  const routed = forceDeck
    ? { deckId: forceDeck, reason: "manual deck lock" }
    : routeBrief(trimmed);
  const ts = now();
  const job: Job = {
    id: nid(),
    title: titleFromBrief(trimmed),
    brief: trimmed,
    deckId: routed.deckId,
    routeReason: routed.reason,
    status: "queued",
    createdAt: ts,
    updatedAt: ts,
    output: null,
  };
  store.jobs.unshift(job);
  log(
    store,
    "assign",
    `CHIEF assigned "${job.title}" to ${DECK_BY_ID[job.deckId].name} · ${routed.reason}`,
    job.id,
    job.deckId,
  );
  return job;
}

export function run(store: Store, id: string): Job {
  const job = mustJob(store, id);
  if (job.status !== "queued" && job.status !== "held") {
    throw new Error(`job ${id} is ${job.status}, expected queued or held`);
  }
  job.status = "running";
  job.updatedAt = now();
  log(
    store,
    "run",
    `${DECK_BY_ID[job.deckId].name} running "${job.title}"`,
    job.id,
    job.deckId,
  );
  job.output = draftOutput(job);
  job.status = "review";
  job.updatedAt = now();
  log(
    store,
    "review",
    `${DECK_BY_ID[job.deckId].name} parked "${job.title}" in review`,
    job.id,
    job.deckId,
  );
  return job;
}

export function approve(store: Store, id: string): Job {
  const job = mustJob(store, id);
  if (job.status !== "review" && job.status !== "held") {
    throw new Error(`job ${id} is ${job.status}, expected review or held`);
  }
  const ts = now();
  job.status = "done";
  job.updatedAt = ts;
  const memory: MemoryNote = {
    id: nid(),
    deckId: job.deckId,
    jobId: job.id,
    text: job.output ?? job.brief,
    at: ts,
  };
  store.memories.unshift(memory);
  log(
    store,
    "approve",
    `You approved ${DECK_BY_ID[job.deckId].name}: ${job.title}`,
    job.id,
    job.deckId,
  );
  return job;
}

export function hold(store: Store, id: string): Job {
  const job = mustJob(store, id);
  job.status = "held";
  job.updatedAt = now();
  log(
    store,
    "hold",
    `You held ${DECK_BY_ID[job.deckId].name}: ${job.title}`,
    job.id,
    job.deckId,
  );
  return job;
}

export function counts(store: Store) {
  const jobs = store.jobs;
  return {
    issued: jobs.length,
    queued: jobs.filter((j) => j.status === "queued").length,
    running: jobs.filter((j) => j.status === "running").length,
    review: jobs.filter((j) => j.status === "review").length,
    held: jobs.filter((j) => j.status === "held").length,
    done: jobs.filter((j) => j.status === "done").length,
    memories: store.memories.length,
  };
}

function mustJob(store: Store, id: string): Job {
  const job = store.jobs.find((j) => j.id === id || j.id.startsWith(id));
  if (!job) throw new Error(`job not found: ${id}`);
  return job;
}
