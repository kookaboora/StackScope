import {
  BookOpen,
  Wrench,
  Layers,
  Rocket,
  GitBranch,
  BarChart3,
  FolderTree,
  Compass,
  ArrowLeft,
  UserCircle,
  Printer,
} from 'lucide-react';

export default function Doc() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-indigo-50 p-6 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md border border-indigo-100 print:shadow-none print:border-none print:p-4">
        {/* Header and Print Button */}
        <div className="flex justify-between items-center mb-4 print:hidden">
          <div className="flex items-center gap-3">
            <BookOpen className="text-indigo-700" size={28} />
            <h1 className="text-3xl font-extrabold text-indigo-700">StackScope Documentation</h1>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
          >
            <Printer size={16} /> Print
          </button>
        </div>

        <p className="text-gray-700 mb-6 print:mb-4">
          StackScope is a real-time analytics and AI insight platform designed to monitor developer
          activity across repositories, visualize productivity trends, and summarize performance
          using intelligent metrics. This documentation provides a complete overview of the
          platform, technologies used, and instructions to get started.
        </p>

        {/* Project Overview */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="text-indigo-600" size={18} />
            <h2 className="text-xl font-semibold text-indigo-600">Project Overview</h2>
          </div>
          <p className="text-gray-700 text-sm">
            StackScope helps developers track commits, pull requests, issue activity, and generate
            AI-based summaries of productivity trends and code tone insights over time.
          </p>
        </section>

        {/* Tech Stack */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="text-indigo-600" size={18} />
            <h2 className="text-xl font-semibold text-indigo-600">Tech Stack</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>React (Vite) + TypeScript</li>
            <li>Tailwind CSS for modern UI styling</li>
            <li>Recharts for data visualizations</li>
            <li>GitHub REST API for real-time data</li>
            <li>OpenAI GPT-3.5 Turbo for sentiment and summary generation</li>
          </ul>
        </section>

        {/* Getting Started */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="text-indigo-600" size={18} />
            <h2 className="text-xl font-semibold text-indigo-600">Getting Started</h2>
          </div>
          <ol className="list-decimal list-inside text-gray-700 text-sm space-y-1">
            <li>Clone the repository</li>
            <li>Install dependencies: <code className="bg-gray-100 px-1 rounded">npm install</code></li>
            <li>Set GitHub and OpenAI keys in localStorage or .env</li>
            <li>Run frontend: <code className="bg-gray-100 px-1 rounded">npm run dev</code></li>
            <li>Run backend: <code className="bg-gray-100 px-1 rounded">node server.js</code></li>
          </ol>
        </section>

        {/* Integrations */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="text-indigo-600" size={18} />
            <h2 className="text-xl font-semibold text-indigo-600">Integrations</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li><strong>GitHub API:</strong> Authentication and repository data</li>
            <li><strong>OpenAI API:</strong> Sentiment scoring and AI summaries</li>
            <li><strong>Slack (Coming Soon):</strong> Share AI summaries with team</li>
          </ul>
        </section>

        {/* Key Features */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-indigo-600" size={18} />
            <h2 className="text-xl font-semibold text-indigo-600">Key Features</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Realtime GitHub activity tracking</li>
            <li>Productivity and sentiment score graphs</li>
            <li>AI-generated summaries for each year</li>
            <li>Reviewer suggestion and review intelligence</li>
            <li>Clean, responsive UI for dashboards</li>
          </ul>
        </section>

        {/* Component Structure */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FolderTree className="text-indigo-600" size={18} />
            <h2 className="text-xl font-semibold text-indigo-600">Component Structure</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li><code>/components/Dashboard</code> – Main dashboard cards</li>
            <li><code>/components/AIInsight</code> – GPT-powered features</li>
            <li><code>/components/GitHub</code> – GitHub analytics and charts</li>
            <li><code>/pages</code> – Routes like Realtime, Summary, and Docs</li>
          </ul>
        </section>

        {/* Roadmap */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="text-indigo-600" size={18} />
            <h2 className="text-xl font-semibold text-indigo-600">Roadmap</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Slack sharing functionality</li>
            <li>Team-based productivity insights</li>
            <li>Dark mode support</li>
            <li>Expanded GitHub integration (multiple repos)</li>
          </ul>
        </section>

        {/* Developer Credits */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <UserCircle className="text-indigo-600" size={18} />
            <h2 className="text-xl font-semibold text-indigo-600">Developer Credits</h2>
          </div>
          <p className="text-gray-700 text-sm">
            StackScope is built by <strong>Harshal Patel</strong>, a full-stack developer focused on intelligent tooling, clean interfaces, and AI-enhanced developer analytics.
          </p>
        </section>

        {/* Back to Dashboard */}
        <div className="text-center print:hidden">
          <a
            href="/"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2 rounded-md transition"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}