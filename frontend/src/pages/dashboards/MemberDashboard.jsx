// src/pages/dashboards/MemberDashboard.jsx
import { useAuth } from "../../context/AuthContext";

export default function MemberDashboard() {
  const { backendUser } = useAuth();

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold text-deepTeal mb-4">
        Member Dashboard
      </h1>

      {backendUser?.lead && (
        <div className="mb-4 bg-white rounded-2xl shadow-md border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-deepTeal mb-1">
            Your Lead
          </h2>
          <div className="text-sm text-gray-700">
            {backendUser.lead.displayName || backendUser.lead.email}
          </div>
          <div className="text-xs text-gray-600">
            {backendUser.lead.email}
          </div>
          {backendUser.lead.mobile && (
            <div className="text-xs text-gray-600">
              Mobile: {backendUser.lead.mobile}
            </div>
          )}
        </div>
      )}

      {/* ...rest of member content... */}
    </div>
  );
}
