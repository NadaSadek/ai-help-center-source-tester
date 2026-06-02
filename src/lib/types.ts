export type Summary = {
  meanHitAt1: number;
  meanHitAt3: number;
  meanHitAt5: number;
  meanRecallAt3: number;
  meanRecallAt5: number;
  mrr: number;
};

export type Question = {
  questionId: string;
  question: string;
  expectedDocIds: string[];
  retrievedDocIds: string[];
  metrics: {
    hitAt1: boolean;
    hitAt3: boolean;
    hitAt5: boolean;
    recallAt3: number;
    recallAt5: number;
    reciprocalRank: number;
  };
};

export type EvalResult = {
  strategy: string;
  questions: Question[];
  summary: Summary;
};

export type TestQuestion = {
  id: string;
  question: string;
  expectedDocIds: string[];
  category: string;
  difficulty: string;
  notes: string;
};

export type FailureAnalysis = {
  questionId: string;
  failureNote: string;
  failureType: string;
  retrievalNote: string;
  strategyFindings: {
    strategy: string;
    finding: string;
    affectedMetrics: string[];
  }[];
};
