# Dataset notes

This project uses a synthetic help-center dataset for a fictional SaaS product. The dataset is designed to test retrieval quality before answer generation.

The evaluation set contains synthetic help-center documents, test questions, expected source document IDs and grouped metadata such as category, difficulty and retrieval challenge slices.
## Why the dataset is synthetic

The goal is to create a controlled evaluation fixture where expected source documents are known in advance. This makes it possible to compare retrieval strategies consistently and inspect where each strategy performs well or fails.

No real customer messages, private company data or production support conversations are used.

## Question design

The test questions are designed to cover realistic help-center and support-assistant retrieval cases, including:

* exact keyword matches
* semantic paraphrases
* multi-intent questions
* billing and access overlap
* permission-boundary cases
* plan-limit questions
* export-permission questions
* vague wording
* unsupported or negative cases where no confident source should be returned

A question can belong to more than one slice. For example, a question can be both a semantic paraphrase and a billing/access overlap case.

## Positive and unsupported cases

Positive retrieval questions have expected source documents and are used for ranking metrics such as Hit@1, Recall@5 and MRR.

Unsupported or negative cases are included to represent questions where the help center doesn't contain a confident answer. These cases are tracked separately because standard ranking metrics are not the right way to score abstention behavior.


## Evaluation intent

The evaluation goal is to catch retrieval failures before an answer is generated and specifically understand which retrieval strategy performs best for a set of questions grouped by slice, category and difficulty.
