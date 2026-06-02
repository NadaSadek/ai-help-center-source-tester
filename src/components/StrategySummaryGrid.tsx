import type { EvalResult } from "../lib/types";

const metricLabels: Record<string, string> = {
  meanHitAt1: "Hit@1",
  meanHitAt3: "Hit@3",
  meanHitAt5: "Hit@5",
  meanRecallAt3: "Recall@3",
  meanRecallAt5: "Recall@5",
  mrr: "MRR",
};

const formatMetric = (value: number) => value.toFixed(3);

export const StrategySummaryGrid = ({ evalResults }: { evalResults: EvalResult[] }) => (
  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {evalResults.map(({ summary, strategy }) => (
      <article
        key={strategy}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Strategy</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">{strategy}</h2>
        </div>

        <dl className="space-y-3">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <dt className="text-sm font-medium text-slate-500">{metricLabels[key] ?? key}</dt>
              <dd className="font-mono text-sm font-medium text-slate-900">
                {formatMetric(value)}
              </dd>
            </div>
          ))}
        </dl>
      </article>
    ))}
  </section>
);
