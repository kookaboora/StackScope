import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const openaiKey = localStorage.getItem('openaiKey');
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

interface DevMetrics {
  year: string;
  commits: number;
  prsMerged: number;
  issuesClosed: number;
  productivityScore: number;
  sentimentScore: number;
  summary: string;
}

export default function AIDevSummary() {
  const [data, setData] = useState<DevMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('githubToken');
  const userData = localStorage.getItem('githubUser');
  const user = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };

  const openaiHeaders = {
   Authorization: `Bearer ${openaiKey}`,
    'Content-Type': 'application/json',
  };

  const fetchData = async () => {
    if (!user || !token) return;
    const res = await fetch(`https://api.github.com/user/repos?per_page=100&sort=updated`, { headers });
    const repos = await res.json();
    const repo = repos.find((r: any) => !r.fork);
    if (!repo) return;

    const owner = repo.owner.login;
    const repoName = repo.name;
    const currentYear = new Date().getFullYear();
    const allMetrics: DevMetrics[] = [];

    for (let y = currentYear - 4; y <= currentYear; y++) {
      const start = new Date(`${y}-01-01`).toISOString();
      const end = new Date(`${y}-12-31`).toISOString();

      const commitRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/commits?since=${start}&until=${end}&per_page=100`,
        { headers }
      );
      const commits = await commitRes.json();
      const messages = commits.map((c: any) => c.commit.message).slice(0, 10);

      const prRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/pulls?state=closed&per_page=100`,
        { headers }
      );
      const prs = await prRes.json();
      const mergedPRs = prs.filter(
        (p: any) => p.merged_at && new Date(p.merged_at) >= new Date(start) && new Date(p.merged_at) <= new Date(end)
      );

      const issueRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/issues?state=closed&since=${start}&per_page=100`,
        { headers }
      );
      const issues = await issueRes.json();
      const filteredIssues = issues.filter(
        (i: any) => !i.pull_request && new Date(i.closed_at) <= new Date(end)
      );

      const productivityScore = Math.round(
        (commits.length * 0.4 + mergedPRs.length * 0.35 + filteredIssues.length * 0.25) * 10
      );

      let sentimentScore = 0;
      let summary = '';

      try {
        const openaiRes = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content:
                  'You are an AI developer analyst. Given these commit messages, rate the tone from -1 (negative) to +1 (positive), and summarize the developer\'s productivity in one short paragraph.',
              },
              { role: 'user', content: messages.join('\n') },
            ],
          },
          { headers: openaiHeaders }
        );

        const response = openaiRes.data.choices[0].message.content;
        const match = response.match(/-?\d+(\.\d+)?/);
        sentimentScore = parseFloat(match?.[0] || '0');
        summary = response.replace(match?.[0] || '', '').trim();
      } catch (err) {
        console.warn(`OpenAI failed for year ${y}`, err);
      }

      allMetrics.push({
        year: y.toString(),
        commits: commits.length,
        prsMerged: mergedPRs.length,
        issuesClosed: filteredIssues.length,
        productivityScore,
        sentimentScore,
        summary,
      });
    }

    setData(allMetrics);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-indigo-700">
            AI Developer Summary (Last 5 Years)
          </h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
          {loading ? (
            <p className="text-gray-500">Loading insights...</p>
          ) : data.length === 0 ? (
            <p className="text-red-500">No data available.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="productivityScore" stroke="#3b82f6" strokeWidth={3} />
                  <Line type="monotone" dataKey="sentimentScore" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="commits" fill="#6366f1" />
                    <Bar dataKey="prsMerged" fill="#10b981" />
                    <Bar dataKey="issuesClosed" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-indigo-600">AI Generated Summaries:</h3>
                {data.map((entry) => (
                  <div
                    key={entry.year}
                    className="bg-indigo-50 border border-indigo-100 p-4 rounded-md shadow-sm"
                  >
                    <p className="text-sm text-indigo-800 font-bold mb-1">📅 {entry.year}</p>
                    <p className="text-gray-700 text-sm">{entry.summary}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-right">
                <button
                  disabled
                  className="bg-gray-300 text-white px-4 py-2 rounded-md text-sm cursor-not-allowed"
                >
                  Share to Slack (Coming Soon)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}