import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw, Brain, Share2 } from 'lucide-react'; // Lucide icons
import GitHubStackSummary from './Dashboard/GitHubStackSummary';

export default function Dashboard() {
  const navigate = useNavigate();
  const userData = localStorage.getItem('githubUser');
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (!user) {
      navigate('/integrations');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('githubUser');
    localStorage.removeItem('githubToken');
    navigate('/integrations');
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-indigo-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700">
          StackScope Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </header>

      {/* Back to Landing */}
      <div className="max-w-6xl mx-auto mb-10">
        <button
          onClick={() => navigate('/')}
          className="text-sm font-medium px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          ← Back to Landing Page
        </button>
      </div>

      {/* Feature Cards */}
      <section className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* GitHub Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-semibold text-indigo-600 mb-2">GitHub Integration</h4>
            {user ? (
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={user.avatar_url}
                  alt="GitHub Avatar"
                  className="w-10 h-10 rounded-full shadow"
                />
                <div className="text-sm">
                  <p className="text-gray-800">
                    Connected as <span className="font-semibold">{user.login}</span>
                  </p>
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline"
                  >
                    View GitHub Profile
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm mb-4">Not connected.</p>
            )}
            <p className="text-gray-600 text-sm mb-4">
              Monitor your repositories, pull requests, and CI/CD workflows.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={() => navigate('/github/realtime')}
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} /> Realtime Stack Monitoring
            </button>
            <button
              onClick={() => navigate('/ai-insight')}
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center justify-center gap-2"
            >
              <Brain size={18} /> AI Insight
            </button>
          </div>
        </div>

        {/* AI Dev Summary Card */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-semibold text-purple-600 mb-2">AI Dev Summary (Overall)</h4>
            <p className="text-gray-600 text-sm mb-4">
              Get an AI-generated summary of your productivity, code tone, and trends over time.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={() => navigate('/ai-summary')}
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center justify-center gap-2"
            >
              <Brain size={18} /> View AI Summary
            </button>
            <button
              disabled
              className="w-full py-2 bg-gray-300 text-gray-700 rounded-md cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Share2 size={18} /> Share to Slack (Coming Soon)
            </button>
          </div>
        </div>
      </section>

      {/* GitHub Summary Chart */}
      <GitHubStackSummary />
    </main>
  );
}