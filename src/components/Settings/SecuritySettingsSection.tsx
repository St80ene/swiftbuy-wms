import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { ChangePasswordModal } from '../Auth/ChangePassword';

export const SecuritySettingsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <KeyRound size={16} className="text-cyan-400" />
          <div>
            <p className="font-semibold text-slate-200">Change Password</p>
            <p className="text-[11px] text-slate-400">
              Update your account login security credentials
            </p>
          </div>
        </div>
        <span className="text-xs text-cyan-400 font-semibold">Update</span>
      </button>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
