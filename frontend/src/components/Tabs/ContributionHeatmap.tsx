import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

type CommitEntry = {
  date: string;
  count: number;
};

export default function ContributionHeatmap() {
  const [yearlyData, setYearlyData] = useState<Record<number, CommitEntry[]>>({});
  const token = localStorage.getItem('githubToken');

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };

  const fetchMostRecentRepo = async (): Promise<any | null> => {
    const res = await fetch('https://api.github.com/user/repos?per_page=100', { headers });
    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) return null;
    return repos.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )[0];
  };

  const fetchCommitsForYear = async (repoFullName: string, year: number): Promise<CommitEntry[]> => {
    const since = `${year}-01-01T00:00:00Z`;
    const until = `${year}-12-31T23:59:59Z`;
    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits?since=${since}&until=${until}&per_page=100`,
      { headers }
    );
    const commits = await res.json();

    const counts: Record<string, number> = {};

    commits.forEach((commit: any) => {
      const date = commit?.commit?.author?.date?.split('T')[0];
      if (date) counts[date] = (counts[date] || 0) + 1;
    });

    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      const repo = await fetchMostRecentRepo();
      if (!repo) return;

      const dataPerYear: Record<number, CommitEntry[]> = {};
      const currentYear = new Date().getFullYear();

      for (let year = currentYear - 4; year <= currentYear; year++) {
        const data = await fetchCommitsForYear(repo.full_name, year);
        dataPerYear[year] = data;
      }

      setYearlyData(dataPerYear);
    })();
  }, [token]);

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold text-indigo-700">GitHub Contribution Heatmap (Last 5 Years)</h2>
      {Object.entries(yearlyData)
        .sort(([a], [b]) => parseInt(b) - parseInt(a))
        .map(([year, data]) => (
          <div key={year} className="bg-white p-4 rounded-xl shadow border border-indigo-100">
            <h3 className="text-md font-semibold text-gray-800 mb-2">{year}</h3>
            <CalendarHeatmap
              startDate={new Date(`${year}-01-01`)}
              endDate={new Date(`${year}-12-31`)}
              values={data}
              showWeekdayLabels
              gutterSize={3}
              classForValue={(value) => {
                if (!value || value.count === 0) return 'color-empty';
                if (value.count < 2) return 'color-github-1';
                if (value.count < 5) return 'color-github-2';
                if (value.count < 10) return 'color-github-3';
                return 'color-github-4';
              }}
            />
          </div>
        ))}
    </div>
  );
}
