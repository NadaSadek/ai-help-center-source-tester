import { StrategySummaryGrid } from "./components/StrategySummaryGrid";
import { evalResults, failureAnalysisList, testQuestions } from "./generated/evaluation-data";
import { QuestionsResults } from "./components/QuestionsResults";
import { DashboardHeader } from "./components/RetrievalDashboardHeader";
import { DiagnosticBreakdown } from "./components/DiagnosticBreakdown";

function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-800">
      <div className="mx-auto max-w-6xl space-y-8">
        <DashboardHeader evalResults={evalResults} />
        <StrategySummaryGrid evalResults={evalResults} />
        <DiagnosticBreakdown evalResults={evalResults} />
        <QuestionsResults
          evalResults={evalResults}
          testQuestions={testQuestions}
          failureAnalysisList={failureAnalysisList}
        />
      </div>
    </main>
  );
}

export default App;
