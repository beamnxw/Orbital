# Architecture

Orbital is a graph, not a chain.

```
                 [ you ]
                    |
                 approve
                    |
                 [ CHIEF ]
                    |
     ---------------------------------------------
     |        |        |        |        |        |
  Signal   Orbit    Vault    Lens    Forge    Drift
     |        |        |        |        |        |
   memory   memory  memory  memory  memory   memory
```

## Nodes

| Node | Sees | Writes |
| --- | --- | --- |
| CHIEF | the brief, the route | assignment |
| Signal | inbox items | thread + archive memory |
| Orbit | time requests | calendar memory |
| Vault | money artifacts | ledger memory |
| Lens | sources | scrape residue |
| Forge | residue + assignment | briefs |
| Drift | approved outbound | send queue |

## Local runtime

This repo ships a local engine so the floor plan is executable today.

- `src/router.ts` picks a deck from the brief.
- `src/engine.ts` runs issue → run → review → approve.
- `src/store.ts` writes `.orbital/state.json`.
- `src/cli.ts` is the operator surface.

The Grok Bot host is still in build. Prompts in `/prompts` are the skill layer for that host.

## State

`.orbital/state.json` is local operator state. Do not commit it.

## Token

A community token launched around this build. This repo is the product. beamnxw did not deploy the token and took comms after. Fees and supply sit with the deployer.
