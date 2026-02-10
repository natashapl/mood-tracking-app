import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        setSuccess('Account created! Please check your email to confirm your account, then sign in.');
        // Switch to login mode after successful signup
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 5000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message || 'Failed to sign in with Google');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f5f5ff] from-73% to-[#e0e0ff] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-mood-blue-100 p-8 w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <img
            src="/src/assets/images/logo.svg"
            alt="Mood Tracker logo"
            className="mx-auto mb-6"
            width="178"
            height="40"
          />
          <h1 className="text-[32px]/[1.4] font-bold mb-2">
            {isLogin ? 'Welcome back!' : 'Create account'}
          </h1>
          <p className="text-[15px]/[1.4] text-mood-neutral-600">
            {isLogin
              ? 'Sign in to continue tracking your mood'
              : 'Start your mood tracking journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-[15px]/[1.4] font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                autoComplete="name"
                className="w-full px-4 py-3 rounded-lg border border-mood-neutral-300 focus:outline-none focus:ring-2 focus:ring-mood-blue-600"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-[15px]/[1.4] font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg border border-mood-neutral-300 focus:outline-none focus:ring-2 focus:ring-mood-blue-600"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[15px]/[1.4] font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="w-full px-4 py-3 rounded-lg border border-mood-neutral-300 focus:outline-none focus:ring-2 focus:ring-mood-blue-600"
              placeholder="Enter your password"
            />
            {!isLogin && (
              <p className="text-[13px]/[1.4] text-mood-neutral-600 mt-1">
                At least 6 characters
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-[14px]/[1.4]">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-[14px]/[1.4]">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-mood-blue-600 text-white text-[18px]/[1.4] px-8 py-3 rounded-lg hover:bg-mood-blue-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-mood-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-[14px]/[1.4]">
              <span className="bg-white px-4 text-mood-neutral-600">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="cursor-pointer mt-4 w-full flex items-center justify-center gap-3 bg-white text-mood-neutral-900 text-[16px]/[1.4] px-8 py-3 rounded-lg border border-mood-neutral-300 hover:bg-gray-50 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957273V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
              <path d="M9 3.57954C10.3214 3.57954 11.5077 4.03363 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957273 4.95818L3.96409 7.29C4.67182 5.16272 6.65591 3.57954 9 3.57954Z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="cursor-pointer text-[15px]/[1.4] text-mood-blue-600 hover:text-mood-blue-700 font-medium p-2"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
