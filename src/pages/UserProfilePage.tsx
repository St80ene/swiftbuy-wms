import React from 'react';
import {
  Building2,
  Store,
  Shield,
  Mail,
  Calendar,
  UserCheck,
  Clock,
  Edit3,
  KeyRound,
  BellRing,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/services/auth/hooks/useAuth';

export const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fallbacks using your IUser structure
  const fullName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : 'User Profile';

  const email = user?.business_email || 'No email provided';
  const roleName = user?.role?.name || 'Authorized Member';
  const businessName = user?.business?.name || 'Main Enterprise';
  const storeName = user?.store?.name || 'Primary Warehouse / Store';
  const isActive = user?.is_active ?? true;
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : 'Recent';

  return (
    <div className="min-h-full bg-slate-950 p-6 text-slate-100">
      {/* Header Back & Title */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center cursor-pointer justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Account & Profile</h1>
            <p className="text-xs text-slate-400">
              Manage your personal credentials, workspace assignments, and
              security settings.
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Edit profile functionality goes here')}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-500 cursor-pointer"
        >
          <Edit3 size={14} />
          <span>Edit Details</span>
        </button>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Identity Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-2xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-4">
              {user?.first_name?.[0] || 'U'}
              {user?.last_name?.[0] || ''}
            </div>

            <h2 className="text-base font-bold text-white">{fullName}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{email}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-950 px-3 py-1 text-[11px] font-semibold text-cyan-300 border border-cyan-800">
                <Shield size={12} />
                {roleName}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold border ${isActive ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800' : 'bg-red-950/40 text-red-300 border-red-800'}`}
              >
                <UserCheck size={12} />
                {isActive ? 'Active Account' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-500" />
                Member Since
              </span>
              <span className="font-medium text-slate-200">{createdAt}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-slate-500" />
                Account Status
              </span>
              <span className="font-medium text-emerald-400">Verified</span>
            </div>
          </div>
        </div>

        {/* Right Column: Business, Store, and Settings Options */}
        <div className="space-y-6 lg:col-span-2">
          {/* Workspace Assignment Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">
              Workspace & Location
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                      Business Enterprise
                    </span>
                    <p className="text-sm font-semibold text-slate-200">
                      {businessName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      ID: {user?.business_id || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Store size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                      Assigned Store / Depot
                    </span>
                    <p className="text-sm font-semibold text-slate-200">
                      {storeName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      ID: {user?.store_id || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions / Preferences */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">
              Account Security & Options
            </h3>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer">
                <div className="flex items-center gap-3">
                  <KeyRound size={16} className="text-cyan-400" />
                  <div>
                    <p className="font-semibold text-slate-200">
                      Change Password
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Update your account login security credentials
                    </p>
                  </div>
                </div>
                <span className="text-xs text-cyan-400 font-semibold">
                  Update
                </span>
              </button>

              <button className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer">
                <div className="flex items-center gap-3">
                  <BellRing size={16} className="text-amber-400" />
                  <div>
                    <p className="font-semibold text-slate-200">
                      Notification Preferences
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Manage low-stock alerts and email updates
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  Configure
                </span>
              </button>

              <button className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-indigo-400" />
                  <div>
                    <p className="font-semibold text-slate-200">
                      Business Email Settings
                    </p>
                    <p className="text-[11px] text-slate-400">{email}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  Linked
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
