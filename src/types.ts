export type DeckId =
  | "signal"
  | "orbit"
  | "vault"
  | "lens"
  | "forge"
  | "drift";

export type JobStatus = "queued" | "running" | "review" | "done" | "held";

export type Job = {
  id: string;
  title: string;
  brief: string;
  deckId: DeckId;
  routeReason: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  output: string | null;
};

export type MemoryNote = {
  id: string;
  deckId: DeckId;
  jobId: string | null;
  text: string;
  at: string;
};

export type LogEntry = {
  id: string;
  at: string;
  kind: "assign" | "run" | "review" | "approve" | "hold";
  text: string;
  jobId: string | null;
  deckId: DeckId | null;
};

export type DeckDef = {
  id: DeckId;
  name: string;
  label: string;
  duties: string;
};

export type Store = {
  jobs: Job[];
  memories: MemoryNote[];
  log: LogEntry[];
};

export type RouteResult = {
  deckId: DeckId;
  reason: string;
};
