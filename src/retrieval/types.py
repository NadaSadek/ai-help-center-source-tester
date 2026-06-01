from typing import TypedDict


class Chunk(TypedDict):
    chunkId: str
    docId: str
    title: str
    category: str
    sourcePath: str
    text: str


class TestQuestion(TypedDict):
    id: str
    question: str
    expectedDocIds: list[str]
    category: str
    difficulty: str
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
    metrics: RetrievalMetrics


class QuestionsEvaluation(TypedDict):
    strategy: str
    questions: list[QuestionEvaluation]
    summary: MetricsSummary
