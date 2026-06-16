import type { StrategyEvaluation } from "../types/evaluation";

export const DashboardHeader = ({ evalResults }: { evalResults: StrategyEvaluation[] }) => {
  const questionCount = evalResults[0].questions.length;
  const strategyCount = evalResults.length;

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
      </div>
    </header>
  );
};
