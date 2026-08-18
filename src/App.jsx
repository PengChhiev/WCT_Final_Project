import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { auth, db } from "./lib/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ItemsManager from "./pages/ItemsManager";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "student" | "moderator"
  const [checkingSession, setCheckingSession] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isCurrent = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (currentUser) {
        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (isCurrent) setRole(snap.exists() ? snap.data().role : "student");
        } catch (err) {
          console.error("Error fetching role:", err);
          if (isCurrent) setRole("student");
        }
        if (isCurrent) setIsSidebarOpen(true);
      } else {
        setRole(null);
        setIsSidebarOpen(false);
      }

      if (isCurrent) setCheckingSession(false);
    });
    return () => {
      isCurrent = false;
      unsubscribe();
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      setIsSidebarOpen(false);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse font-medium">Checking session...</p>
      </div>
    );
  }

  const isModerator = role === "moderator";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Navbar
        user={user}
        role={role}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex flex-1 pt-16 relative">
        {user && (
          <Sidebar
            role={role}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />
        )}

        <main
          className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
            user && isSidebarOpen ? "md:pl-64" : "md:pl-0"
          }`}
        >
          <Routes>
            {/* Anyone can browse the board; an account is required to post or manage items. */}
            <Route path="/" element={<HomePage />} />
            <Route path="/item/:id" element={<ItemDetailPage user={user} />} />

            {/* Any signed-in user: post / manage own items */}
            <Route
              path="/items"
              element={user ? <ItemsManager user={user} role={role} /> : <Navigate to="/login" replace />}
            />

            {/* Moderator-only dashboard */}
            <Route
              path="/admin"
              element={
                user && isModerator ? (
                  <AdminDashboardPage user={user} />
                ) : user ? (
                  <Navigate to="/items" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Auth routes */}
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/items" replace />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/items" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <div className={`transition-all duration-300 ${user && isSidebarOpen ? "md:pl-64" : "md:pl-0"}`}>
        <Footer />
      </div>
    </div>
  );
}
