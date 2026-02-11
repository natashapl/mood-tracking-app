import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { uploadAvatar } from '../utils/supabaseStorage';
import closeIcon from '../assets/images/icon-close.svg';
import avatarPlaceholder from '../assets/images/avatar-placeholder.svg';

type SettingsModalProps = {
  onClose: () => void;
};

const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const { profile, user, updateProfile } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const { url, error: uploadError } = await uploadAvatar(file, user.id);

      if (uploadError || !url) {
        throw uploadError || new Error('Failed to upload avatar');
      }

      await updateProfile({ avatar_url: url });
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await updateProfile({ name: name.trim() });

      if (updateError) {
        throw updateError;
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center fixed w-full top-0 left-0 right-0 z-60">
      <div className="bg-white z-50 rounded-xl shadow-lg w-5/6 max-w-[500px] min-w-[335px] relative top-10">
        <div className="p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 cursor-pointer"
          >
            <img
              src={closeIcon}
              alt="close"
              className="w-[15px] h-[15px] object-contain"
              width="15"
              height="15"
            />
          </button>

          <h2 className="text-[32px]/[1.4] font-bold mb-2">Update your profile</h2>
          <p className="text-[18px]/[1.4] text-mood-neutral-600 mb-6">Personalize your account with your name and photo.</p>

          {/* Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-[15px]/[1.4] font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-mood-neutral-300 focus:outline-none focus:ring-2 focus:ring-mood-blue-600"
              placeholder="Enter your name"
            />
          </div>

          {/* Avatar */}
          <div className="mb-6">
            <label className="block text-[15px]/[1.4] font-medium mb-3">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src={profile?.avatar_url || avatarPlaceholder}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  width="80"
                  height="80"
                />
              </div>
              <div>
                <button
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="cursor-pointer bg-mood-blue-600 text-white text-[15px]/[1.4] px-4 py-2 rounded-lg hover:bg-mood-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Change Photo'}
                </button>
                <p className="text-[13px]/[1.4] text-mood-neutral-600 mt-2">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-[14px]/[1.4] mb-4">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 bg-gray-200 text-mood-neutral-900 text-[18px]/[1.4] px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="cursor-pointer flex-1 bg-mood-blue-600 text-white text-[18px]/[1.4] px-6 py-3 rounded-lg hover:bg-mood-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={onClose}
        className="overlay w-full h-full fixed inset-0 z-40 bg-mood-neutral-900 opacity-70 cursor-pointer"
      />
    </div>
  );
};

export default SettingsModal;
