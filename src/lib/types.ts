import type {
  MetricsSummary,
  QuestionEvaluation,
  QuestionCategory,
  QuestionDifficulty,
  QuestionSlice,
  ExpectedBehavior,
} from "../types/evaluation";

export type Summary = MetricsSummary;
export type Question = QuestionEvaluation;

export type TestQuestion = {
  id: string;
  question: string;
  expectedDocIds: string[];
  category: QuestionCategory;
  slices: QuestionSlice[];
  difficulty: QuestionDifficulty;
  expectedBehavior: ExpectedBehavior;
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
