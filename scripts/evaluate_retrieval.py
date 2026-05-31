from __future__ import annotations

import json
from pathlib import Path
from typing import TypedDict

QUESTIONS_PATH = Path("data/test-questions.json")
RETRIEVAL_RESULTS_PATH = Path("data/keyword-results.json")
OUTPUT_PATH = Path("data/eval-results.json")


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


class QuestionEvaluation(TypedDict):
    questionId: str
    question: str
    strategy: str
    expectedDocIds: list[str]
    retrievedDocIds: list[str]
    metrics: RetrievalMetrics


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def get_retrieved_doc_ids(results: list[RetrievalResult], k: int) -> list[str]:
    return [result["docId"] for result in results[:k]]


def calculate_hit(
    expected_doc_ids: list[str],
    retrieved_doc_ids: list[str],
) -> bool:
    return any(doc_id in expected_doc_ids for doc_id in retrieved_doc_ids)


def calculate_recall_at_k(
    expected_doc_ids: list[str],
    retrieved_doc_ids: list[str],
) -> float:
    expected = set(expected_doc_ids)
    retrieved = set(retrieved_doc_ids)
    return len(expected & retrieved) / len(expected)


def calculate_reciprocal_rank(
    expected_doc_ids: list[str],
    results: list[RetrievalResult],
) -> float:
    for result in results:
        if result["docId"] in expected_doc_ids:
            return 1 / result["rank"]

    return 0.0


def get_all_retrieved_doc_ids(results: list[RetrievalResult]) -> list[str]:
    return [result["docId"] for result in results]


def evaluate_question(
    retrieval_results: QuestionRetrievalResult, question: TestQuestion
) -> QuestionEvaluation:
    expected_doc_ids = question["expectedDocIds"]
    retrieved_doc_ids = get_all_retrieved_doc_ids(retrieval_results["results"])

    return {
        "questionId": question["id"],
        "question": question["question"],
        "strategy": retrieval_results["strategy"],
        "expectedDocIds": expected_doc_ids,
        "retrievedDocIds": retrieved_doc_ids,
        "metrics": {
            "hitAt1": calculate_hit(
                expected_doc_ids, get_retrieved_doc_ids(retrieval_results["results"], 1)
            ),
            "hitAt3": calculate_hit(
                expected_doc_ids, get_retrieved_doc_ids(retrieval_results["results"], 3)
            ),
            "hitAt5": calculate_hit(
                expected_doc_ids, get_retrieved_doc_ids(retrieval_results["results"], 5)
            ),
            "recallAt3": calculate_recall_at_k(
                expected_doc_ids, get_retrieved_doc_ids(retrieval_results["results"], 3)
            ),
            "recallAt5": calculate_recall_at_k(
                expected_doc_ids, get_retrieved_doc_ids(retrieval_results["results"], 5)
            ),
            "reciprocalRank": calculate_reciprocal_rank(
                expected_doc_ids, retrieval_results["results"]
            ),
        },
    }


def main() -> None:
    questions: list[TestQuestion] = load_json(QUESTIONS_PATH)
    retrieval_results: list[QuestionRetrievalResult] = load_json(RETRIEVAL_RESULTS_PATH)
    retrieval_by_question_id = {item["questionId"]: item for item in retrieval_results}

    all_questions_evaluations_result: list[QuestionEvaluation] = []
    for question in questions:
        retrieval_result = retrieval_by_question_id[question["id"]]
        all_questions_evaluations_result.append(
            evaluate_question(retrieval_result, question)
        )

    OUTPUT_PATH.write_text(
        json.dumps(all_questions_evaluations_result, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
