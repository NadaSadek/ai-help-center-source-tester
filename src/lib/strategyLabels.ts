import type { RetrievalStrategy } from "../types/evaluation";

export const strategyLabels: Record<
  RetrievalStrategy,
  {
    label: string;
    description: string;
  }
> = {
  bm25: {
    label: "BM25",
    description: "Lexical baseline with term-frequency ranking",
  },
  tfidf: {
    label: "TF-IDF",
    description: "Keyword baseline",
  },
  "embedding-minilm": {
    label: "MiniLM embedding",
    description: "Lightweight semantic retrieval",
  },
  "embedding-mpnet": {
    label: "MPNet embedding",
    description: "Stronger semantic retrieval",
  },
  "hybrid-tfidf50-mpnet50": {
    label: "Hybrid TF-IDF + MPNet",
    description: "Keyword and semantic retrieval combined",
  },
};