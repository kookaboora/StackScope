/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",             // If it's in the root
    "./src/**/*.{js,ts,jsx,tsx}" // This should match all files using Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
