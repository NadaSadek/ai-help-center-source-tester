from __future__ import annotations

import json
from pathlib import Path

from scipy.sparse import spmatrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from retrieval.types import (
    Chunk,
    QuestionRetrievalResult,
    RetrievalResult,
    TestQuestion,
)

CHUNKS_PATH = Path("data/chunks.json")
QUESTIONS_PATH = Path("data/test-questions.json")
OUTPUT_PATH = Path("data/keyword-results.json")
TOP_K = 5


def load_json(path: Path):
    content_str = path.read_text(encoding="utf-8")
    return json.loads(content_str)


def get_top_results(
    question_obj: TestQuestion,
    chunks: list[Chunk],
    vectorizer: TfidfVectorizer,
    chunk_vectors: spmatrix,
    top_k: int,
) -> QuestionRetrievalResult:
    question = question_obj["question"]
    question_vector: spmatrix = vectorizer.transform([question])
    similarities = cosine_similarity(question_vector, chunk_vectors)[0]
    ranked_indices: list[int] = similarities.argsort()[::-1][:top_k].tolist()
    results: list[RetrievalResult] = []

    for rank, chunk_index in enumerate(ranked_indices, start=1):
        chunk = chunks[chunk_index]
        score = similarities[chunk_index]
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
        "strategy": "tfidf",
        "results": results,
    }


def main() -> None:
    chunks: list[Chunk] = load_json(CHUNKS_PATH)
    chunk_texts = [chunk["text"] for chunk in chunks]
    vectorizer = TfidfVectorizer(stop_words="english")
    chunk_vectors: spmatrix = vectorizer.fit_transform(chunk_texts)

    questions: list[TestQuestion] = load_json(QUESTIONS_PATH)

    all_questions_results = [
        get_top_results(question_obj, chunks, vectorizer, chunk_vectors, TOP_K)
        for question_obj in questions
    ]

    OUTPUT_PATH.write_text(
        json.dumps(all_questions_results, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
