import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User2, Car, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

interface FormData {
  // Common fields
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: UserRole;
  
  // Owner specific fields
  address?: string;
  city?: string;
  country?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  licensePlate?: string;
  accountHolder?: string;
  accountNumber?: string;
  bankCode?: string;
  termsAccepted: boolean;
}

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'normal',
    address: '',
    city: '',
    country: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    accountHolder: '',
    accountNumber: '',
    bankCode: '',
    termsAccepted: false,
  });

  const [showPasswords, setShowPasswords] = useState({ password: false, confirm: false });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';

    if (formData.role === 'owner') {
      if (!formData.address?.trim()) newErrors.address = 'Address is required for owners';
      if (!formData.city?.trim()) newErrors.city = 'City is required for owners';
      if (!formData.country?.trim()) newErrors.country = 'Country is required for owners';
      if (!formData.vehicleMake?.trim()) newErrors.vehicleMake = 'Vehicle make is required';
      if (!formData.vehicleModel?.trim()) newErrors.vehicleModel = 'Vehicle model is required';
      if (!formData.vehicleYear?.trim()) newErrors.vehicleYear = 'Vehicle year is required';
      if (!formData.licensePlate?.trim()) newErrors.licensePlate = 'License plate is required';
      if (!formData.accountHolder?.trim()) newErrors.accountHolder = 'Account holder name is required';
      if (!formData.accountNumber?.trim()) newErrors.accountNumber = 'Account number is required';
      if (!formData.bankCode?.trim()) newErrors.bankCode = 'Bank code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newUser = {
        id: Math.random().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role as UserRole,
        verified: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
        rating: formData.role === 'owner' ? 5.0 : undefined,
        reviews: formData.role === 'owner' ? 0 : undefined,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        vehicleDetails: formData.role === 'owner' ? {
          make: formData.vehicleMake || '',
          model: formData.vehicleModel || '',
          year: parseInt(formData.vehicleYear || '0'),
          licensePlate: formData.licensePlate || '',
        } : undefined,
        bankDetails: formData.role === 'owner' ? {
          accountHolder: formData.accountHolder || '',
          accountNumber: formData.accountNumber || '',
          bankCode: formData.bankCode || '',
        } : undefined,
      };

      login(newUser);

      // Animate redirect
      const loginPage = document.querySelector('body');
      if (loginPage) {
        loginPage.style.opacity = '0';
        loginPage.style.transform = 'translateY(-20px)';
        loginPage.style.transition = 'all 0.5s ease-out';
      }

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 300);

      setIsSubmitting(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rejoignez Wassalni
          </h1>
          <p className="text-gray-600">Créez votre compte pour commencer</p>
        </div>

        {/* Registration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>
              Choisissez votre rôle et complétez votre profil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="normal">
                  <User2 className="w-4 h-4 mr-2" />
                  Utilisateur
                </TabsTrigger>
                <TabsTrigger value="owner">
                  <Car className="w-4 h-4 mr-2" />
                  Propriétaire
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleRegister} className="space-y-6">
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom Complet *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name as any}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email as any}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone as any}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de Passe *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPasswords.password ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors.password ? 'border-red-500' : ''}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, password: !prev.password }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.password ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password as any}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le Mot de Passe *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword as any}</p>}
                  </div>
                </div>

                <TabsContent value="normal" className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      En tant qu'utilisateur normal, vous pouvez parcourir et réserver des trajets.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="owner" className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      En tant que propriétaire, vous devez fournir toutes vos informations pour la sécurité et la transparence.
                    </AlertDescription>
                  </Alert>

                  {/* Owner Personal Info */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <User2 className="w-5 h-5" />
                      Informations Personnelles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse *</Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder="123 Rue Principal"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && <p className="text-sm text-red-500">{errors.address as any}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="Tunis"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && <p className="text-sm text-red-500">{errors.city as any}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="country">Pays *</Label>
                        <Input
                          id="country"
                          name="country"
                          placeholder="Tunisie"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={errors.country ? 'border-red-500' : ''}
                        />
                        {errors.country && <p className="text-sm text-red-500">{errors.country as any}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      Détails du Véhicule
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleMake">Marque *</Label>
                        <Input
                          id="vehicleMake"
                          name="vehicleMake"
                          placeholder="Toyota"
                          value={formData.vehicleMake}
                          onChange={handleInputChange}
                          className={errors.vehicleMake ? 'border-red-500' : ''}
                        />
                        {errors.vehicleMake && <p className="text-sm text-red-500">{errors.vehicleMake as any}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vehicleModel">Modèle *</Label>
                        <Input
                          id="vehicleModel"
                          name="vehicleModel"
                          placeholder="Corolla"
                          value={formData.vehicleModel}
                          onChange={handleInputChange}
                          className={errors.vehicleModel ? 'border-red-500' : ''}
                        />
                        {errors.vehicleModel && <p className="text-sm text-red-500">{errors.vehicleModel as any}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vehicleYear">Année *</Label>
                        <Input
                          id="vehicleYear"
                          name="vehicleYear"
                          type="number"
                          placeholder="2020"
                          value={formData.vehicleYear}
                          onChange={handleInputChange}
                          className={errors.vehicleYear ? 'border-red-500' : ''}
                        />
                        {errors.vehicleYear && <p className="text-sm text-red-500">{errors.vehicleYear as any}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="licensePlate">Plaque d'immatriculation *</Label>
                        <Input
                          id="licensePlate"
                          name="licensePlate"
                          placeholder="TN 123 TN"
                          value={formData.licensePlate}
                          onChange={handleInputChange}
                          className={errors.licensePlate ? 'border-red-500' : ''}
                        />
                        {errors.licensePlate && <p className="text-sm text-red-500">{errors.licensePlate as any}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-lg mb-4">Détails Bancaires</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Cette information est nécessaire pour traiter les paiements et les commissions.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountHolder">Titulaire du Compte *</Label>
                        <Input
                          id="accountHolder"
                          name="accountHolder"
                          placeholder="Votre nom complet"
                          value={formData.accountHolder}
                          onChange={handleInputChange}
                          className={errors.accountHolder ? 'border-red-500' : ''}
                        />
                        {errors.accountHolder && <p className="text-sm text-red-500">{errors.accountHolder as any}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Numéro de Compte *</Label>
                        <Input
                          id="accountNumber"
                          name="accountNumber"
                          placeholder="IBAN"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          className={errors.accountNumber ? 'border-red-500' : ''}
                        />
                        {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber as any}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bankCode">Code Banque/SWIFT *</Label>
                        <Input
                          id="bankCode"
                          name="bankCode"
                          placeholder="SWIFT Code"
                          value={formData.bankCode}
                          onChange={handleInputChange}
                          className={errors.bankCode ? 'border-red-500' : ''}
                        />
                        {errors.bankCode && <p className="text-sm text-red-500">{errors.bankCode as any}</p>}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Terms Acceptance */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      id="terms"
                      name="termsAccepted"
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      J'accepte les conditions d'utilisation et la politique de confidentialité *
                    </Label>
                  </div>
                  {errors.termsAccepted && <p className="text-sm text-red-500">{errors.termsAccepted as any}</p>}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
                </Button>

                {/* Login Link */}
                <div className="text-center text-sm text-gray-600">
                  Vous avez déjà un compte?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Se connecter
                  </button>
                </div>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
