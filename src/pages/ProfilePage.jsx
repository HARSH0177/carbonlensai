import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Shield, Bell, Moon, Sun, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';

export default function ProfilePage() {
  const { user, isGuest, signOut } = useAuth();
  const { settings, updateSetting } = useSettings();
  const navigate = useNavigate();

  const handleSignOut = async () => { 
    await signOut(); 
    navigate('/'); 
  };

  const Toggle = ({ checked, onChange }) => (
    <div 
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`} />
    </div>
  );

  return (
    <PageWrapper className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>
        <Leaf className="text-green-500" /> My Eco Profile
      </h1>
      
      <Card variant="glass" className="mb-8 border-green-100">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white overflow-hidden shadow-xl" style={{ background: 'linear-gradient(135deg, var(--leaf), var(--teal))' }}>
            {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} />}
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>
              {user?.displayName || (isGuest ? 'Explorer (Guest)' : 'Carbon Hero')}
            </h2>
            <p className="text-lg mt-1" style={{ color: 'var(--muted)' }}>{user?.email || 'Demo Mode Active'}</p>
            {isGuest && <button onClick={() => navigate('/auth')} className="mt-3 text-sm font-semibold hover:underline" style={{ color: 'var(--leaf)' }}>Sign in to save data across devices</button>}
          </div>
        </div>
      </Card>

      <div className="space-y-4 mb-8">
        <h3 className="font-bold text-xl ml-2 mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>Preferences</h3>
        
        {/* Appearance Settings */}
        <Card className="p-5 flex items-center justify-between transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--green-50)', color: 'var(--leaf)' }}>
              {settings.theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
            </div>
            <div>
              <h4 className="font-semibold text-lg" style={{ color: 'var(--forest)' }}>Appearance</h4>
              <p className="text-sm text-gray-400">Toggle dark mode</p>
            </div>
          </div>
          <Toggle 
            checked={settings.theme === 'dark'} 
            onChange={(v) => updateSetting('theme', v ? 'dark' : 'light')} 
          />
        </Card>

        {/* Currency Settings */}
        <Card className="p-5 flex items-center justify-between transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--green-50)', color: 'var(--leaf)' }}>
              <Settings size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-lg" style={{ color: 'var(--forest)' }}>Currency</h4>
              <p className="text-sm text-gray-400">Choose your display currency</p>
            </div>
          </div>
          <select 
            value={settings.currency} 
            onChange={(e) => updateSetting('currency', e.target.value)}
            className="p-2 border border-gray-200 rounded-lg outline-none font-medium focus:border-green-500 bg-white text-gray-700"
          >
            <option value="INR">₹ (INR)</option>
            <option value="USD">$ (USD)</option>
            <option value="EUR">€ (EUR)</option>
          </select>
        </Card>

        {/* Notifications */}
        <Card className="p-5 flex items-center justify-between transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--green-50)', color: 'var(--leaf)' }}>
              <Bell size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-lg" style={{ color: 'var(--forest)' }}>Notifications</h4>
              <p className="text-sm text-gray-400">Weekly digest and carbon alerts</p>
            </div>
          </div>
          <Toggle 
            checked={settings.notifications} 
            onChange={(v) => updateSetting('notifications', v)} 
          />
        </Card>

        {/* Privacy */}
        <Card className="p-5 flex items-center justify-between transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--green-50)', color: 'var(--leaf)' }}>
              <Shield size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-lg" style={{ color: 'var(--forest)' }}>Data Privacy</h4>
              <p className="text-sm text-gray-400">Contribute anonymous data to research</p>
            </div>
          </div>
          <Toggle 
            checked={settings.privacyShareData} 
            onChange={(v) => updateSetting('privacyShareData', v)} 
          />
        </Card>
      </div>

      <div className="flex justify-center mt-12">
        <button onClick={handleSignOut} className="flex items-center gap-2 px-8 py-4 text-red-500 hover:text-white hover:bg-red-500 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md">
          <LogOut size={20} /> {isGuest ? 'Exit Demo Mode' : 'Sign Out'}
        </button>
      </div>
    </PageWrapper>
  );
}
