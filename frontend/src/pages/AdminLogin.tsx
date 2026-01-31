import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { api, setAuthToken } from '../services/api';
import StarBackground from '../components/StarBackground';

type LoginForm = {
  email: string;
  password: string;
};

export default function AdminLogin() {
  const { register, handleSubmit, formState } = useForm<LoginForm>();
  const navigate = useNavigate();
  
  const [error, setError] = useState<string | null>(null);
  
  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const params = new URLSearchParams();
    params.append('username', values.email);
    params.append('password', values.password);
    try {
      const res = await api.post<{ access_token: string; role: string }>('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      setAuthToken(res.data.access_token);
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/', { state: { message: 'You are subscribed to event updates at your email.' } });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
    }
  });

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-20">
      <StarBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="relative bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-white/10 hover:border-purple-500/50 transition-all duration-300 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-cyan-500/0 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Admin Login
              </h1>
              <p className="text-white/70 mt-4">
                Use your admin email and password to access the dashboard.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-white/90 mb-2 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                  placeholder="admin@hica.com"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-2 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password', { required: true })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-lg font-semibold text-white hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {formState.isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-300"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
