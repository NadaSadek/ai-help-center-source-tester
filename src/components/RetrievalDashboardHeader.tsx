import type { StrategyEvaluation } from "../types/evaluation";

export const DashboardHeader = ({ evalResults }: { evalResults: StrategyEvaluation[] }) => {
  const firstResult = evalResults[0];

  if (!firstResult) {
    return null;
  }

  const questionCount = firstResult.questionCount;
  const positiveQuestionCount = firstResult.positiveQuestionCount;
  const negativeQuestionCount = firstResult.negativeQuestionCount;
  const strategyCount = evalResults.length;

  return (
    <header className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Retrieval evaluation
          </p>

          <h1 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950">
            AI Help Center Source Tester
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Compare whether retrieval strategies find the expected help-center sources before answer
            generation.
          </p>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-4 lg:min-w-130">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Questions
            </dt>
            <dd className="mt-1 font-mono text-lg font-semibold text-slate-950">{questionCount}</dd>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Positive</dt>
            <dd className="mt-1 font-mono text-lg font-semibold text-slate-950">
              {positiveQuestionCount}
            </dd>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Unsupported
            </dt>
            <dd className="mt-1 font-mono text-lg font-semibold text-slate-950">
              {negativeQuestionCount}
            </dd>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Strategies
            </dt>
            <dd className="mt-1 font-mono text-lg font-semibold text-slate-950">{strategyCount}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
};
