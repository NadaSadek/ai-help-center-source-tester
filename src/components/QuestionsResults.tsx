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
    <section className="space-y-5">
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-800">
        Retrieval results by question
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        Expand a question to compare which source documents each strategy retrieved and where
        rankings and source coverage differ
      </p>

      <div className="space-y-4">
        {resultsByQuestionId.map(({ id, question, expectedDocIds, category, strategies }) => {
          const failureAnalysis = failureAnalysisByQuestionId.get(id);
          return (
            <details
              key={id}
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <summary className="cursor-pointer list-none p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-500">
                        {id}
                      </span>
                      <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-900">
                        {category}
                      </span>
                      {failureAnalysis && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                          failure note
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold leading-7 text-slate-800">{question}</h3>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
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

              <div className="border-t border-slate-200 px-5 pt-5 mt-5 mb-5">
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
            </details>
          );
        })}
      </div>
    </section>
  );
};
