import { approve, issue, run } from "../src/engine.ts";
import { emptyStore } from "../src/store.ts";

const store = emptyStore();
const job = issue(store, "scrape official Grok Bot help pages, then write a brief");
run(store, job.id);
approve(store, job.id);

process.stdout.write(`job ${job.id} routed to ${job.deckId}\n`);
process.stdout.write(`memories ${store.memories.length}\n`);
