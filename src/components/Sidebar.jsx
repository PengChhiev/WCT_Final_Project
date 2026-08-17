import { NavLink } from "react-router-dom";

export default function Sidebar({ role, isOpen, setIsOpen }) {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 p-4 space-y-1 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavLink to="/items" className={linkClass} onClick={() => setIsOpen(false)}>
          My Items
        </NavLink>

        {role === "moderator" && (
          <NavLink to="/admin" className={linkClass} onClick={() => setIsOpen(false)}>
            Moderator Dashboard
          </NavLink>
        )}

        <NavLink to="/" className={linkClass} onClick={() => setIsOpen(false)}>
          Public Board
        </NavLink>
      </aside>
    </>
  );
}
