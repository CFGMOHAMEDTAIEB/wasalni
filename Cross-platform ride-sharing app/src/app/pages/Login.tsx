import { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User2, Car, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>('normal');

  const handleLogin = (role: UserRole) => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    // Simulate login with the selected role
    login({
      id: Math.random().toString(),
      name: email.split('@')[0],
      email,
      role,
      verified: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      rating: role === 'owner' ? 4.8 : undefined,
      reviews: role === 'owner' ? 42 : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Covoiturage Tunisie
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Choose your role and sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin(activeRole);
                    }
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Select Your Role</Label>
              <div className="space-y-2">
                {/* Normal User */}
                <button
                  onClick={() => setActiveRole('normal')}
                  className={`w-full p-4 border-2 rounded-lg transition-all text-left ${activeRole === 'normal'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <User2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Normal User</p>
                      <p className="text-sm text-gray-600">
                        Browse rides, messages & notifications
                      </p>
                    </div>
                  </div>
                </button>

                {/* Vehicle Owner */}
                <button
                  onClick={() => setActiveRole('owner')}
                  className={`w-full p-4 border-2 rounded-lg transition-all text-left ${activeRole === 'owner'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Vehicle Owner</p>
                      <p className="text-sm text-gray-600">
                        Post rides, manage requests & CRUD operations
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={() => handleLogin(activeRole)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Sign In
            </Button>

            {/* Guest Option */}
            <div className="text-center text-sm text-gray-600">
              or continue as <span className="font-semibold">Guest</span> to browse rides
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-900">👥 Guest</p>
            <p className="text-gray-600">Browse all rides</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-900">🔐 Member</p>
            <p className="text-gray-600">Full access & features</p>
          </div>
        </div>
      </div>
    </div>
  );
}
