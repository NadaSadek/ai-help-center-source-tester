import { formatMetric } from "../lib/formatMetric";
import type { EvalResult } from "../lib/types";

type QuestionResult = EvalResult["questions"][number];
const ResultBadge = ({ isCorrect }: { isCorrect: boolean }) => (
  <span
    className={
      isCorrect
        ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
        : "rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700"
    }
  >
    {isCorrect ? "expected" : "not expected"}
  </span>
);

export const QuestionStrategyResult = ({
  strategy,
  result,
  expectedDocIds,
}: {
  strategy: string;
  result: QuestionResult;
  expectedDocIds: string[];
}) => {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{strategy}</h3>
        <span className="font-mono text-xs text-slate-500">
          First match RR {formatMetric(result.metrics.reciprocalRank)}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg bg-white px-3 py-2">
          <p className="text-slate-500">Hit@1</p>
          <p className="font-medium text-slate-900">{String(result.metrics.hitAt1)}</p>
        </div>
        <div className="rounded-lg bg-white px-3 py-2">
          <p className="text-slate-500">Recall@3</p>
          <p className="font-medium text-slate-900">{formatMetric(result.metrics.recallAt3)}</p>
        </div>
        <div className="rounded-lg bg-white px-3 py-2">
          <p className="text-slate-500">Recall@5</p>
          <p className="font-medium text-slate-900">{formatMetric(result.metrics.recallAt5)}</p>
        </div>
      </div>

      <ol className="space-y-2">
        {result.retrievedDocIds.map((docId, index) => (
          <li
            key={`${strategy}-${docId}-${index}`}
            className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm"
          >
            <span className="min-w-0 truncate">
              <span className="mr-2 font-mono text-xs text-slate-400">#{index + 1}</span>
              {docId}
            </span>
            <ResultBadge isCorrect={expectedDocIds.includes(docId)} />
          </li>
        ))}
      </ol>
    </article>
  );
};
