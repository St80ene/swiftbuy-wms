import React, { useRef, useState } from 'react';
import { User, Phone, Info, Camera, X } from 'lucide-react';
import BaseModal from '../common/BaseModal';

export interface CloudinaryImage {
  url: string;
  publicId: string;
}

export interface EditProfileData {
  first_name: string;
  last_name: string;
  phone_number?: string;
  company_email: string;
  profile_picture?: CloudinaryImage | null;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: EditProfileData;
  onSuccess: () => void;
}

interface FormData {
  first_name: string;
  last_name: string;
  phone_number: string;
}

type FormField = keyof FormData;

const MAX_PROFILE_PICTURE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Form state.
   *
   * We initialize this from initialData when the component is created.
   * Field changes are then handled explicitly through handleFieldChange.
   */
  const [formData, setFormData] = useState<FormData>({
    first_name: initialData.first_name || '',
    last_name: initialData.last_name || '',
    phone_number: initialData.phone_number || '',
  });

  /**
   * Keep the original Cloudinary image separately.
   *
   * This allows us to determine whether the user actually changed
   * their profile picture.
   */
  const [currentProfilePicture] = useState<CloudinaryImage | null>(
    initialData.profile_picture ?? null,
  );

  /**
   * The actual File selected by the user.
   *
   * This is what gets appended to FormData and sent to the API.
   */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /**
   * Local preview URL for a newly selected image.
   */
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData.profile_picture?.url ?? null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  /**
   * Handles all normal form field changes.
   */
  const handleFieldChange = (field: FormField, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    // Clear the previous validation error while the user edits.
    if (error) {
      setError(undefined);
    }
  };

  /**
   * Handles profile picture selection.
   */
  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type.
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Profile picture must be a JPG, PNG, or WEBP image.');
      event.target.value = '';
      return;
    }

    // Validate file size.
    if (file.size > MAX_PROFILE_PICTURE_SIZE) {
      setError('Profile picture must be less than 5MB.');
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    setError(undefined);

    /**
     * Create a temporary preview.
     *
     * This URL is only for the browser preview.
     * The actual File is stored in selectedFile and sent to the API.
     */
    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  /**
   * Remove the newly selected profile picture.
   *
   * If there was already a Cloudinary image, we restore it.
   */
  const handleRemoveProfilePicture = () => {
    setSelectedFile(null);

    setPreviewUrl(currentProfilePicture?.url ?? null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setError(undefined);
  };

  /**
   * Validate the form before submitting.
   */
  const validateForm = (): string | undefined => {
    const firstName = formData.first_name.trim();
    const lastName = formData.last_name.trim();
    const phoneNumber = formData.phone_number.trim();

    if (!firstName) {
      return 'First name is required.';
    }

    if (firstName.length < 2) {
      return 'First name must be at least 2 characters.';
    }

    if (firstName.length > 100) {
      return 'First name cannot exceed 100 characters.';
    }

    if (!lastName) {
      return 'Last name is required.';
    }

    if (lastName.length < 2) {
      return 'Last name must be at least 2 characters.';
    }

    if (lastName.length > 100) {
      return 'Last name cannot exceed 100 characters.';
    }

    if (phoneNumber && phoneNumber.length > 100) {
      return 'Phone number cannot exceed 100 characters.';
    }

    /**
     * Basic phone validation.
     *
     * Allows:
     * +234 801 234 5678
     * 08012345678
     * +234-801-234-5678
     */
    if (phoneNumber && !/^[+]?[0-9][0-9\s\-()]{6,99}$/.test(phoneNumber)) {
      return 'Please enter a valid phone number.';
    }

    return undefined;
  };

  /**
   * Determines whether the user actually changed anything.
   */
  const hasChanges = (): boolean => {
    const firstNameChanged =
      formData.first_name.trim() !== initialData.first_name;

    const lastNameChanged = formData.last_name.trim() !== initialData.last_name;

    const phoneNumberChanged =
      formData.phone_number.trim() !== (initialData.phone_number ?? '');

    /**
     * A selected file means the profile picture changed.
     */
    const profilePictureChanged = selectedFile !== null;

    return (
      firstNameChanged ||
      lastNameChanged ||
      phoneNumberChanged ||
      profilePictureChanged
    );
  };

  /**
   * Submit only fields that have actually changed.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(undefined);

    /**
     * Validate before doing anything with the API.
     */
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    /**
     * Don't make an unnecessary API request.
     */
    if (!hasChanges()) {
      setError('No changes were made to your profile.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      /**
       * Only append changed text fields.
       */
      if (formData.first_name.trim() !== initialData.first_name) {
        payload.append('first_name', formData.first_name.trim());
      }

      if (formData.last_name.trim() !== initialData.last_name) {
        payload.append('last_name', formData.last_name.trim());
      }

      if (formData.phone_number.trim() !== (initialData.phone_number ?? '')) {
        payload.append('phone_number', formData.phone_number.trim());
      }

      /**
       * Only append profile_picture when a new File
       * was actually selected.
       */
      if (selectedFile) {
        payload.append('profile_picture', selectedFile);
      }

      /**
       * Replace this with your actual API call.
       *
       * Example:
       *
       * await authApi.updateProfile(payload);
       */
      // await authApi.updateProfile(payload);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);

      setError(
        'Failed to update profile. Please check your connection and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials =
    `${formData.first_name?.[0] ?? ''}${
      formData.last_name?.[0] ?? ''
    }`.toUpperCase() || 'U';

  return (
    <BaseModal
      isOpen={isOpen}
      title="Edit Personal Details"
      subtitle="Update your name and contact information."
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Update Profile"
      error={error}
    >
      <div className="space-y-5">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={`${formData.first_name} ${formData.last_name}`}
                className="h-16 w-16 rounded-full border border-slate-700 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-lg font-bold text-cyan-400">
                {initials}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-900 bg-cyan-600 text-white transition-colors hover:bg-cyan-500"
              aria-label="Change profile picture"
            >
              <Camera size={11} />
            </button>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200">
              Profile Picture
            </p>

            <p className="mt-0.5 text-[10px] text-slate-500">
              JPG, PNG or WEBP · Maximum 5MB
            </p>

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
              >
                Change photo
              </button>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleRemoveProfilePicture}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 transition-colors hover:text-red-400"
                >
                  <X size={12} />
                  Cancel
                </button>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleProfilePictureChange}
          />
        </div>

        {/* Name Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="first_name"
              className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
            >
              First Name
            </label>

            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />

              <input
                id="first_name"
                type="text"
                required
                maxLength={100}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                value={formData.first_name}
                onChange={(e) =>
                  handleFieldChange('first_name', e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="last_name"
              className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
            >
              Last Name
            </label>

            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />

              <input
                id="last_name"
                type="text"
                required
                maxLength={100}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                value={formData.last_name}
                onChange={(e) => handleFieldChange('last_name', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
          >
            Phone Number
          </label>

          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />

            <input
              id="phone"
              type="tel"
              maxLength={100}
              placeholder="+234..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
              value={formData.phone_number}
              onChange={(e) =>
                handleFieldChange('phone_number', e.target.value)
              }
            />
          </div>
        </div>

        {/* Read-only Email Notice */}
        <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
          <Info className="shrink-0 text-blue-500" size={16} />

          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-blue-900">
              Email & Role Management
            </p>

            <p className="text-[10px] leading-relaxed text-blue-700">
              Your email ({initialData.company_email}) and workspace role are
              managed by your organization administrator for security purposes.
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
