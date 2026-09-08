import React, { useEffect } from 'react';
import {
  Building2,
  Store,
  Shield,
  Mail,
  Calendar,
  UserCheck,
  Clock,
  Edit3,
  BellRing,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SecuritySettingsSection } from '@/components/Settings/SecuritySettingsSection';
import { useAuth } from '@/services/auth/hooks/useAuth';
import { EditProfileModal } from '../User/EditProfileModal';

export const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const { user: user_profile } = useAuth();

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  useEffect(() => {
    if (!user_profile) {
      navigate('/login', { replace: true });
    }
  }, [user_profile, navigate]);

  if (!user_profile) {
    return null;
  }

  const fullName =
    user_profile?.first_name && user_profile?.last_name
      ? `${user_profile.first_name} ${user_profile.last_name}`
      : user_profile?.first_name || 'User Profile';

  const initials = `${user_profile?.first_name?.[0] || ''}${
    user_profile?.last_name?.[0] || ''
  }`.toUpperCase();

  const email = user_profile?.company_email || 'No email provided';

  const roleName = user_profile?.role?.name || 'Authorized Member';

  const businessName =
    user_profile?.business?.display_name || 'Main Enterprise';

  const storeName = user_profile?.store?.name || 'Primary Warehouse / Store';

  const isActive = user_profile?.is_active ?? true;

  const createdAt = user_profile?.created_at
    ? new Date(user_profile.created_at).toLocaleDateString()
    : 'Recent';

  // Prepare initial data for the modal
  const modalInitialData = {
    first_name: user_profile?.first_name || '',
    last_name: user_profile?.last_name || '',
    phone_number: user_profile?.phone_number || '',
    company_email: email,
  };

  return (
    <div className="min-h-full bg-slate-950 p-6 text-slate-100">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
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
          onClick={() => setIsEditModalOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-500"
        >
          <Edit3 size={14} />
          <span>Edit Details</span>
        </button>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Identity Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-2xl font-bold text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              {initials || 'U'}
            </div>

            <h2 className="text-base font-bold text-white">{fullName}</h2>

            <p className="mt-0.5 text-xs text-slate-400">{email}</p>

            {/* Role + Status */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-800 bg-cyan-950 px-3 py-1 text-[11px] font-semibold text-cyan-300">
                <Shield size={12} />
                {roleName}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                  isActive
                    ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300'
                    : 'border-red-800 bg-red-950/40 text-red-300'
                }`}
              >
                <UserCheck size={12} />

                {isActive ? 'Active Account' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 space-y-3 border-t border-slate-800 pt-4 text-xs">
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

              <span
                className={`font-medium ${
                  isActive ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isActive ? 'Verified' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Workspace Assignment */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <h3 className="mb-4 text-sm font-bold text-white">
              Workspace & Location
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Business */}
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
                    <Building2 size={20} />
                  </div>

                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                      Business Enterprise
                    </span>

                    <p className="truncate text-sm font-semibold text-slate-200">
                      {businessName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Store */}
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <Store size={20} />
                  </div>

                  <div className="min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                      Assigned Store / Depot
                    </span>

                    <p className="truncate text-sm font-semibold text-slate-200">
                      {storeName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Options */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <h3 className="mb-4 text-sm font-bold text-white">
              Account Security & Options
            </h3>

            <div className="space-y-3">
              <SecuritySettingsSection />

              {/* Notifications */}
              <button className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white">
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

                <span className="text-xs font-semibold text-slate-400">
                  Configure
                </span>
              </button>

              {/* Email */}
              <button className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-indigo-400" />

                  <div>
                    <p className="font-semibold text-slate-200">
                      Business Email Settings
                    </p>

                    <p className="text-[11px] text-slate-400">{email}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  Linked
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={modalInitialData}
        onSuccess={() => {
          // Handle profile update success (e.g., trigger a toast or reload user state if supported)
        }}
      />
    </div>
  );
};
