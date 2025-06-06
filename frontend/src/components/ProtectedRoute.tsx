import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = localStorage.getItem('githubUser');

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
