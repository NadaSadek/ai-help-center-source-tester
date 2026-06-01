from __future__ import annotations

import json
from pathlib import Path

from retrieval.types import (
    MetricsSummary,
    QuestionEvaluation,
    QuestionRetrievalResult,
    QuestionsEvaluation,
    RetrievalMetrics,
    RetrievalResult,
    TestQuestion,
)

QUESTIONS_PATH = Path("data/test-questions.json")
OUTPUT_PATH = Path("data/eval-results.json")

RETRIEVAL_RESULT_SOURCES = [
    ("tfidf", Path("data/keyword-results.json")),
    ("embedding-minilm", Path("data/embedding-results-minilm.json")),
    ("embedding-mpnet", Path("data/embedding-results-mpnet.json")),
    ("hybrid-tfidf50-mpnet50", Path("data/hybrid-results-tfidf50-mpnet50.json")),
]


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


def calculate_mean(values: list[float]) -> float:
    return sum(values) / len(values)


def calculate_summary_metrics(metrics_list: list[RetrievalMetrics]) -> MetricsSummary:
    return {
        "meanHitAt1": calculate_mean([int(item["hitAt1"]) for item in metrics_list]),
        "meanHitAt3": calculate_mean([int(item["hitAt3"]) for item in metrics_list]),
        "meanHitAt5": calculate_mean([int(item["hitAt5"]) for item in metrics_list]),
        "meanRecallAt3": calculate_mean([item["recallAt3"] for item in metrics_list]),
        "meanRecallAt5": calculate_mean([item["recallAt5"] for item in metrics_list]),
        "mrr": calculate_mean([item["reciprocalRank"] for item in metrics_list]),
    }


def evaluate_strategy(
    questions: list[TestQuestion],
    retrieval_results: list[QuestionRetrievalResult],
    strategy_type: str,
) -> QuestionsEvaluation:
    retrieval_by_question_id = {item["questionId"]: item for item in retrieval_results}

    all_questions_evaluations_result: list[QuestionEvaluation] = []
    for question in questions:
        retrieval_result = retrieval_by_question_id[question["id"]]
        all_questions_evaluations_result.append(
            evaluate_question(retrieval_result, question)
        )

    metrics_list = [
        question_evaluation_result["metrics"]
        for question_evaluation_result in all_questions_evaluations_result
    ]

    eval_result_by_strategy: QuestionsEvaluation = {
        "strategy": strategy_type,
        "summary": calculate_summary_metrics(metrics_list),
        "questions": all_questions_evaluations_result,
    }
    return eval_result_by_strategy


def main() -> None:
    questions: list[TestQuestion] = load_json(QUESTIONS_PATH)

    final_eval_result = [
        evaluate_strategy(questions, load_json(path), strategy)
        for strategy, path in RETRIEVAL_RESULT_SOURCES
    ]
    OUTPUT_PATH.write_text(
        json.dumps(final_eval_result, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
