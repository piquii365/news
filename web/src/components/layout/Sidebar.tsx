import React, { useState, useMemo, useCallback } from "react";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  FolderTree,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Profile from "../../pages/Profile";

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

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userSession: UserSession;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, userSession }) => {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [showProfile, setShowProfile] = useState(false);

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: "overview",
        label: "Overview",
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: "/admin/overview",
      },
      {
        id: "posts",
        label: "Posts",
        icon: <FileText className="w-5 h-5" />,
        path: "/admin/posts",
        badge: 12,
      },
      {
        id: "comments",
        label: "Comments",
        icon: <MessageSquare className="w-5 h-5" />,
        path: "/admin/comments",
        badge: 5,
      },
      {
        id: "categories",
        label: "Categories",
        icon: <FolderTree className="w-5 h-5" />,
        path: "/admin/categories",
      },
    ],
    []
  );

  const handleMenuClick = useCallback((menuId: string) => {
    setActiveMenu(menuId);
    // Handle navigation here
    console.log(`Navigating to: ${menuId}`);
  }, []);

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 z-30 flex flex-col ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Admin
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    activeMenu === item.id
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <span
                    className={
                      activeMenu === item.id
                        ? "text-indigo-600 dark:text-indigo-400"
                        : ""
                    }
                  >
                    {item.icon}
                  </span>
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left font-medium">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {!isOpen && item.badge && (
                    <span className="absolute right-2 w-2 h-2 bg-indigo-600 rounded-full"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile Section at Bottom */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-3">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
              !isOpen ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {userSession.full_name.charAt(0)}
            </div>
            {isOpen && (
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {userSession.full_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  @{userSession.username}
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Profile Modal */}
      {showProfile && (
        <Profile
          userSession={userSession}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
