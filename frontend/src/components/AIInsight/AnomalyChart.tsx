import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

type CommitWeek = {
  week: string;
  commits: number;
};

export default function AnomalyChart() {
  const [data, setData] = useState<CommitWeek[]>([]);
  const [anomalyIndex, setAnomalyIndex] = useState<number | null>(null);

  const userData = localStorage.getItem('githubUser');
  const token = localStorage.getItem('githubToken');
  const user = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };

  const fetchCommitActivity = async () => {
    try {
      const repoRes = await fetch(
        `https://api.github.com/user/repos?per_page=100&sort=updated`,
        { headers }
      );
      const repos = await repoRes.json();
      const recentRepo = repos.find((repo: any) => !repo.fork);
      if (!recentRepo) return;

      const repoFullName = recentRepo.full_name;
      const sinceDate = new Date();
      sinceDate.setFullYear(sinceDate.getFullYear() - 5);
      const untilDate = new Date();

      let page = 1;
      const perPage = 100;
      let allCommits: any[] = [];
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(
          `https://api.github.com/repos/${repoFullName}/commits?since=${sinceDate.toISOString()}&until=${untilDate.toISOString()}&per_page=${perPage}&page=${page}`,
          { headers }
        );
        const commits = await res.json();

        if (!Array.isArray(commits) || commits.length === 0) {
          hasMore = false;
        } else {
          allCommits = [...allCommits, ...commits];
          page++;
        }

        // Safety limit to avoid hitting API rate limit or loading too much data
        if (page > 10) break;
      }

      const weekMap: Record<string, number> = {};

      allCommits.forEach((commit) => {
        const date = new Date(commit.commit.author.date);
        const weekYear = `${date.getFullYear()}-W${getWeekNumber(date)}`;
        weekMap[weekYear] = (weekMap[weekYear] || 0) + 1;
      });

      const formattedData: CommitWeek[] = Object.entries(weekMap).map(([week, commits]) => ({
        week,
        commits,
      }));

      formattedData.sort((a, b) => (a.week > b.week ? 1 : -1));

      const avgCommits =
        formattedData.reduce((sum, d) => sum + d.commits, 0) / formattedData.length;

      const outlierIndex = formattedData.findIndex(
        (d) => Math.abs(d.commits - avgCommits) > avgCommits * 0.75
      );

      setData(formattedData);
      setAnomalyIndex(outlierIndex !== -1 ? outlierIndex : null);
    } catch (err) {
      console.error('Failed to fetch commit activity:', err);
    }
  };

  const getWeekNumber = (date: Date): number => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
  };

  useEffect(() => {
    if (user && token) fetchCommitActivity();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">
        Anomaly Detection: Weekly Commits (Last 5 Years)
      </h2>
      {data.length === 0 ? (
        <p className="text-gray-500">Loading or no commit data found.</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tickFormatter={(tick) => tick.replace('W', 'Wk')} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="commits">
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === anomalyIndex ? '#ef4444' : '#6366f1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
