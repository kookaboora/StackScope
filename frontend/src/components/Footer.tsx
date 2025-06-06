// Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-20">
      <div className="max-w-screen-xl mx-auto px-8 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} StackScope. All rights reserved.</p>
      </div>
    </footer>
  );
}