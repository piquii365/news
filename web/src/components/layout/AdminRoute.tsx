import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import React, { useState, useCallback, useMemo } from "react";
import Sidebar from "./Sidebar";

interface UserSession {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  auth_account_id: number;
  provider_name: string;
  username: string;
  session_id: string;
  ip_address: string;
  user_agent: string;
  session_created_at: string;
  last_activity: string;
  session_is_active: number;
}

interface LayoutProps {
  children: React.ReactNode;
  userSession: UserSession;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isLoading } = useAuth();

  const toggleSidebar = useCallback(() => setIsSidebarOpen((s) => !s), []);

  const role = useMemo(
    () => (user as any)?.role ?? (user as any)?.roles ?? null,
    [user]
  );

  const allowed = useMemo(
    () =>
      role === "admin" ||
      role === "dev" ||
      (Array.isArray(role) && role.includes("admin")),
    [role]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // user role is computed above (memoized)

  if (!allowed) {
    return <div className="p-8">You are not authorized to view this page.</div>;
  }

  const userSession = user!;
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        userSession={userSession}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Welcome back, {userSession.full_name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Role:{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                  {userSession.role}
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>© 2025 Admin Dashboard. All rights reserved.</span>
            <span>
              Last activity:{" "}
              {new Date(userSession.last_activity).toLocaleString()}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
