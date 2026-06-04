from __future__ import annotations

import json
import re
from pathlib import Path

from rank_bm25 import BM25Okapi  # pyright: ignore[reportMissingTypeStubs]

from retrieval.types import (
    Chunk,
    QuestionRetrievalResult,
    RetrievalResult,
    TestQuestion,
)

CHUNKS_PATH = Path("data/chunks.json")
QUESTIONS_PATH = Path("data/test-questions.json")
OUTPUT_PATH = Path("data/bm25-results.json")
TOP_K = 5
STRATEGY_NAME = "bm25"

TOKEN_PATTERN = re.compile(r"[a-zA-Z0-9]+")


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def tokenize(text: str) -> list[str]:
    return TOKEN_PATTERN.findall(text.lower())


def get_top_results(
    question_obj: TestQuestion,
    chunks: list[Chunk],
    bm25: BM25Okapi,
    top_k: int,
) -> QuestionRetrievalResult:
    question = question_obj["question"]
    question_tokens = tokenize(question)
    scores = bm25.get_scores(question_tokens)

    ranked_indices = sorted(
        range(len(scores)),
        key=lambda index: scores[index],
        reverse=True,
    )[:top_k]

    results: list[RetrievalResult] = []

    for rank, chunk_index in enumerate(ranked_indices, start=1):
        chunk = chunks[chunk_index]
        score = scores[chunk_index]

        results.append(
            {
                "docId": chunk["docId"],
                "chunkId": chunk["chunkId"],
                "title": chunk["title"],
                "score": round(float(score), 3),
                "rank": rank,
            }
        )

    return {
        "questionId": question_obj["id"],
        "question": question,
        "strategy": STRATEGY_NAME,
        "results": results,
    }


def main() -> None:
    chunks: list[Chunk] = load_json(CHUNKS_PATH)
    questions: list[TestQuestion] = load_json(QUESTIONS_PATH)

    tokenized_corpus = [tokenize(chunk["text"]) for chunk in chunks]
    bm25 = BM25Okapi(tokenized_corpus)

    all_questions_results = [
        get_top_results(question_obj, chunks, bm25, TOP_K)
        for question_obj in questions
    ]

    OUTPUT_PATH.write_text(
        json.dumps(all_questions_results, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()