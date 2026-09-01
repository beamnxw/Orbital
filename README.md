# Orbital

Second brain inside Grok Bot.

One CHIEF issues the work. Six decks execute. You approve.

```
CHIEF
→ signal deck  |  inbox, threads, archive
→ orbit deck   |  calendar, holds, reminders
→ vault deck   |  invoices, receipts, ledger
→ lens deck    |  scrape, enrich, dedupe
→ forge deck   |  reports, charts, briefs
→ drift deck   |  outreach, follow ups, send queue
```

1000+ agents with their own memory. Each deck keeps its own. CHIEF is the only decision-maker. One login. One profile.

## Status

| Surface | State |
| --- | --- |
| Floor plan | Live in `/docs` |
| Local engine + CLI | Live |
| Deck prompts | Live in `/prompts` |
| Grok Bot host | In build |

## Requirements

Node 22+.

## Commands

```bash
npm test
node --experimental-strip-types src/cli.ts decks
node --experimental-strip-types src/cli.ts issue "scrape the Grok Bot docs and write a brief"
node --experimental-strip-types src/cli.ts status
node --experimental-strip-types src/cli.ts approve <id>
```

`issue` routes, runs the deck, and parks a draft in review. `approve` writes that deck's memory.

State lives in `.orbital/state.json`. It is gitignored.

## Layout

```
docs/           floor plan, architecture, changelog
prompts/        CHIEF + six deck skills for the Grok Bot host
src/            router, engine, store, CLI
test/           routing and approval loop
examples/       library usage
```

## Library

```ts
import { approve, issue, run } from "./src/index.ts";
import { emptyStore } from "./src/store.ts";

const store = emptyStore();
const job = issue(store, "hold Friday for the live demo");
run(store, job.id);
approve(store, job.id);
```

## Docs

- [Floor plan](docs/floor-plan.md)
- [Architecture](docs/architecture.md)
- [Changelog](docs/changelog.md)

## Token

A community token launched around this build. This repository is the product. beamnxw did not deploy the token.

## License

MIT
