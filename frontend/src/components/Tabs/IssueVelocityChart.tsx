import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
} from 'recharts';

export default function IssueVelocityChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const token = localStorage.getItem('githubToken');

  useEffect(() => {
    const fetchIssues = async () => {
      if (!token) return;

      const res = await fetch('https://api.github.com/user/repos?per_page=100', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const repos = await res.json();
      const recentRepo = repos[0];

      const issueRes = await fetch(
        `https://api.github.com/repos/${recentRepo.full_name}/issues?state=all&per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const issues = await issueRes.json();

      const counts: Record<string, number> = {};
      issues.forEach((issue: any) => {
        const closedDate = issue.closed_at || issue.created_at;
        const date = new Date(closedDate).toISOString().split('T')[0];
        counts[date] = (counts[date] || 0) + 1;
      });

      const chart = Object.entries(counts)
        .slice(-7)
        .map(([date, count]) => ({
          date,
          count,
        }));

      setChartData(chart);
    };

    fetchIssues();
  }, [token]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-indigo-700">Issue Resolution Velocity</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
