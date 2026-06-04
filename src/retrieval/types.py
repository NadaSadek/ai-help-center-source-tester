from typing import Literal, TypedDict


class Chunk(TypedDict):
    chunkId: str
    docId: str
    title: str
    category: str
    sourcePath: str
    text: str


QuestionCategory = Literal[
    "billing",
    "billing_access",
    "workspace_access",
    "plans",
    "exports",
    "permissions",
    "multi_intent",
    "negative_case",
]

QuestionSlice = Literal[
    "exact_keyword",
    "semantic_paraphrase",
    "multi_intent",
    "vague_wording",
    "permission_boundary",
    "billing_access_overlap",
    "plan_limit",
    "export_permission",
    "negative_case",
]

QuestionDifficulty = Literal["easy", "medium", "hard"]

ExpectedBehavior = Literal[
    "retrieve_expected_sources",
    "return_no_confident_match",
]


class TestQuestion(TypedDict):
    id: str
    question: str
    expectedDocIds: list[str]
    category: QuestionCategory
    slices: list[QuestionSlice]
    difficulty: QuestionDifficulty
    expectedBehavior: ExpectedBehavior
    notes: str


class RetrievalResult(TypedDict):
    rank: int
    docId: str
    chunkId: str
    title: str
    score: float


class QuestionRetrievalResult(TypedDict):
    questionId: str
    question: str
    strategy: str
    results: list[RetrievalResult]


class RetrievalMetrics(TypedDict):
    hitAt1: bool
    hitAt3: bool
    hitAt5: bool
    recallAt3: float
    recallAt5: float
    reciprocalRank: float


class MetricsSummary(TypedDict):
    meanHitAt1: float
    meanHitAt3: float
    meanHitAt5: float
    meanRecallAt3: float
    meanRecallAt5: float
    mrr: float


class QuestionEvaluation(TypedDict):
    questionId: str
    question: str
    expectedDocIds: list[str]
    retrievedDocIds: list[str]
    category: QuestionCategory
    slices: list[QuestionSlice]
    difficulty: QuestionDifficulty
    expectedBehavior: ExpectedBehavior
    metrics: RetrievalMetrics


class GroupedEvaluationSummary(TypedDict):
    questionCount: int
    summary: MetricsSummary


class QuestionsEvaluation(TypedDict):
    strategy: str
    questionCount: int
    positiveQuestionCount: int
    negativeQuestionCount: int
    summary: MetricsSummary
    questions: list[QuestionEvaluation]
    byCategory: dict[str, GroupedEvaluationSummary]
    bySlice: dict[str, GroupedEvaluationSummary]
    byDifficulty: dict[str, GroupedEvaluationSummary]
