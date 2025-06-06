// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Integrations from './components/Integrations';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsight';
import Docs from './components/Docs';
import Login from './components/Login';
import Signup from './components/Signup';
import GitHubCallback from './components/githubcallback';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import GitHubRealtime from './pages/GitHubRealtime';
import AIInsight from './components/AIInsight';
import AIDevSummary from './components/Dashboard/AiDevSummary';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
     
      <Route path="/integrations" element={<Integrations />} />
            <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
                  }
      />
      <Route path="/ai" element={<AIInsights />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/github/callback" element={<GitHubCallback />} />
       <Route path="/unauthorized" element={<Unauthorized />} />
       <Route path="/github/realtime" element={<GitHubRealtime />} />
        <Route path="/ai-insight" element={<AIInsight />} /> 
        <Route path="/ai-summary" element={<AIDevSummary />} />

    </Routes>
  );
}

// This is the main App component for the StackScope application.