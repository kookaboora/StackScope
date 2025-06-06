import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white py-28 overflow-hidden">
      {/* Glowing Abstract Background Orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-400 opacity-20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 opacity-30 blur-[150px] rounded-full translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-indigo-600 opacity-10 blur-[200px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex justify-center mb-6">
            <Sparkles className="text-white animate-pulse" size={40} />
          </div>
          <h3 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Ready to elevate your development workflow?
          </h3>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto drop-shadow-sm">
            Get started with StackScope today and take control of your stack like never before.
          </p>
        </motion.div>

        {/* Decorative Shine Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-1/2 h-1/2 bg-white opacity-5 rounded-full blur-[150px] absolute top-1/3 left-1/4 animate-pulse"></div>
          <div className="w-[200px] h-[200px] bg-indigo-300 opacity-10 blur-[120px] rounded-full absolute top-0 right-0 animate-ping"></div>
        </div>
      </div>
    </section>
  );
}