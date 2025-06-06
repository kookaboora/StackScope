export default function GitHubPanel() {
  const userData = localStorage.getItem('githubUser');
  const user = userData ? JSON.parse(userData) : null;

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">GitHub</h2>
      {user ? (
        <>
          <p className="text-gray-800">Connected as <b>{user.login}</b></p>
          <p className="text-gray-500 text-sm mt-1">GitHub ID: {user.id}</p>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 text-sm hover:underline mt-2 inline-block"
          >
            View GitHub Profile
          </a>
        </>
      ) : (
        <p className="text-gray-500">Not connected.</p>
      )}
    </div>
  );
}
