import React from "react";
import {
  User,
  Shield,
  Lock,
  CreditCard,
  FileText,
  Gift,
  Globe,
  Bell,
  LogOut,
  X,
  Mail,
  Calendar,
  Activity,
  Monitor,
} from "lucide-react";

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

interface ProfileProps {
  userSession: UserSession;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userSession, onClose }) => {
  const handleLogout = () => {
    // Handle logout logic
    console.log("Logging out...");
    // Add your logout API call here
  };

  const accountSections = [
    {
      title: "Personal & Security",
      items: [
        {
          icon: <User className="w-5 h-5" />,
          label: "Personal Details",
          description:
            "Manage your name, contact details, and profile information",
          action: "manage",
        },
        {
          icon: <Shield className="w-5 h-5" />,
          label: "Security & Login",
          description:
            "Update your password, enable 2FA, and manage login methods",
          action: "manage",
        },
        {
          icon: <Lock className="w-5 h-5" />,
          label: "Privacy Controls",
          description: "Adjust data-sharing preferences and connected apps",
          action: "manage",
        },
      ],
    },
    {
      title: "Financial & Payments",
      items: [
        {
          icon: <CreditCard className="w-5 h-5" />,
          label: "Payments & Payouts",
          description:
            "View payment methods, transaction history, and payout settings",
          action: "view",
        },
        {
          icon: <FileText className="w-5 h-5" />,
          label: "Taxes & Invoices",
          description: "Manage tax documents and download invoices",
          action: "view",
        },
        {
          icon: <Gift className="w-5 h-5" />,
          label: "Referral & Rewards",
          description: "View referral bonuses and redeemable coupons",
          action: "view",
        },
      ],
    },
    {
      title: "Preferences & Notifications",
      items: [
        {
          icon: <Globe className="w-5 h-5" />,
          label: "Language & Localization",
          description: "Set your preferred language, currency, and timezone",
          action: "configure",
        },
        {
          icon: <Bell className="w-5 h-5" />,
          label: "Notification Preferences",
          description: "Choose how you receive account updates and alerts",
          action: "configure",
        },
      ],
    },
  ];

  const sessionInfo = [
    {
      icon: <Mail className="w-4 h-4" />,
      label: "Email",
      value: userSession.email,
    },
    {
      icon: <User className="w-4 h-4" />,
      label: "Username",
      value: `@${userSession.username}`,
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: "Provider",
      value: userSession.provider_name,
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Session Started",
      value: new Date(userSession.session_created_at).toLocaleString(),
    },
    {
      icon: <Activity className="w-4 h-4" />,
      label: "Last Activity",
      value: new Date(userSession.last_activity).toLocaleString(),
    },
    {
      icon: <Monitor className="w-4 h-4" />,
      label: "IP Address",
      value: userSession.ip_address,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 relative">
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30">
              {userSession.full_name.charAt(0)}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">
                {userSession.full_name}
              </h2>
              <p className="text-indigo-100 flex items-center gap-2">
                <span className="px-2 py-1 bg-white/20 rounded-md text-sm font-medium uppercase">
                  {userSession.role}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    userSession.session_is_active
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                ></span>
                <span className="text-sm">
                  {userSession.session_is_active ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Session Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Session Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sessionInfo.map((info, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs mb-1">
                    {info.icon}
                    <span>{info.label}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {info.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Account Sections */}
          {accountSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    className="w-full bg-white dark:bg-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-4 transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {item.label}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wider">
                        {item.action}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
