import Navbar from '../components/Navbar';
import { Github } from 'lucide-react';

export default function Integrations() {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = encodeURIComponent('http://localhost:5173/auth/github/callback');
  const scope = encodeURIComponent('repo read:user');

  const handleGitHubConnect = () => {
    if (!clientId) {
      alert("GitHub Client ID not set in environment variables");
      return;
    }
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-b from-white to-indigo-50 py-20 min-h-screen">
        <div className="max-w-4xl mx-auto text-center mb-16 px-4">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">Connect Your Tools</h1>
          <p className="text-gray-600 text-lg">
            Integrate GitHub with StackScope to unlock powerful real-time analytics,
            AI insights, and intelligent productivity monitoring — all in one place.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-indigo-100 rounded-xl shadow-md p-8 text-left hover:shadow-lg transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-full">
                <Github size={28} />
              </div>
              <h2 className="text-2xl font-bold text-indigo-700">GitHub Integration</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Seamlessly connect your GitHub repositories to monitor commits, pull requests,
              and productivity metrics in real time. StackScope uses GitHub’s REST API
              to provide continuous insight into your development lifecycle.
            </p>
            <button
              onClick={handleGitHubConnect}
              className="w-full py-3 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Connect with GitHub
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} StackScope. All rights reserved.
      </footer>
    </>
  );
}