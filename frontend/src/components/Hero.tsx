import { Suspense, lazy } from 'react';

const Spotlight = lazy(() => import('./SpotlightEffect'));

export default function Hero() {
  return (
    <section className="relative bg-indigo-600 text-white py-28 overflow-hidden">
      <Suspense fallback={null}>
        <Spotlight />
      </Suspense>

      <div className="relative z-10 max-w-screen-xl mx-auto px-8 text-center">
        <h2 className="text-6xl font-extrabold mb-6 tracking-tight leading-tight">
          Visibility. Intelligence. Precision.
        </h2>
        <p className="text-xl text-white/90 max-w-3xl mx-auto">
          StackScope delivers real-time GitHub analytics and AI-driven productivity summaries. Monitor smarter, not harder.
        </p>
      </div>
    </section>
  );
}