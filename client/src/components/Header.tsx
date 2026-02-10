import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

type HeaderProps = {
  onOpenSettings?: () => void;
};

const Header = ({ onOpenSettings }: HeaderProps) => {
  const { profile, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setShowDropdown(false);
  };

  const handleSettings = () => {
    setShowDropdown(false);
    onOpenSettings?.();
  };

  return (
    <header className="max-w-[1170px] mx-auto flex justify-between items-center pb-12 lg:pb-16">
      <div className="flex items-center gap-2">
        <a href="/">
          <img
            src="/src/assets/images/logo.svg"
            alt="Mood Tracker logo"
            className="w-full h-full object-cover"
            width="178"
            height="40"
          />
        </a>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer hover:ring-2 hover:ring-mood-blue-600 transition"
        >
          <img
            src={profile?.avatar_url || "/src/assets/images/avatar-placeholder.svg"}
            alt="User Avatar"
            className="w-full h-full object-cover"
            width="40"
            height="40"
          />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-mood-blue-100 py-2 z-50">
            <div className="px-4 py-2 border-b border-mood-neutral-300">
              <p className="text-[15px]/[1.4] font-semibold text-mood-neutral-900">
                {profile?.name || 'User'}
              </p>
            </div>
            <button
              onClick={handleSettings}
              className="cursor-pointer w-full text-left px-4 py-2 text-[15px]/[1.4] text-mood-neutral-900 hover:bg-blue-50 transition"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full text-left px-4 py-2 text-[15px]/[1.4] text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
