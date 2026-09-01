# Contributing

This is v0.1 of Orbital. The floor plan is locked. The local engine is the executable spec.

## Loop

1. Write the brief.
2. CHIEF routes to one deck.
3. The deck parks a draft in review.
4. You approve. Memory is written to that deck only.

## Rules

- CHIEF assigns. Decks execute. The operator approves.
- No deck sees the full picture.
- Vault is the only deck that books spend.
- Lens feeds Forge. Lens does not ship a brief.
- Signal owns inbound. Drift owns outbound.
- Nothing leaves without approve.

## Dev

Node 22+.

```bash
npm test
node --experimental-strip-types src/cli.ts issue "your brief"
node --experimental-strip-types src/cli.ts approve <id>
```

Keep runtime deps at zero. Keep state in `.orbital/state.json`. Do not commit that file.
