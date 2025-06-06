import { useEffect, useState } from 'react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import ContributionHeatmap from '../components/Tabs/ContributionHeatmap';
import PRTimeline from '../components/Tabs/PRTimeline';
import IssueVelocityChart from '../components/Tabs/IssueVelocityChart';

const tabs = ['Commits', 'Activity Chart', '5-Year Activity', 'Contribution Heatmap', 'PR Timeline', 'Issue Velocity'];

type ViewType = (typeof tabs)[number];

export default function GitHubRealtime() {
  const [view, setView] = useState<ViewType>('Commits');
  const [commits, setCommits] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem('githubUser');
  const token = localStorage.getItem('githubToken');
  const user = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };

  const fetchMostRecentRepo = async () => {
    const res = await fetch('https://api.github.com/user/repos?per_page=100', { headers });
    const repos = await res.json();
    return repos.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
  };

  const fetchCommits = async (repoFullName: string) => {
    const res = await fetch(`https://api.github.com/repos/${repoFullName}/commits?per_page=5`, { headers });
    return await res.json();
  };

  const fetchCommitActivity = async (repoFullName: string) => {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits?since=${since.toISOString()}`,
      { headers }
    );
    const commits = await res.json();

    const counts = new Array(7).fill(0);
    commits.forEach((c: any) => {
      const date = new Date(c.commit.author.date);
      const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo < 7) {
        counts[6 - daysAgo]++;
      }
    });

    const chart = counts.map((count, i) => ({
      day: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
      commits: count,
    }));

    return chart;
  };

  const fetch5YearActivity = async (repoFullName: string) => {
    const now = new Date();
    const yearChunks: any[] = [];

    for (let i = 0; i < 5; i++) {
      const end = new Date(now.getFullYear() - i, 11, 31).toISOString();
      const start = new Date(now.getFullYear() - i, 0, 1).toISOString();

      const res = await fetch(
        `https://api.github.com/repos/${repoFullName}/commits?since=${start}&until=${end}&per_page=100`,
        { headers }
      );
      const commits = await res.json();
      yearChunks.push(...commits);
    }

    const monthlyCounts: { [key: string]: number } = {};

    yearChunks.forEach((commit: any) => {
      const date = new Date(commit.commit.author.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
    });

    const sortedKeys = Object.keys(monthlyCounts).sort();

    return sortedKeys.map((month) => ({
      month,
      commits: monthlyCounts[month],
    }));
  };

  const loadData = async () => {
    if (!user || !token) return;
    setLoading(true);

    try {
      const repo = await fetchMostRecentRepo();
      if (!repo) return;

      if (view === 'Commits') {
        const recentCommits = await fetchCommits(repo.full_name);
        setCommits(recentCommits);
      } else if (view === 'Activity Chart') {
        const chart = await fetchCommitActivity(repo.full_name);
        setChartData(chart);
      } else if (view === '5-Year Activity') {
        const history = await fetch5YearActivity(repo.full_name);
        setChartData(history);
      }
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [view]);

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-10 bg-white">
        <p className="text-lg text-red-600 font-semibold mb-4">You must be logged in to view this page.</p>
        <a href="/integrations" className="text-indigo-600 hover:underline font-medium">
          Go to Integrations →
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-indigo-50 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">Realtime GitHub Monitoring</h1>

        <div className="flex gap-4 mb-8">
          <a href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium">
            Back to Dashboard
          </a>
          <a href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition text-sm font-medium">
            Back to Landing Page
          </a>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                view === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading {view}...</p>
        ) : view === 'Commits' ? (
          <div className="grid gap-6">
            {commits.map((item) => (
              <div key={item.sha} className="bg-white p-4 rounded-xl shadow border border-indigo-100">
                <p className="font-semibold text-indigo-700">{item.commit.message}</p>
                <p className="text-sm text-gray-600">
                  by <strong>{item.commit.author.name}</strong> on {new Date(item.commit.author.date).toLocaleString()}
                </p>
                <a
                  href={item.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 text-sm hover:underline mt-2 inline-block"
                >
                  View on GitHub →
                </a>
              </div>
            ))}
          </div>
        ) : view === 'Activity Chart' ? (
          <div className="bg-white p-6 rounded-xl shadow border border-indigo-100">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Commit Activity (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="commits" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : view === '5-Year Activity' ? (
          <div className="bg-white p-6 rounded-xl shadow border border-indigo-100">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Commit Activity (Last 5 Years)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="commits" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : view === 'Contribution Heatmap' ? (
          <ContributionHeatmap />
        ) : view === 'PR Timeline' ? (
          <PRTimeline />
        ) : view === 'Issue Velocity' ? (
          <IssueVelocityChart />
        ) : null}
      </div>
    </main>
  );
}
