import { useMemo, useState } from "react";
import { formatMetric } from "../lib/formatMetric";
import { strategyLabels } from "../lib/strategyLabels";
import type { GroupedEvaluationSummary, StrategyEvaluation } from "../types/evaluation";

type DiagnosticMode = "bySlice" | "byCategory" | "byDifficulty";

type DiagnosticModeOption = {
  value: DiagnosticMode;
  label: string;
  description: string;
};

type GroupedSummariesByName = Partial<Record<string, GroupedEvaluationSummary>>;

type DiagnosticRow = {
  group: string;
  questionCount: number;
  bestStrategy: StrategyEvaluation["strategy"];
  hitAt1: number;
  recallAt5: number;
  mrr: number;
};

const diagnosticModeOptions: DiagnosticModeOption[] = [
  {
    value: "bySlice",
    label: "By slice",
    description:
      "Slices represent retrieval challenge types. A question can belong to multiple slices, so counts do not add up to the total.",
  },
  {
    value: "byCategory",
    label: "By category",
    description: "Categories represent the product or documentation area the question belongs to.",
  },
  {
    value: "byDifficulty",
    label: "By difficulty",
    description:
      "Difficulty groups show how retrieval quality changes across easy, medium and hard questions.",
  },
];

const isDiagnosticMode = (value: string): value is DiagnosticMode =>
  diagnosticModeOptions.some((option) => option.value === value);

const getGroupedSummaries = (
  result: StrategyEvaluation,
  mode: DiagnosticMode,
): GroupedSummariesByName => {
  switch (mode) {
    case "bySlice":
      return result.bySlice;
    case "byCategory":
      return result.byCategory;
    case "byDifficulty":
      return result.byDifficulty;
  }
};

const formatGroupLabel = (group: string) =>
  group
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const getDiagnosticRows = (
  evalResults: StrategyEvaluation[],
  mode: DiagnosticMode,
): DiagnosticRow[] => {
  const rowsByGroup = evalResults.reduce<Map<string, DiagnosticRow>>((rows, result) => {
    const groupedSummaries = getGroupedSummaries(result, mode);

    Object.entries(groupedSummaries).forEach(([group, groupedSummary]) => {
      if (!groupedSummary) {
        return;
      }

      const existingRow = rows.get(group);

      if (existingRow && existingRow.mrr >= groupedSummary.summary.mrr) {
        return;
      }

      rows.set(group, {
        group,
        questionCount: groupedSummary.questionCount,
        bestStrategy: result.strategy,
        hitAt1: groupedSummary.summary.meanHitAt1,
        recallAt5: groupedSummary.summary.meanRecallAt5,
        mrr: groupedSummary.summary.mrr,
      });
    });

    return rows;
  }, new Map());

  return [...rowsByGroup.values()].sort((a, b) => b.questionCount - a.questionCount);
};

export const DiagnosticBreakdown = ({ evalResults }: { evalResults: StrategyEvaluation[] }) => {
  const [selectedMode, setSelectedMode] = useState<DiagnosticMode>("bySlice");

  const rows = useMemo(
    () => getDiagnosticRows(evalResults, selectedMode),
    [evalResults, selectedMode],
  );

  const selectedModeOption =
    diagnosticModeOptions.find((option) => option.value === selectedMode) ??
    diagnosticModeOptions[0];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Diagnostic breakdown</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Inspect where retrieval strategies perform well or fail across different evaluation
              groups.
            </p>
          </div>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            View
            <select
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={selectedMode}
              onChange={(event) => {
                if (isDiagnosticMode(event.target.value)) {
                  setSelectedMode(event.target.value);
                }
              }}
            >
              {diagnosticModeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm text-slate-600">{selectedModeOption.description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Group</th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Best strategy</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Questions</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Hit@1</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">Recall@5</th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">MRR</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row) => {
              const bestStrategy = strategyLabels[row.bestStrategy];

              return (
                <tr key={row.group}>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {formatGroupLabel(row.group)}
                  </td>
                  <td className="px-5 py-4 text-slate-700">{bestStrategy.label}</td>
                  <td className="px-5 py-4 text-right font-mono text-slate-900">
                    {row.questionCount}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-slate-900">
                    {formatMetric(row.hitAt1)}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-slate-900">
                    {formatMetric(row.recallAt5)}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-slate-900">
                    {formatMetric(row.mrr)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
