import { Link } from "react-router-dom";

export default function Navbar({ user, role, onLogout, isSidebarOpen, setIsSidebarOpen }) {
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 h-16 z-50">
      <nav className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={isSidebarOpen}
            >
              ☰
            </button>
          )}
          <Link to={user ? "/items" : "/"} className="font-bold text-lg text-blue-600">
            Campus Lost &amp; Found
          </Link>
          {role && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 capitalize">
              {role}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:inline">{user.email}</span>
              <button
                onClick={onLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
