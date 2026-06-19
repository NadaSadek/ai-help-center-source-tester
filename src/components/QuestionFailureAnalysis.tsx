import type { FailureAnalysis } from "../lib/types";

export const QuestionFailureAnalysis = ({
  failureAnalysis,
}: {
  failureAnalysis?: FailureAnalysis;
}) => {
  if (!failureAnalysis) {
    return;
  }
  return (
    <section className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
        Failure Analysis note
      </p>
      <p className="mt-2 font-medium text-slate-800">
        Retrieval pattern: {failureAnalysis.failureType.replaceAll("_", " ")}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        {failureAnalysis.failureNote} {failureAnalysis.retrievalNote}
      </p>
    </section>
  );
};
