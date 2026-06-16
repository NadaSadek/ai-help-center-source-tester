export type RetrievalStrategy =
  | "bm25"
  | "tfidf"
  | "embedding-minilm"
  | "embedding-mpnet"
  | "hybrid-tfidf50-mpnet50";

export type QuestionCategory =
  | "billing"
  | "billing_access"
  | "workspace_access"
  | "plans"
  | "exports"
  | "permissions"
  | "multi_intent"
  | "negative_case";

export type QuestionSlice =
  | "exact_keyword"
  | "semantic_paraphrase"
  | "multi_intent"
  | "vague_wording"
  | "permission_boundary"
  | "billing_access_overlap"
  | "plan_limit"
  | "export_permission"
  | "negative_case";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type ExpectedBehavior =
  | "retrieve_expected_sources"
  | "return_no_confident_match";

export type RetrievalMetrics = {
  hitAt1: boolean;
  hitAt3: boolean;
  hitAt5: boolean;
  recallAt3: number;
  recallAt5: number;
  reciprocalRank: number;
};

export type MetricsSummary = {
  meanHitAt1: number;
  meanHitAt3: number;
  meanHitAt5: number;
  meanRecallAt3: number;
  meanRecallAt5: number;
  mrr: number;
};

export type QuestionEvaluation = {
  questionId: string;
  question: string;
  expectedDocIds: string[];
  retrievedDocIds: string[];
  category: QuestionCategory;
  slices: QuestionSlice[];
  difficulty: QuestionDifficulty;
  expectedBehavior: ExpectedBehavior;
  metrics: RetrievalMetrics;
};

export type GroupedEvaluationSummary = {
  questionCount: number;
  summary: MetricsSummary;
};

export type GroupedEvaluationSummaries<TKey extends string = string> = Partial<
  Record<TKey, GroupedEvaluationSummary>
>;

export type StrategyEvaluation = {
  strategy: RetrievalStrategy;
  questionCount: number;
  positiveQuestionCount: number;
  negativeQuestionCount: number;
  summary: MetricsSummary;
  questions: QuestionEvaluation[];
  byCategory: GroupedEvaluationSummaries<QuestionCategory>;
  bySlice: GroupedEvaluationSummaries<QuestionSlice>;
  byDifficulty: GroupedEvaluationSummaries<QuestionDifficulty>;
};

export type EvaluationResults = StrategyEvaluation[];