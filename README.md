# AI Help Center Source Tester

A retrieval evaluation project for testing whether a help-center assistant finds the right source documents before generating an answer.

The goal is to test source retrieval quality across a controlled fake SaaS help center and compare different retrieval strategies using measurable ranking metrics.

Live demo: https://support-rag-source-eval.netlify.app/

## What this project tests

This project tests the retrieval step when we have the following:

- fake help-center documentation
- realistic customer/support questions
- expected source documents for each question

It compares whether different retrieval strategies return the expected source documents at high ranks.

## Fake product context

The dataset uses a fake SaaS product called **ExampleOps**. The help-center docs are AI-generated and manually structured for retrieval evaluation.

The current help-center docs cover:

- billing and invoices
- cancellation and refund behavior
- failed payments
- workspace access
- entitlement sync
- plan limits and upgrades
- dashboard exports
- export and billing permissions

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

### 1. TF-IDF is weak on multi-intent questions

TF-IDF performs well when the question contains exact terms, such as invoice, payment, refund or export.

It struggles when the user question mixes multiple intents such as:

> The invoice says paid but my team still can't access the workspace.

This combines invoice/payment wording with workspace access and entitlement sync intent. TF-IDF over-ranks literal matches like invoice and team before the deeper access-related sources.

### 2. MiniLM improves some semantic cases but is not consistently better

`all-MiniLM-L6-v2` improves semantic coverage in some cases but it can also over-rank semantically related but incomplete documents.

For example, when a question mentions an old billing admin leaving the company, MiniLM over-ranks workspace/admin role content before the billing permissions source.

### 3. MPNet is the strongest current retrieval baseline

`all-mpnet-base-v2` performs best overall on this dataset. It improves top-ranked source quality and semantic source coverage compared with both TF-IDF and MiniLM.

However, it still misses some supporting sources in multi-source questions which is why Recall@k remains important.

### 4. 50/50 hybrid retrieval impacts early ranking

The 50/50 TF-IDF + MPNet hybrid improves full top-5 coverage but it hurts early ranking compared with pure MPNet.

In this dataset, the 50/50 hybrid is not better overall. The lexical signal can pull the ranking back toward misleading exact terms even when MPNet alone ranks the more relevant source earlier.

## Project structure

```txt
data/
  docs/
    billing/
    workspace/
    plans/
    exports/
  test-questions.json
  chunks.json
  keyword-results.json
  embedding-results-minilm.json
  embedding-results-mpnet.json
  hybrid-results-tfidf50-mpnet50.json
  eval-results.json
  failure-analysis.json

scripts/
  chunk_docs.py
  run_keyword_retrieval.py
  run_embedding_retrieval.py
  run_hybrid_retrieval.py
  evaluate_retrieval.py
```

## Source files

Inputs:

| File                       | Purpose                                       |
| -------------------------- | --------------------------------------------- |
| `data/docs/`               | Fake help-center documentation                |
| `data/test-questions.json` | Test questions with expected source documents |

Script-generated outputs:

| File                                       | Purpose                                  |
| ------------------------------------------ | ---------------------------------------- |
| `data/chunks.json`                         | Chunks generated from help-center docs   |
| `data/keyword-results.json`                | TF-IDF retrieval output                  |
| `data/embedding-results-minilm.json`       | MiniLM embedding retrieval output        |
| `data/embedding-results-mpnet.json`        | MPNet embedding retrieval output         |
| `data/hybrid-results-tfidf50-mpnet50.json` | 50/50 hybrid retrieval output            |
| `data/eval-results.json`                   | Evaluation results across all strategies |

I put the analysis of retrieval failure cases in [data/failure-analysis.json](data/failure-analysis.json)

## Running the project

Install dependencies:

```bash
uv sync
```

Generate chunks:

```bash
uv run python scripts/chunk_docs.py
```

Run retrieval strategies:

```bash
uv run python scripts/run_keyword_retrieval.py
uv run python scripts/run_embedding_retrieval.py
uv run python scripts/run_hybrid_retrieval.py
```

Evaluate retrieval quality:

```bash
uv run python scripts/evaluate_retrieval.py
```

Run formatting and linting:

```bash
uv run ruff check .
uv run ruff format .
```

## Running the dashboard

Install frontend dependencies:

```bash
npm install

Run the local dev server:

npm run dev
```

Create a production build:

```bash
npm run build
```

Run frontend checks:

```bash
npm run lint
npm run format:check
```

Preview:

```bash
npm run preview
```
