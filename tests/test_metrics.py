from retrieval.metrics import (
    calculate_hit_at_k,
    calculate_ndcg_at_k,
    calculate_precision_at_k,
    calculate_recall_at_k,
    calculate_reciprocal_rank,
)


def test_hit_at_k_returns_true_when_expected_doc_is_in_top_k() -> None:
    assert calculate_hit_at_k(
        expected_doc_ids=["billing-access"],
        retrieved_doc_ids=["refund-policy", "billing-access", "workspace-access"],
        k=2,
    )


def test_hit_at_k_returns_false_when_expected_doc_is_outside_top_k() -> None:
    assert not calculate_hit_at_k(
        expected_doc_ids=["billing-access"],
        retrieved_doc_ids=["refund-policy", "workspace-access", "billing-access"],
        k=2,
    )


def test_recall_at_k_counts_expected_sources_found_in_top_k() -> None:
    assert (
        calculate_recall_at_k(
            expected_doc_ids=["failed-payment", "workspace-access", "entitlement-sync"],
            retrieved_doc_ids=["failed-payment", "refund-policy", "workspace-access"],
            k=3,
        )
        == 2 / 3
    )


def test_precision_at_k_counts_relevant_results_inside_top_k() -> None:
    assert (
        calculate_precision_at_k(
            expected_doc_ids=["failed-payment", "workspace-access"],
            retrieved_doc_ids=["failed-payment", "refund-policy", "workspace-access"],
            k=3,
        )
        == 2 / 3
    )


def test_reciprocal_rank_uses_first_correct_result_rank() -> None:
    assert (
        calculate_reciprocal_rank(
            expected_doc_ids=["workspace-access"],
            retrieved_doc_ids=["refund-policy", "workspace-access", "failed-payment"],
        )
        == 1 / 2
    )


def test_reciprocal_rank_returns_zero_when_no_expected_doc_is_found() -> None:
    assert (
        calculate_reciprocal_rank(
            expected_doc_ids=["workspace-access"],
            retrieved_doc_ids=["refund-policy", "failed-payment"],
        )
        == 0.0
    )


def test_ndcg_at_k_rewards_correct_sources_ranked_earlier() -> None:
    better_ranking = calculate_ndcg_at_k(
        expected_doc_ids=["doc-a", "doc-b"],
        retrieved_doc_ids=["doc-a", "doc-b", "doc-c"],
        k=3,
    )

    worse_ranking = calculate_ndcg_at_k(
        expected_doc_ids=["doc-a", "doc-b"],
        retrieved_doc_ids=["doc-c", "doc-a", "doc-b"],
        k=3,
    )

    assert better_ranking > worse_ranking
