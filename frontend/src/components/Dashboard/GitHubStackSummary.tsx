import { useEffect, useState } from 'react';

export default function GitHubStackSummary() {
  const [repoCount, setRepoCount] = useState(0);
  const [mostActiveRepo, setMostActiveRepo] = useState('');
  const [lastCommitDate, setLastCommitDate] = useState('');
  const [pullRequests, setPullRequests] = useState(0);

  const userData = localStorage.getItem('githubUser');
  const user = userData ? JSON.parse(userData) : null;
  const token = localStorage.getItem('githubToken');

  useEffect(() => {
    if (!token || !user) return;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    };

    const fetchData = async () => {
      try {
        // 1. Repos
        const repoRes = await fetch(`https://api.github.com/user/repos?per_page=100`, { headers });
        const repos = await repoRes.json();

        setRepoCount(repos.length);

        const mostRecent = repos.sort(
          (a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0];

        setMostActiveRepo(mostRecent?.name || '-');

        // 2. Commits from most active repo
        if (mostRecent) {
          const commitRes = await fetch(
            `https://api.github.com/repos/${mostRecent.full_name}/commits`,
            { headers }
          );
          const commits = await commitRes.json();
          setLastCommitDate(new Date(commits?.[0]?.commit?.author?.date).toLocaleDateString());
        }

        // 3. Pull Requests by user
        const prRes = await fetch(
          `https://api.github.com/search/issues?q=is:pr+author:${user.login}`,
          { headers }
        );
        const prData = await prRes.json();
        setPullRequests(prData.total_count || 0);
      } catch (err) {
        console.error('GitHub summary error:', err);
      }
    };

    fetchData();
  }, [token, user]);

  if (!user) return null;

  return (
    <section className="max-w-6xl mx-auto mt-16 bg-white shadow rounded-xl p-6">
      <h3 className="text-2xl font-bold text-indigo-700 mb-4">📊 Your GitHub Stack Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-800">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="font-medium text-indigo-600 mb-1">📁 Repositories</p>
          <p className="text-xl font-bold">{repoCount}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="font-medium text-indigo-600 mb-1">🔥 Most Active Repo</p>
          <p className="text-xl font-bold">{mostActiveRepo}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="font-medium text-indigo-600 mb-1">🔁 Pull Requests</p>
          <p className="text-xl font-bold">{pullRequests}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="font-medium text-indigo-600 mb-1">🕒 Last Commit</p>
          <p className="text-xl font-bold">{lastCommitDate || '–'}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg flex flex-col">
          <p className="font-medium text-indigo-600 mb-1">🔗 GitHub Profile</p>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:underline font-semibold"
          >
            View Profile →
          </a>
        </div>
      </div>
    </section>
  );
}
