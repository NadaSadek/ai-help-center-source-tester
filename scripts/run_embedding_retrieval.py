from __future__ import annotations

import json
from pathlib import Path
from typing import TypedDict

import numpy as np
from numpy.typing import NDArray
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from retrieval.types import (
    Chunk,
    QuestionRetrievalResult,
    RetrievalResult,
    TestQuestion,
)

CHUNKS_PATH = Path("data/chunks.json")
QUESTIONS_PATH = Path("data/test-questions.json")
TOP_K = 5


class EmbeddingStrategy(TypedDict):
    name: str
    modelName: str
    outputPath: Path


EMBEDDING_STRATEGIES: list[EmbeddingStrategy] = [
    {
        "name": "embedding-minilm",
        "modelName": "sentence-transformers/all-MiniLM-L6-v2",
        "outputPath": Path("data/embedding-results-minilm.json"),
    },
    {
        "name": "embedding-mpnet",
        "modelName": "sentence-transformers/all-mpnet-base-v2",
        "outputPath": Path("data/embedding-results-mpnet.json"),
    },
]


def load_json(path: Path):
    content_str = path.read_text(encoding="utf-8")
    return json.loads(content_str)


def encode_texts(
    model: SentenceTransformer,
    texts: list[str],
) -> NDArray[np.float32]:
    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
        convert_to_numpy=True,
        convert_to_tensor=False,
    )

    vectors = np.asarray(embeddings, dtype=np.float32)

    if vectors.ndim != 2:
        raise ValueError(f"Expected 2D embedding array, got shape {vectors.shape}")

    return vectors


def get_top_results(
    question_obj: TestQuestion,
    chunks: list[Chunk],
    chunk_vectors: NDArray[np.float32],
    model: SentenceTransformer,
    top_k: int,
    strategy_name: str,
) -> QuestionRetrievalResult:
    question = question_obj["question"]
    question_vector = encode_texts(
        model,
        [question],
    )
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
        "strategy": strategy_name,
        "results": results,
    }


def main() -> None:
    chunks: list[Chunk] = load_json(CHUNKS_PATH)
    questions: list[TestQuestion] = load_json(QUESTIONS_PATH)
    chunk_texts = [chunk["text"] for chunk in chunks]

    for strategy in EMBEDDING_STRATEGIES:
        model = SentenceTransformer(strategy["modelName"])
        chunk_vectors = encode_texts(model, chunk_texts)

        all_questions_results = [
            get_top_results(
                question_obj,
                chunks,
                chunk_vectors,
                model,
                TOP_K,
                strategy["name"],
            )
            for question_obj in questions
        ]

        strategy["outputPath"].write_text(
            json.dumps(all_questions_results, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )


if __name__ == "__main__":
    main()
