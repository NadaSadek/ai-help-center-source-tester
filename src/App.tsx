import { StrategySummaryGrid } from "./components/StrategySummaryGrid";
import evalResults from "../data/eval-results.json";
import testQuestions from "../data/test-questions.json";
import failureAnalysis from "../data/failure-analysis.json"
import { QuestionsResults } from "./components/QuestionsResults";

function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Retrieval evaluation
          </p>
          <div className="mt-3 max-w-3xl space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">AI Help Center Source Tester</h1>
            <p className="text-lg leading-8 text-slate-600">
              Compare whether retrieval strategies find the expected help-center sources before
              answer generation.
            </p>
          </div>
        </header>

        <StrategySummaryGrid evalResults={evalResults} />
        <QuestionsResults evalResults={evalResults} testQuestions={testQuestions} failureAnalysisList={failureAnalysis} />
      </div>
    </main>
  );
}

export default App;
