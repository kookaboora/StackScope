import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

export default function ContributionHeatmap() {
  const [heatmapData, setHeatmapData] = useState<any[]>([]);

  const token = localStorage.getItem('githubToken');

  useEffect(() => {
    const fetchCommits = async () => {
      if (!token) return;

      const res = await fetch('https://api.github.com/user/repos?per_page=100', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const repos = await res.json();
      const recentRepo = repos[0];
      const commitRes = await fetch(
        `https://api.github.com/repos/${recentRepo.full_name}/commits?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const commits = await commitRes.json();

      const counts: Record<string, number> = {};
      commits.forEach((commit: any) => {
        const date = commit.commit.author.date.split('T')[0];
        counts[date] = (counts[date] || 0) + 1;
      });

      const data = Object.entries(counts).map(([date, count]) => ({
        date,
        count,
      }));

      setHeatmapData(data);
    };

    fetchCommits();
  }, [token]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-indigo-700">Contribution Heatmap</h2>
      <CalendarHeatmap
        startDate={new Date(new Date().setDate(new Date().getDate() - 120))}
        endDate={new Date()}
        values={heatmapData}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          return `color-github-${Math.min(value.count, 4)}`;
        }}
        showWeekdayLabels
      />
    </div>
  );
}
