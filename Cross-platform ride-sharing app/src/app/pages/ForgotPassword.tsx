import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../services/apiClient';

type Step = 'email' | 'verification' | 'reset' | 'success';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await apiClient.requestPasswordReset(email);
      setSuccessMessage(`A password reset link has been sent to ${email}`);
      setStep('verification');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Please enter the verification code');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.resetPassword({ token, newPassword });
      setSuccessMessage('Your password has been reset successfully!');
      setStep('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-blue-50 to-white flex items-center justify-center px-4 py-12">
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
        .auth-container {
          animation: slideInUp 0.6s ease-out;
        }
        .auth-card {
          animation: slideInUp 0.6s ease-out 0.1s both;
        }
      `}</style>

      <div className="w-full max-w-md space-y-6 auth-container">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 text-white mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600">Recover access to your WASALNI account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="auth-card">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {successMessage && step !== 'success' && (
          <Alert className="bg-green-50 border-green-200 auth-card">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Card */}
        <Card className="auth-card border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-blue-50">
            <CardTitle>
              {step === 'email' && 'Request Reset'}
              {step === 'verification' && 'Verify Code'}
              {step === 'reset' && 'Create New Password'}
              {step === 'success' && 'Password Reset'}
            </CardTitle>
            <CardDescription>
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'verification' && 'Check your email for the verification code'}
              {step === 'reset' && 'Enter your new password'}
              {step === 'success' && 'Your password has been successfully reset'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Step 1: Email */}
            {step === 'email' && (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-200 focus:border-brand-primary focus:ring-brand-primary"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/90 hover:to-blue-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: Verification Code */}
            {step === 'verification' && (
              <form
                onSubmit={() => setStep('reset')}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter code from email"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-200 focus:border-brand-primary focus:ring-brand-primary"
                  />
                  <p className="text-xs text-gray-500">Check your email for the verification code</p>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/90 hover:to-blue-700 text-white"
                  size="lg"
                >
                  Verify Code
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('email')}
                  className="w-full"
                >
                  Back
                </Button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      className="border-gray-200 focus:border-brand-primary focus:ring-brand-primary pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">At least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-200 focus:border-brand-primary focus:ring-brand-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/90 hover:to-blue-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('verification')}
                  className="w-full"
                >
                  Back
                </Button>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
                  <p className="text-gray-600 mb-4">Your password has been successfully reset.</p>
                  <p className="text-sm text-gray-500 mb-4">Redirecting to login...</p>
                </div>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/90 hover:to-blue-700 text-white"
                  size="lg"
                >
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
