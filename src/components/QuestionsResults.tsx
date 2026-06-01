import type { EvalResult, TestQuestion } from "../lib/types";
import { QuestionStrategyResult } from "./QuestionStrategyResult";

const getQuestionsStrategyResultsById = (
  evalResults: EvalResult[],
  testQuestions: TestQuestion[],
) => {
  return testQuestions.map(({ id, question, expectedDocIds, category, difficulty }) => ({
    id,
    question,
    expectedDocIds,
    category,
    difficulty,
    strategies: evalResults.map((strategyResult) => ({
      strategy: strategyResult.strategy,
      result: strategyResult.questions.find((result) => result.questionId === id),
    })),
  }));
};

export const QuestionsResults = ({
  evalResults,
  testQuestions,
}: {
  evalResults: EvalResult[];
  testQuestions: TestQuestion[];
}) => {
  const resultsByQuestionId = getQuestionsStrategyResultsById(evalResults, testQuestions);

  return (
    <section className="space-y-5">
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
        Retrieval Results Per Question
      </h2>

      <div className="space-y-4">
        {resultsByQuestionId.map(
          ({ id, question, expectedDocIds, category, strategies }) => (
            <details
              key={id}
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <summary className="cursor-pointer list-none p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-600">
                        {id}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        {category}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold leading-7 text-slate-950">{question}</h3>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-slate-500">Expected sources:</span>
                      {expectedDocIds.map((docId) => (
                        <span
                          key={docId}
                          className="rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-xs font-medium text-emerald-700"
                        >
                          {docId}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors group-open:bg-slate-50">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="size-5 transition-transform group-open:rotate-270"
                    >
                      <path
                        fill="currentColor"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                      />
                    </svg>
                  </div>
                </div>
              </summary>

              <div className="border-t border-slate-200 p-5">
                <div className="grid gap-4 lg:grid-cols-2">
                  {strategies.map(({ strategy, result }) => {
                    if (!result) {
                      return null;
                    }

                    return (
                      <QuestionStrategyResult
                        key={`${id}-${strategy}`}
                        strategy={strategy}
                        result={result}
                        expectedDocIds={expectedDocIds}
                      />
                    );
                  })}
                </div>
              </div>
            </details>
          ),
        )}
      </div>
    </section>
  );
};
