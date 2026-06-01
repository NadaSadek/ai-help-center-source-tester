from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from numpy.typing import NDArray
from scipy.sparse import spmatrix
from sentence_transformers import SentenceTransformer
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
OUTPUT_PATH = Path("data/hybrid-results-tfidf50-mpnet50.json")
EMBEDDING_MODEL_NAME = "sentence-transformers/all-mpnet-base-v2"
STRATEGY_NAME = "hybrid-tfidf50-mpnet50"
KEYWORD_WEIGHT = 0.5
EMBEDDING_WEIGHT = 0.5
TOP_K = 5


def load_json(path: Path):
    content_str = path.read_text(encoding="utf-8")
    return json.loads(content_str)


def encode_text_embedding(
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


def normalize_scores(scores: NDArray[np.float64]) -> NDArray[np.float64]:
    magnitude = np.linalg.norm(scores)

    if magnitude == 0:
        return scores

    return scores / magnitude


def combine_scores(
    keyword_scores: NDArray[np.float64],
    embedding_scores: NDArray[np.float64],
) -> NDArray[np.float64]:
    return (KEYWORD_WEIGHT * keyword_scores) + (EMBEDDING_WEIGHT * embedding_scores)


def get_keyword_question_scores(
    question: str,
    vectorizer: TfidfVectorizer,
    chunk_vectors: spmatrix,
):
    question_vector: spmatrix = vectorizer.transform([question])

    return cosine_similarity(question_vector, chunk_vectors)[0]


def get_embedding_question_scores(
    question: str,
    model: SentenceTransformer,
    chunk_vectors: NDArray[np.float32],
):
    question_vector = encode_text_embedding(
        model,
        [question],
    )
    return cosine_similarity(question_vector, chunk_vectors)[0]


def get_top_results(
    question_obj: TestQuestion,
    chunks: list[Chunk],
    vectorizer: TfidfVectorizer,
    model: SentenceTransformer,
    keyword_chunk_vectors: spmatrix,
    embedding_chunk_vectors: NDArray[np.float32],
    top_k: int,
    strategy_name: str,
) -> QuestionRetrievalResult:
    question = question_obj["question"]

    normalized_keyword_score = normalize_scores(
        get_keyword_question_scores(question, vectorizer, keyword_chunk_vectors)
    )

    normalized_embedding_score = normalize_scores(
        get_embedding_question_scores(question, model, embedding_chunk_vectors)
    )
    combined_score = combine_scores(
        keyword_scores=normalized_keyword_score,
        embedding_scores=normalized_embedding_score,
    )

    ranked_indices: list[int] = combined_score.argsort()[::-1][:top_k].tolist()

    results: list[RetrievalResult] = []

    for rank, chunk_index in enumerate(ranked_indices, start=1):
        chunk = chunks[chunk_index]
        score = combined_score[chunk_index]
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
    chunk_text_list = [chunk["text"] for chunk in chunks]

    questions: list[TestQuestion] = load_json(QUESTIONS_PATH)

    vectorizer = TfidfVectorizer(stop_words="english")
    keyword_chunk_vectors: spmatrix = vectorizer.fit_transform(chunk_text_list)

    model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    embedding_chunk_vectors = encode_text_embedding(model, chunk_text_list)

    all_questions_results = [
        get_top_results(
            question_obj,
            chunks,
            vectorizer,
            model,
            keyword_chunk_vectors,
            embedding_chunk_vectors,
            TOP_K,
            STRATEGY_NAME,
        )
        for question_obj in questions
    ]

    OUTPUT_PATH.write_text(
        json.dumps(all_questions_results, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
