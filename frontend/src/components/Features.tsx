import { Code2, BrainCog, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'GitHub Stack Monitoring',
    description: 'Track repository activity, pull requests, and issue stats in real-time using the GitHub API.',
    icon: <Code2 className="text-indigo-600 w-7 h-7 group-hover:text-indigo-700 transition" />,
  },
  {
    title: 'AI-Powered Insights',
    description: 'Analyze commit tone, productivity trends, and performance summaries using OpenAI.',
    icon: <BrainCog className="text-purple-600 w-7 h-7 group-hover:text-purple-700 transition" />,
  },
  {
    title: 'Developer Summary Overview',
    description: 'View 5-year developer trends with charts and intelligent summaries to guide improvement.',
    icon: <BarChart3 className="text-blue-600 w-7 h-7 group-hover:text-blue-700 transition" />,
  },
];

export default function Features() {
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-800 mb-16"
        >
          Key Features That Elevate Your Workflow
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map(({ title, description, icon }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-indigo-100"
            >
              <div className="flex items-center justify-center mb-4">{icon}</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
              <p className="text-gray-600 text-sm">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}