import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Crown, ArrowLeft, CheckCircle2, Camera, Building2 } from 'lucide-react';
import type { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('model');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      setStep(2);
      return;
    }

    const result = await register(formData.email, formData.password, selectedRole, formData.name);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || t('auth.register.errors.failed'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-4 -ml-4 text-gray-600"
          onClick={() => step === 1 ? navigate('/') : setStep(1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step === 1 ? t('auth.register.backToHome') : t('auth.register.back')}
        </Button>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {step === 1 ? t('auth.register.title') : t('auth.register.step2')}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? t('auth.register.subtitle')
                : t('auth.register.subtitleRole')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-12 h-1 rounded ${step >= 2 ? 'bg-amber-500' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('auth.register.fullName')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={t('auth.register.fullNamePlaceholder')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.register.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.register.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.register.passwordPlaceholder')}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t('auth.register.passwordHint')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('auth.register.confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    {t('auth.register.continue')}
                  </Button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('model')}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        selectedRole === 'model'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        selectedRole === 'model' ? 'bg-amber-500' : 'bg-gray-100'
                      }`}>
                        <Camera className={`w-7 h-7 ${selectedRole === 'model' ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t('auth.register.imModel')}</h3>
                      <p className="text-sm text-gray-500">{t('auth.register.findOpportunities')}</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('agency')}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        selectedRole === 'agency'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        selectedRole === 'agency' ? 'bg-amber-500' : 'bg-gray-100'
                      }`}>
                        <Building2 className={`w-7 h-7 ${selectedRole === 'agency' ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t('auth.register.imAgency')}</h3>
                      <p className="text-sm text-gray-500">{t('auth.register.discoverTalent')}</p>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        {selectedRole === 'model' 
                          ? t('auth.register.modelFeature1')
                          : t('auth.register.agencyFeature1')}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        {selectedRole === 'model'
                          ? t('auth.register.modelFeature2')
                          : t('auth.register.agencyFeature2')}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        {t('auth.register.freeFeature')}
                      </span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? t('auth.register.creatingAccount') : t('auth.register.createAccount')}
                  </Button>
                </>
              )}
            </form>

            {step === 1 && (
              <p className="text-center text-sm text-gray-600">
                {t('auth.register.alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                  {t('auth.register.signIn')}
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          {t('auth.register.agreeTerms')}{' '}
          <Link to="/terms" className="text-amber-600 hover:underline">{t('auth.register.terms')}</Link>
          {' '}{t('auth.register.and')}{' '}
          <Link to="/privacy" className="text-amber-600 hover:underline">{t('auth.register.privacy')}</Link>
        </p>
      </div>
    </div>
  );
}
