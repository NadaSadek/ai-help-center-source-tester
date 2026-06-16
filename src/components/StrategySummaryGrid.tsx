import { formatMetric } from "../lib/formatMetric";
import type { EvalResult } from "../lib/types";

const strategyLabels: Record<
  EvalResult["strategy"],
  {
    label: string;
    description: string;
  }
> = {
  bm25: {
    label: "BM25",
    description: "Lexical baseline with term-frequency ranking",
  },
  tfidf: {
    label: "TF-IDF",
    description: "Keyword baseline",
  },
  "embedding-minilm": {
    label: "MiniLM embedding",
    description: "Lightweight semantic retrieval",
  },
  "embedding-mpnet": {
    label: "MPNet embedding",
    description: "Stronger semantic retrieval",
  },
  "hybrid-tfidf50-mpnet50": {
    label: "Hybrid TF-IDF + MPNet",
    description: "Keyword and semantic retrieval combined",
  },
};

export const StrategySummaryGrid = ({ evalResults }: { evalResults: EvalResult[] }) => {
  const sortedResults = [...evalResults].sort((a, b) => b.summary.mrr - a.summary.mrr);
  const bestResult = sortedResults[0];

  if (!bestResult) {
    return null;
  }

  const bestStrategy = strategyLabels[bestResult.strategy];

  return (
    <section className="space-y-4">
      <article className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Best overall strategy
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{bestStrategy.label}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {bestStrategy.description}. Ranked by MRR across positive retrieval questions.
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-3 text-right">
            <div>
              <dt className="text-xs font-medium text-slate-500">Hit@1</dt>
              <dd className="mt-1 font-mono text-lg font-semibold text-slate-950">
                {formatMetric(bestResult.summary.meanHitAt1)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Recall@5</dt>
              <dd className="mt-1 font-mono text-lg font-semibold text-slate-950">
                {formatMetric(bestResult.summary.meanRecallAt5)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">MRR</dt>
              <dd className="mt-1 font-mono text-lg font-semibold text-slate-950">
                {formatMetric(bestResult.summary.mrr)}
              </dd>
            </div>
          </dl>
        </div>
      </article>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Strategy comparison</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Strategy</th>
                <th className="px-5 py-3 text-right font-semibold text-slate-600">Hit@1</th>
                <th className="px-5 py-3 text-right font-semibold text-slate-600">Recall@5</th>
                <th className="px-5 py-3 text-right font-semibold text-slate-600">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sortedResults.map(({ strategy, summary }) => {
                const strategyLabel = strategyLabels[strategy];

                return (
                  <tr key={strategy}>
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{strategyLabel.label}</div>
                      <div className="mt-1 text-xs text-slate-500">{strategyLabel.description}</div>
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-medium text-slate-900">
                      {formatMetric(summary.meanHitAt1)}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-medium text-slate-900">
                      {formatMetric(summary.meanRecallAt5)}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-medium text-slate-900">
                      {formatMetric(summary.mrr)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};
