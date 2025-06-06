import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/integrations'); // or '/integrations'
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Access Denied
      </h1>
      <p className="text-gray-700 text-lg">
        You must be logged in to use this feature.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Redirecting you to the login page in 5 seconds...
      </p>
    </main>
  );
}
