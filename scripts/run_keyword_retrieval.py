from __future__ import annotations

import json
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import spmatrix

CHUNKS_PATH = Path("data/chunks.json")
QUESTIONS_PATH = Path("data/test-questions.json")
OUTPUT_PATH = Path("data/keyword-results.json")
TOP_K = 5


def load_json(path: Path):
    content_str = path.read_text(encoding="utf-8")
    return json.loads(content_str)


def get_top_results(
    question: str,
    chunks: list[dict[str, str]],
    vectorizer: TfidfVectorizer,
    chunk_vectors: spmatrix,
    top_k: int,
) -> list[dict[str, str | int | float]]:
    question_vector: spmatrix = vectorizer.transform([question])
    similarities = cosine_similarity(question_vector, chunk_vectors)[0]
    ranked_indices: list[int] = similarities.argsort()[::-1][:top_k]
    results: list[dict[str, str | int | float]] = []
   
    # ranked_indices stores indexes of the original chunks list ordered by similarity score (rank). 
    # `rank` is the position (index) in ranked_indices which tells us which the order of chunks after cosine similarity
    # `chunk_index` is the value that's stored in ranked_indices to indicate which chunk has higher score
    for rank, chunk_index in enumerate(ranked_indices, start=1):
        chunk = chunks[chunk_index]
        score = similarities[chunk_index]
        results.append(
            {
                "questionId": "q001",
                "question": question,
                "strategy": "tfidf",
                "docId": chunk["docId"],
                "chunkId": chunk["chunkId"],
                "title": chunk["title"],
                "score": round(float(score), 3),
                "rank": rank,
            }
        )

    return results


def main() -> None:
    chunks: list[dict[str, str]] = load_json(CHUNKS_PATH)
    chunk_texts = [chunk["text"] for chunk in chunks]
    # questions: list[dict[str, str]] = load_json(QUESTIONS_PATH)
    vectorizer = TfidfVectorizer(stop_words="english")
    chunk_vectors: spmatrix = vectorizer.fit_transform(chunk_texts)
    question = (
        "I cancelled my subscription. Why can I still use ExampleOps until next month?"
    )
    results = get_top_results(question, chunks, vectorizer, chunk_vectors, 3)
    OUTPUT_PATH.write_text(
        json.dumps(results, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
