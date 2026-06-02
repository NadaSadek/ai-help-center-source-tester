import { formatMetric } from "../lib/formatMetric";
import type { EvalResult } from "../lib/types";

const strategyDisplayNames: Record<string, string> = {
  tfidf: "TF-IDF",
  "embedding-minilm": "MiniLM",
  "embedding-mpnet": "MPNet",
  "hybrid-tfidf50-mpnet50": "Hybrid 50/50",
};

export const DashboardHeader = ({ evalResults }: { evalResults: EvalResult[] }) => {
  const questionCount = evalResults[0].questions.length;
  const strategyCount = evalResults.length;

  const bestMrrStrategy = evalResults.reduce((best, current) =>
    current.summary.mrr > best.summary.mrr ? current : best,
  );

  const bestRecallAt5Strategy = evalResults.reduce((best, current) =>
    current.summary.meanRecallAt5 > best.summary.meanRecallAt5 ? current : best,
  );

  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Retrieval evaluation
          </p>

          <h1 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950">
            AI Help Center Source Tester
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Compare whether retrieval strategies find the expected help-center sources before answer
            generation.
          </p>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">Questions</dt>
              <dd className="mt-1text-slate-900">{questionCount}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Strategies</dt>
              <dd className="mt-1 text-slate-900">{strategyCount}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Dataset</dt>
              <dd className="mt-1 text-slate-900">Fake SaaS help center</dd>
            </div>
          </dl>
        </div>

        <aside className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Current finding
          </p>

          <p className="mt-3 text-base font-medium leading-7 text-slate-800">
            MPNet is the strongest early-rank baseline while the 50/50 hybrid improves top-5
            coverage but weakens early ranking.
          </p>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-white px-3 py-2">
              <p className="text-slate-500">Best MRR</p>
              <div className="mt-2 flex items-baseline justify-between gap-3">
                <span className="text-slate-800">
                  {strategyDisplayNames[bestMrrStrategy.strategy] ?? bestMrrStrategy.strategy}
                </span>
                <span className="font-mono text-sm text-slate-800">
                  {formatMetric(bestMrrStrategy.summary.mrr)}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-white px-3 py-2">
              <p className="text-slate-500">Best Recall@5</p>
              <div className="mt-2 flex items-baseline justify-between gap-3">
                <span className="text-slate-800">
                  {strategyDisplayNames[bestRecallAt5Strategy.strategy] ??
                    bestRecallAt5Strategy.strategy}
                </span>
                <span className="font-mono text-sm text-slate-800">
                  {formatMetric(bestRecallAt5Strategy.summary.meanRecallAt5)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
};
