import { StrategySummaryGrid } from "./components/StrategySummaryGrid";
import evalResults from "../data/eval-results.json";
import testQuestions from "../data/test-questions.json";
import failureAnalysis from "../data/failure-analysis.json";
import { QuestionsResults } from "./components/QuestionsResults";
import { DashboardHeader } from "./components/RetrievalDashboardHeader";

function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-800">
      <div className="mx-auto max-w-6xl space-y-8">
        <DashboardHeader evalResults={evalResults} />
        <StrategySummaryGrid evalResults={evalResults} />
        <QuestionsResults
          evalResults={evalResults}
          testQuestions={testQuestions}
          failureAnalysisList={failureAnalysis}
        />
      </div>
    </main>
  );
}

export default App;
