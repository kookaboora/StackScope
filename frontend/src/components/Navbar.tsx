import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Icons for mobile toggle

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('githubUser');
    setIsLoggedIn(!!user);
    setMenuOpen(false); // close on route change
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('githubUser');
    localStorage.removeItem('githubToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-indigo-600">
          <Link to="/">StackScope</Link>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/docs" className="text-gray-700 hover:text-indigo-600 transition">
              Docs
            </Link>
          </li>
          {isLoggedIn ? (
            <li>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/integrations"
                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-indigo-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4 space-y-3">
          <Link to="/dashboard" className="block text-gray-700 hover:text-indigo-600">
            Dashboard
          </Link>
          <Link to="/docs" className="block text-gray-700 hover:text-indigo-600">
            Docs
          </Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/integrations"
              className="block px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}