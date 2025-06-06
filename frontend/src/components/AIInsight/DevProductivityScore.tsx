import { useEffect, useState } from 'react';
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
}

export default function DevProductivityScore() {
  const [data, setData] = useState<DevMetrics[]>([]);
  const token = localStorage.getItem('githubToken');
  const userData = localStorage.getItem('githubUser');
  const user = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };

  const fetchDeveloperMetrics = async () => {
    if (!user || !token) return;

    const repoRes = await fetch(`https://api.github.com/user/repos?per_page=100&sort=updated`, {
      headers,
    });
    const repos = await repoRes.json();
    const repo = repos.find((r: any) => !r.fork);
    if (!repo) return;

    const owner = repo.owner.login;
    const repoName = repo.name;
    const currentYear = new Date().getFullYear();
    const metrics: DevMetrics[] = [];

    for (let y = currentYear - 4; y <= currentYear; y++) {
      const start = new Date(`${y}-01-01`);
      const end = new Date(`${y}-12-31`);
      const isoStart = start.toISOString();
      const isoEnd = end.toISOString();

      // Commits
      const commitRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/commits?since=${isoStart}&until=${isoEnd}&per_page=100`,
        { headers }
      );
      const commits = await commitRes.json();

      // PRs
      const prRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/pulls?state=closed&per_page=100`,
        { headers }
      );
      const allPRs = await prRes.json();
      const prs = allPRs.filter(
        (pr: any) => pr.merged_at && new Date(pr.merged_at) >= start && new Date(pr.merged_at) <= end
      );

      // Issues
      const issueRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/issues?state=closed&since=${isoStart}&per_page=100`,
        { headers }
      );
      const allIssues = await issueRes.json();
      const issues = allIssues.filter(
        (issue: any) => !issue.pull_request && new Date(issue.closed_at) <= end
      );

      // Score
      const score = Math.round(
        (commits.length * 0.4 + prs.length * 0.35 + issues.length * 0.25) * 10
      );

      metrics.push({
        year: y.toString(),
        commits: commits.length,
        prsMerged: prs.length,
        issuesClosed: issues.length,
        productivityScore: score,
      });
    }

    setData(metrics);
  };

  useEffect(() => {
    fetchDeveloperMetrics();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">
        Dev Productivity Score (Yearly Breakdown)
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500">Loading metrics...</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="productivityScore" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-8">
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
        </>
      )}
    </div>
  );
}