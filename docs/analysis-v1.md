# V1 Analysis

*Note:* This is an old analysis before adding more questions and strategies

## Retrieval strategies

The project currently compares four retrieval strategies:

| Strategy                 | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| `tfidf`                  | Keyword-based retrieval using TF-IDF and cosine similarity               |
| `embedding-minilm`       | Local semantic retrieval using `sentence-transformers/all-MiniLM-L6-v2`  |
| `embedding-mpnet`        | Local semantic retrieval using `sentence-transformers/all-mpnet-base-v2` |
| `hybrid-tfidf50-mpnet50` | 50/50 weighted hybrid of normalized TF-IDF and MPNet scores              |

## Evaluation metrics

Each strategy is evaluated using ranking metrics:

| Metric     | Meaning                                                   |
| ---------- | --------------------------------------------------------- |
| `Hit@1`    | Whether at least one expected source appears at rank 1    |
| `Hit@3`    | Whether at least one expected source appears in the top 3 |
| `Hit@5`    | Whether at least one expected source appears in the top 5 |
| `Recall@3` | How many expected source docs appear in the top 3         |
| `Recall@5` | How many expected source docs appear in the top 5         |
| `MRR`      | Mean reciprocal rank of the first correct source          |

- Hit metrics show whether retrieval found at least one useful source
- Recall metrics show whether retrieval covered all expected sources

## Current results

Current evaluation over 16 test questions:

| Strategy                 | Mean Hit@1 | Mean Hit@3 | Mean Hit@5 | Mean Recall@3 | Mean Recall@5 |   MRR |
| ------------------------ | ---------: | ---------: | ---------: | ------------: | ------------: | ----: |
| `tfidf`                  |      0.875 |      1.000 |      1.000 |         0.781 |         0.927 | 0.927 |
| `embedding-minilm`       |      0.813 |      1.000 |      1.000 |         0.875 |         0.948 | 0.896 |
| `embedding-mpnet`        |      1.000 |      1.000 |      1.000 |         0.917 |         0.948 | 1.000 |
| `hybrid-tfidf50-mpnet50` |      0.938 |      1.000 |      1.000 |         0.844 |         1.000 | 0.958 |


## Main findings

## 1. TF-IDF is weak on multi-intent questions

TF-IDF performs well when the question contains exact terms, such as invoice, payment, refund or export.

It struggles when the user question mixes multiple intents such as:

> The invoice says paid but my team still can't access the workspace.

This combines invoice/payment wording with workspace access and entitlement sync intent. TF-IDF over-ranks literal matches like invoice and team before the deeper access-related sources.

## 2. MiniLM improves some semantic cases but is not consistently better

`all-MiniLM-L6-v2` improves semantic coverage in some cases but it can also over-rank semantically related but incomplete documents.

For example, when a question mentions an old billing admin leaving the company, MiniLM over-ranks workspace/admin role content before the billing permissions source.

## 3. MPNet is the strongest current retrieval baseline

`all-mpnet-base-v2` performs best overall on this dataset. It improves top-ranked source quality and semantic source coverage compared with both TF-IDF and MiniLM.

However, it still misses some supporting sources in multi-source questions which is why Recall@k remains important.

## 4. 50/50 hybrid retrieval impacts early ranking

The 50/50 TF-IDF + MPNet hybrid improves full top-5 coverage but it hurts early ranking compared with pure MPNet.

In this dataset, the 50/50 hybrid is not better overall. The lexical signal can pull the ranking back toward misleading exact terms even when MPNet alone ranks the more relevant source earlier.
