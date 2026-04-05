import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User2, Car, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { apiClient } from '../services/apiClient';

interface EmailValidation {
  checking: boolean;
  exists: boolean;
  checked: boolean;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: UserRole;
  termsAccepted: boolean;
}

export function Register() {
  const navigate = useNavigate();
  const { registerWithAPI, isLoading: authLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'normal',
    termsAccepted: false,
  });

  const [showPasswords, setShowPasswords] = useState({ password: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailValidation, setEmailValidation] = useState<EmailValidation>({
    checking: false,
    exists: false,
    checked: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  // Debounced email validation
  useEffect(() => {
    if (!formData.email) {
      setEmailValidation({ checking: false, exists: false, checked: false });
      return;
    }

    const validateEmail = async () => {
      setEmailValidation({ checking: true, exists: false, checked: false });
      try {
        const response = await apiClient.checkUserExists(formData.email);
        setEmailValidation({
          checking: false,
          exists: response.exists,
          checked: true,
        });
        if (response.exists) {
          setErrors(prev => ({ ...prev, email: 'Email already registered' }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.email;
            return newErrors;
          });
        }
      } catch (error) {
        console.error('Email validation error:', error);
        setEmailValidation({ checking: false, exists: false, checked: false });
      }
    };

    const timer = setTimeout(validateEmail, 500);
    return () => clearTimeout(timer);
  }, [formData.email]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (emailValidation.exists) newErrors.email = 'Email already registered';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) newErrors.terms = 'You must accept the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLocalError('');
    clearError();

    try {
      await registerWithAPI(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        formData.role
      );
      // Small delay to ensure AuthContext state is fully updated
      await new Promise(resolve => setTimeout(resolve, 100));
      // Auto-redirect to dashboard after successful registration
      // The user is now logged in and the AuthContext is updated
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      setLocalError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setLocalError('');
  };

  const errorMessage = localError || authError;

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
        .auth-input {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
        .email-valid {
          border-color: #10b981 !important;
        }
        .email-invalid {
          border-color: #ef4444 !important;
        }
      `}</style>

      <div className="w-full max-w-2xl space-y-6 auth-container">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 text-white mb-4" style={{animation: 'slideInUp 0.6s ease-out'}}>
            <User2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-blue-600 bg-clip-text text-transparent">
            WASALNI
          </h1>
          <p className="text-gray-600 text-lg">Create your account to get started</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="destructive" className="auth-card animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Registration Card */}
        <Card className="auth-card border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-blue-50 rounded-t-lg">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Choose your role and provide your information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="normal" className="gap-2">
                  <User2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Passenger</span>
                </TabsTrigger>
                <TabsTrigger value="owner" className="gap-2">
                  <Car className="w-4 h-4" />
                  <span className="hidden sm:inline">Driver</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleRegister} className="space-y-5">
                <TabsContent value="normal" className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Browse available rides, book seats, and connect with drivers.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="owner" className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Post your trips and earn money by offering rides to others.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`auth-input ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-brand-primary`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className={`auth-input pr-10 ${
                          errors.email
                            ? 'border-red-500'
                            : emailValidation.checked
                            ? emailValidation.exists
                              ? 'email-invalid'
                              : 'email-valid'
                            : 'border-gray-200'
                        } focus:border-brand-primary`}
                      />
                      {emailValidation.checking && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                      )}
                      {emailValidation.checked && !emailValidation.checking && (
                        <>
                          {emailValidation.exists ? (
                            <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                          )}
                        </>
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.email}
                      </p>
                    )}
                    {emailValidation.checked && !emailValidation.exists && !errors.email && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Email available
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`auth-input ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:border-brand-primary`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPasswords.password ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className={`auth-input pr-10 ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:border-brand-primary`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, password: !prev.password }))}
                        disabled={isSubmitting}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPasswords.password ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.password}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">At least 8 characters</p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className={`auth-input pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:border-brand-primary`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        disabled={isSubmitting}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="terms"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer flex-1">
                    I agree to the{' '}
                    <button type="button" className="text-brand-primary hover:underline font-medium">
                      Terms and Conditions
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-brand-primary hover:underline font-medium">
                      Privacy Policy
                    </button>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> {errors.terms}
                  </p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/90 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  size="lg"
                >
                  {isSubmitting || authLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}