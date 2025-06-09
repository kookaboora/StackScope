import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function GitHubCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Connecting to GitHub...');
  const code = searchParams.get('code');
  const alreadyFetched = useRef(false);

  useEffect(() => {
    const fetchGitHubUser = async () => {fetchGitHubUser
      if (!code || alreadyFetched.current) return;
      alreadyFetched.current = true;

      try {
        const res = await axios.get(`https://stackscope-backend-production.up.railway.app/auth/github/callback?code=${code}`);
        const { user, accessToken } = res.data;

        // ✅ Save to localStorage
        localStorage.setItem('githubUser', JSON.stringify(user));
        localStorage.setItem('githubToken', accessToken);

        setStatus(`Welcome, ${user.login}! Redirecting...`);

        // ✅ Redirect to dashboard after short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('GitHub auth error:', err.response?.data || err.message);
          setStatus('Authentication failed.');
        } else if (err instanceof Error) {
          console.error('Unexpected error:', err.message);
          setStatus('Unexpected error occurred.');
        } else {
          console.error('Unknown error:', err);
          setStatus('Unknown error occurred.');
        }
      }
    };

    fetchGitHubUser();
  }, [code]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-indigo-600 text-xl font-semibold">
      {status}
    </main>
  );
}
