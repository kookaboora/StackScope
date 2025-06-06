import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, BrainCog, GaugeCircle } from 'lucide-react';
import AnomalyChart from '../components/AIInsight/AnomalyChart';
import CodeReviewIntelligence from '../components/AIInsight/CodeReviewIntelligence';
import DevProductivityScore from '../components/AIInsight/DevProductivityScore';

export default function GitHubAIInsight() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeInsight, setActiveInsight] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('githubUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/integrations');
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-indigo-50 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">
          GitHub AI Insights
        </h1>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition text-sm font-medium"
          >
            Back to Landing Page
          </button>
        </div>

        {/* Insight Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {/* Anomaly Detection */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-indigo-600" size={20} />
              <h3 className="text-lg font-bold text-indigo-700">Anomaly Detection</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Automatically detect unusual spikes or drops in commit activity to catch anomalies in development flow.
            </p>
            <button
              onClick={() => setActiveInsight('anomaly')}
              className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              View Insight
            </button>
          </div>

          {/* Code Review Intelligence */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <BrainCog className="text-indigo-600" size={20} />
              <h3 className="text-lg font-bold text-indigo-700">Code Review Intelligence</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Use AI to summarize PRs, identify potential issues, and recommend improvements to streamline code reviews.
            </p>
            <button
              onClick={() => setActiveInsight('codeReview')}
              className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              View Insight
            </button>
          </div>

          {/* Dev Productivity Score */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <GaugeCircle className="text-indigo-600" size={20} />
              <h3 className="text-lg font-bold text-indigo-700">Dev Productivity Score</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Track developer performance using commit patterns, PR metrics, and activity trends to generate productivity scores.
            </p>
            <button
              onClick={() => setActiveInsight('productivity')}
              className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              View Insight
            </button>
          </div>
        </div>

        {/* Dynamic Insight Rendering */}
        <div className="mt-10">
          {activeInsight === 'anomaly' && <AnomalyChart />}
          {activeInsight === 'codeReview' && <CodeReviewIntelligence />}
          {activeInsight === 'productivity' && <DevProductivityScore />}
        </div>
      </div>
    </main>
  );
}
