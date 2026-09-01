import assert from "node:assert/strict";
import { test } from "node:test";
import { routeBrief, titleFromBrief } from "../src/router.ts";

test("routes inbox language to Signal", () => {
  assert.equal(routeBrief("archive this thread").deckId, "signal");
});

test("routes calendar language to Orbit", () => {
  assert.equal(routeBrief("hold Friday for the demo").deckId, "orbit");
});

test("routes ledger language to Vault", () => {
  assert.equal(routeBrief("put a receipt on the ledger").deckId, "vault");
});

test("routes scrape language to Lens", () => {
  assert.equal(routeBrief("scrape the docs and dedupe").deckId, "lens");
});

test("routes brief language to Forge", () => {
  assert.equal(routeBrief("write a brief of the floor plan").deckId, "forge");
});

test("routes outbound language to Drift", () => {
  assert.equal(routeBrief("draft a follow up and keep it in the send queue").deckId, "drift");
});

test("falls back to Forge", () => {
  assert.equal(routeBrief("make sense of yesterday").deckId, "forge");
});

test("title is the first line", () => {
  assert.equal(titleFromBrief("Hold Friday\nmore detail"), "Hold Friday");
});
