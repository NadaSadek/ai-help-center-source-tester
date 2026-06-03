from __future__ import annotations

import math


def calculate_hit_at_k(
    expected_doc_ids: list[str],
    retrieved_doc_ids: list[str],
    k: int,
) -> bool:
    top_k_doc_ids = retrieved_doc_ids[:k]
    return any(doc_id in expected_doc_ids for doc_id in top_k_doc_ids)


def calculate_recall_at_k(
    expected_doc_ids: list[str],
    retrieved_doc_ids: list[str],
    k: int,
) -> float:
    if not expected_doc_ids:
        return 0.0

    expected = set(expected_doc_ids)
    retrieved = set(retrieved_doc_ids[:k])

    return len(expected & retrieved) / len(expected)


def calculate_precision_at_k(
    expected_doc_ids: list[str],
    retrieved_doc_ids: list[str],
    k: int,
) -> float:
    if k <= 0:
        return 0.0

    expected = set(expected_doc_ids)
    retrieved = retrieved_doc_ids[:k]

    if not retrieved:
        return 0.0

    relevant_count = sum(1 for doc_id in retrieved if doc_id in expected)
    return relevant_count / k


def calculate_reciprocal_rank(
    expected_doc_ids: list[str],
    retrieved_doc_ids: list[str],
) -> float:
    expected = set(expected_doc_ids)

    for index, doc_id in enumerate(retrieved_doc_ids, start=1):
        if doc_id in expected:
            return 1 / index

    return 0.0


def calculate_dcg_at_k(
    expected_doc_ids: list[str],
    retrieved_doc_ids: list[str],
    k: int,
) -> float:
    expected = set(expected_doc_ids)
    dcg = 0.0

    for index, doc_id in enumerate(retrieved_doc_ids[:k], start=1):
        relevance = 1 if doc_id in expected else 0
        if relevance:
            dcg += relevance / math.log2(index + 1)

    return dcg


def calculate_ndcg_at_k(
    expected_doc_ids: list[str],
    retrieved_doc_ids: list[str],
    k: int,
) -> float:
    if not expected_doc_ids:
        return 0.0

    dcg = calculate_dcg_at_k(expected_doc_ids, retrieved_doc_ids, k)

    ideal_relevant_count = min(len(set(expected_doc_ids)), k)
    ideal_ranking = expected_doc_ids[:ideal_relevant_count]
    idcg = calculate_dcg_at_k(expected_doc_ids, ideal_ranking, k)

    if idcg == 0:
        return 0.0

    return dcg / idcg
