import type { TestQuestion, FailureAnalysis } from "../lib/types";
import type { StrategyEvaluation } from "../types/evaluation";
import { QuestionFailureAnalysis } from "./QuestionFailureAnalysis";
import { QuestionStrategyResult } from "./QuestionStrategyResult";

const getQuestionsStrategyResultsById = (
  evalResults: StrategyEvaluation[],
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

const getFailureAnalysisByQuestionId = (failureAnalysisList: FailureAnalysis[]) =>
  new Map(failureAnalysisList.map((item) => [item.questionId, item]));

const formatLabel = (value: string) =>
  value
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

export const QuestionsResults = ({
  evalResults,
  testQuestions,
  failureAnalysisList,
}: {
  evalResults: StrategyEvaluation[];
  testQuestions: TestQuestion[];
  failureAnalysisList: FailureAnalysis[];
}) => {
  const resultsByQuestionId = getQuestionsStrategyResultsById(evalResults, testQuestions);
  const failureAnalysisByQuestionId = getFailureAnalysisByQuestionId(failureAnalysisList);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Question-level inspection
        </h2>
        <p className="mt-2 text-lg font-semibold text-slate-950">
          Inspect expected vs retrieved sources
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {resultsByQuestionId.map(
          ({ id, question, expectedDocIds, category, difficulty, strategies }) => {
            const failureAnalysis = failureAnalysisByQuestionId.get(id);
            return (
              <details key={id} className="group bg-white">
                <summary className="cursor-pointer list-none px-5 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-500">
                          {id}
                        </span>
                        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-100">
                          {formatLabel(category)}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                          {formatLabel(difficulty)}
                        </span>
                        {failureAnalysis && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
                            failure note
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-semibold leading-7 text-slate-900">{question}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium text-slate-500">Expected:</span>
                        {expectedDocIds.map((docId) => (
                          <span
                            key={docId}
                            className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700"
                          >
                            {docId}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors group-hover:border-indigo-200 group-hover:text-indigo-600 group-open:bg-slate-100">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="size-5 transition-transform group-open:rotate-180"
                      >
                        <path
                          fill="currentColor"
                          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                        />
                      </svg>
                    </div>
                  </div>
                </summary>

                <div className="px-5 pb-5">
                  <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
                    <QuestionFailureAnalysis failureAnalysis={failureAnalysis} />
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
                </div>
              </details>
            );
          },
        )}
      </div>
    </section>
  );
};
