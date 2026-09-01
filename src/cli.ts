#!/usr/bin/env node
import { DECKS, DECK_BY_ID } from "./decks.ts";
import { approve, counts, hold, issue, run } from "./engine.ts";
import { defaultStatePath, loadStore, saveStore } from "./store.ts";
import type { DeckId } from "./types.ts";

const USAGE = `orbital <command>

Commands
  decks                         list the six decks
  issue <brief> [--deck id]     CHIEF assigns a job
  run <id>                      deck executes, parks in review
  approve <id>                  you approve, memory is written
  hold <id>                     park the job
  status                        counts and open jobs
  job <id>                      one job, including draft
  memory [deck]                 per-deck memory
  log                           last assignments

State file: ${defaultStatePath()}
`;

function main(argv: string[]): number {
  const [cmd = "help", ...rest] = argv;
  const store = loadStore();

  if (cmd === "help" || cmd === "-h" || cmd === "--help") {
    process.stdout.write(USAGE);
    return 0;
  }

  if (cmd === "decks") {
    for (const d of DECKS) {
      process.stdout.write(`${d.id.padEnd(8)} ${d.name.padEnd(8)} ${d.label}\n`);
    }
    return 0;
  }

  if (cmd === "issue") {
    const deckFlag = takeFlag(rest, "--deck");
    const brief = rest.join(" ").trim();
    const job = issue(store, brief, parseDeck(deckFlag));
    const executed = run(store, job.id);
    saveStore(store);
    process.stdout.write(
      `${executed.id}  ${DECK_BY_ID[executed.deckId].name}  ${executed.status}  ${executed.title}\n`,
    );
    process.stdout.write(`${executed.routeReason}\n`);
    return 0;
  }

  if (cmd === "run") {
    const job = run(store, need(rest[0], "id"));
    saveStore(store);
    process.stdout.write(`${job.id}  ${job.status}\n`);
    if (job.output) process.stdout.write(`${job.output}\n`);
    return 0;
  }

  if (cmd === "approve") {
    const job = approve(store, need(rest[0], "id"));
    saveStore(store);
    process.stdout.write(`${job.id}  ${job.status}  memory written to ${job.deckId}\n`);
    return 0;
  }

  if (cmd === "hold") {
    const job = hold(store, need(rest[0], "id"));
    saveStore(store);
    process.stdout.write(`${job.id}  ${job.status}\n`);
    return 0;
  }

  if (cmd === "status") {
    const c = counts(store);
    process.stdout.write(
      `issued ${c.issued}  queued ${c.queued}  review ${c.review}  held ${c.held}  done ${c.done}  mem ${c.memories}\n`,
    );
    for (const job of store.jobs.filter((j) => j.status !== "done")) {
      process.stdout.write(
        `${job.id}  ${job.status.padEnd(7)}  ${DECK_BY_ID[job.deckId].name.padEnd(7)}  ${job.title}\n`,
      );
    }
    return 0;
  }

  if (cmd === "job") {
    const id = need(rest[0], "id");
    const job = store.jobs.find((j) => j.id === id || j.id.startsWith(id));
    if (!job) {
      process.stderr.write(`job not found: ${id}\n`);
      return 1;
    }
    process.stdout.write(`${JSON.stringify(job, null, 2)}\n`);
    return 0;
  }

  if (cmd === "memory") {
    const deck = rest[0];
    const notes = deck
      ? store.memories.filter((m) => m.deckId === deck)
      : store.memories;
    for (const n of notes) {
      const first = n.text.split("\n")[0] ?? "";
      process.stdout.write(`${n.at}  ${n.deckId.padEnd(7)}  ${first}\n`);
    }
    return 0;
  }

  if (cmd === "log") {
    for (const entry of store.log.slice(0, 20)) {
      process.stdout.write(`${entry.at}  ${entry.kind.padEnd(7)}  ${entry.text}\n`);
    }
    return 0;
  }

  process.stderr.write(`unknown command: ${cmd}\n\n${USAGE}`);
  return 1;
}

function need(value: string | undefined, name: string): string {
  if (!value) throw new Error(`missing ${name}`);
  return value;
}

function takeFlag(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  if (i === -1) return undefined;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
}

function parseDeck(value: string | undefined): DeckId | undefined {
  if (!value) return undefined;
  const hit = DECKS.find(
    (d) => d.id === value || d.name.toLowerCase() === value.toLowerCase(),
  );
  if (!hit) throw new Error(`unknown deck: ${value}`);
  return hit.id;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (err) {
  process.stderr.write(`${err instanceof Error ? err.message : err}\n`);
  process.exitCode = 1;
}
