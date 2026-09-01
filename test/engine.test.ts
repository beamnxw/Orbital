import assert from "node:assert/strict";
import { test } from "node:test";
import { approve, hold, issue, run } from "../src/engine.ts";
import { emptyStore } from "../src/store.ts";

test("issue then run lands in review", () => {
  const store = emptyStore();
  const job = issue(store, "scrape Grok Bot help pages");
  assert.equal(job.deckId, "lens");
  assert.equal(job.status, "queued");
  const ran = run(store, job.id);
  assert.equal(ran.status, "review");
  assert.ok(ran.output?.startsWith("Lens draft"));
});

test("approve writes deck memory", () => {
  const store = emptyStore();
  const job = issue(store, "write a brief for the public floor plan");
  run(store, job.id);
  approve(store, job.id);
  assert.equal(store.jobs[0]?.status, "done");
  assert.equal(store.memories.length, 1);
  assert.equal(store.memories[0]?.deckId, "forge");
});

test("hold parks a job", () => {
  const store = emptyStore();
  const job = issue(store, "archive the credits thread");
  run(store, job.id);
  hold(store, job.id);
  assert.equal(store.jobs[0]?.status, "held");
});

test("manual deck lock", () => {
  const store = emptyStore();
  const job = issue(store, "handle this", "vault");
  assert.equal(job.deckId, "vault");
  assert.equal(job.routeReason, "manual deck lock");
});

test("empty brief throws", () => {
  const store = emptyStore();
  assert.throws(() => issue(store, "  "), /brief is empty/);
});
