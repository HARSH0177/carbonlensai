import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';

export default function AuthPage() {
  const { signIn, continueAsGuest, user, isGuest } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user || isGuest) navigate('/dashboard');
  }, [user, isGuest, navigate]);

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center p-4">
      <Card variant="glass" className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-5" style={{ background: 'linear-gradient(135deg, var(--leaf), var(--teal))', boxShadow: '0 8px 30px rgba(22,163,74,0.3)' }}>
            <Leaf size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--forest)' }}>Welcome to CarbonLens</h1>
          <p style={{ color: 'var(--muted)' }}>Start tracking your footprint without the guilt.</p>
        </div>
        <div className="space-y-4">
          <button onClick={signIn} className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:shadow-md transition-all">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <button onClick={continueAsGuest} className="w-full px-6 py-3.5 text-white rounded-xl font-semibold hover:scale-[1.02] transition-all" style={{ background: 'var(--leaf)', boxShadow: '0 4px 14px rgba(22,163,74,0.25)' }}>
            🎯 Try the Demo First
          </button>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">By continuing, you agree to our Terms of Service. No data is stored without your consent.</p>
      </Card>
    </PageWrapper>
  );
}
