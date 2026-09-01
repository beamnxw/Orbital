import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Store } from "./types.ts";

export function emptyStore(): Store {
  return { jobs: [], memories: [], log: [] };
}

export function defaultStatePath(): string {
  return join(process.cwd(), ".orbital", "state.json");
}

export function loadStore(path = defaultStatePath()): Store {
  try {
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (
      !Array.isArray(parsed.jobs) ||
      !Array.isArray(parsed.memories) ||
      !Array.isArray(parsed.log)
    ) {
      return emptyStore();
    }
    return parsed;
  } catch {
    return emptyStore();
  }
}

export function saveStore(store: Store, path = defaultStatePath()): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}
