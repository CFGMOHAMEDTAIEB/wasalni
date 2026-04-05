import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User2, Car, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import '../styles/auth-animations.css';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithAPI, isLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>('normal');
  const [localError, setLocalError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setLocalError('');
    clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setLocalError('');
    clearError();
  };

  const validateForm = (): boolean => {
    if (!email || !password) {
      setLocalError('Please enter email and password');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async (role: UserRole) => {
    if (!validateForm()) return;

    setIsAnimating(true);
    try {
      await loginWithAPI(email, password, role);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      setLocalError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsAnimating(false);
    }
  };

  const errorMessage = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-blue-50 to-white flex items-center justify-center px-4 py-12 auth-page">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulse-light {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .auth-page {
          animation: fadeIn 0.6s ease-out;
        }
        .auth-container {
          animation: slideInUp 0.6s ease-out;
        }
        .auth-card {
          animation: slideInUp 0.6s ease-out 0.1s both;
        }
        .auth-input {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
        .btn-loading {
          animation: pulse-light 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-md space-y-6 auth-container">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 text-white mb-4">
            <Car className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-blue-600 bg-clip-text text-transparent">
            WASALNI
          </h1>
          <p className="text-gray-600 text-lg">Welcome back to your ride</p>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="auth-card">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Card className="auth-card border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-blue-50 rounded-t-lg">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Choose your role and enter your credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                className="auth-input border-gray-200 focus:border-brand-primary focus:ring-brand-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-brand-primary hover:text-brand-primary/80 font-medium transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleLogin(activeRole);
                    }
                  }}
                  className="auth-input border-gray-200 focus:border-brand-primary focus:ring-brand-primary pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Select Your Role</Label>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveRole('normal')}
                  disabled={isLoading}
                  className={`w-full p-4 border-2 rounded-lg transition-all text-left duration-300 transform hover:scale-105 ${
                    activeRole === 'normal'
                      ? 'border-brand-primary bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <User2 className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Passenger</p>
                      <p className="text-sm text-gray-600">Find and book rides</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveRole('owner')}
                  disabled={isLoading}
                  className={`w-full p-4 border-2 rounded-lg transition-all text-left duration-300 transform hover:scale-105 ${
                    activeRole === 'owner'
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Car className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Driver</p>
                      <p className="text-sm text-gray-600">Post rides, earn income</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <Button
              onClick={() => handleLogin(activeRole)}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/90 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isAnimating ? 'btn-loading' : ''
              }`}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-lg border border-gray-200 hover:border-brand-primary/30 transition-all hover:shadow-md">
            <p className="font-semibold text-gray-900 text-sm">🚗 Safe</p>
            <p className="text-xs text-gray-600">Verified drivers</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 hover:border-brand-primary/30 transition-all hover:shadow-md">
            <p className="font-semibold text-gray-900 text-sm">💰 Affordable</p>
            <p className="text-xs text-gray-600">Share costs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
