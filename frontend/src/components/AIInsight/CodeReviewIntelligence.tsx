import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ReviewerSentiment {
  reviewer: string;
  reviews: number;
  sentiment: number;
}

export default function CodeReviewSentimentChart() {
  const [data, setData] = useState<ReviewerSentiment[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('githubToken');
  const openaiKey = import.meta.env.VITE_OPENAI_KEY;
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

  const fetchSentimentStats = async () => {
    setLoading(true);
    const repoRes = await fetch(`https://api.github.com/user/repos?per_page=100&sort=updated`, { headers });
    const repos = await repoRes.json();
    const reviewMap: Record<string, { count: number; comments: string[] }> = {};

    for (const repo of repos.filter((r: any) => !r.fork)) {
      const prsRes = await fetch(
        `https://api.github.com/repos/${repo.full_name}/pulls?state=closed&per_page=10`,
        { headers }
      );
      const prs = await prsRes.json();

      for (const pr of prs) {
        const reviewsRes = await fetch(
          `https://api.github.com/repos/${repo.full_name}/pulls/${pr.number}/reviews`,
          { headers }
        );
        const reviews = await reviewsRes.json();

        reviews.forEach((review: any) => {
          const reviewer = review.user?.login;
          const comment = review.body || '';
          if (reviewer && comment) {
            if (!reviewMap[reviewer]) reviewMap[reviewer] = { count: 0, comments: [] };
            reviewMap[reviewer].count++;
            reviewMap[reviewer].comments.push(comment);
          }
        });
      }
    }

    const sentiments: ReviewerSentiment[] = [];
    for (const [reviewer, { count, comments }] of Object.entries(reviewMap)) {
      const combined = comments.slice(0, 5).join('\n');
      try {
        const res = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are an AI reviewer. Given the review comments, provide an average sentiment score from -1 to 1 as a float only.',
              },
              {
                role: 'user',
                content: combined,
              },
            ],
          },
          { headers: openaiHeaders }
        );

        const score = parseFloat(res.data.choices[0].message.content.match(/-?\d+(\.\d+)?/)?.[0] || '0');
        sentiments.push({ reviewer, reviews: count, sentiment: score });
      } catch (err) {
        console.error(`OpenAI error for ${reviewer}:`, err);
        sentiments.push({ reviewer, reviews: count, sentiment: 0 });
      }
    }

    setData(sentiments);
    const avgSent = sentiments.reduce((acc, cur) => acc + cur.sentiment, 0) / sentiments.length;
    setSummary(`Overall sentiment average among top reviewers is ${avgSent.toFixed(2)}. Most reviewers tend to provide ${avgSent > 0.5 ? 'positive' : avgSent < 0 ? 'critical' : 'neutral'} feedback.`);
    setLoading(false);
  };

  useEffect(() => {
    if (user && token) fetchSentimentStats();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Code Review Sentiment Analysis</h2>
      {loading ? (
        <p className="text-gray-500">Loading sentiment data...</p>
      ) : (
        <>
          <p className="mb-4 text-gray-700">{summary}</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reviewer" />
              <YAxis domain={[-1, 1]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sentiment" fill="#4f46e5" name="Sentiment Score" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}