import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Crown, 
  Users, 
  Building2, 
  Star, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle2,
  Camera,
  MessageSquare,
  Wallet,
  Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9">
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ru')}>
          Русский
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: Users,
      title: t('landing.features.forModels.title'),
      description: t('landing.features.forModels.description'),
      color: 'bg-pink-500',
    },
    {
      icon: Building2,
      title: t('landing.features.forAgencies.title'),
      description: t('landing.features.forAgencies.description'),
      color: 'bg-blue-500',
    },
    {
      icon: Zap,
      title: t('landing.features.instantConnections.title'),
      description: t('landing.features.instantConnections.description'),
      color: 'bg-amber-500',
    },
    {
      icon: Shield,
      title: t('landing.features.verifiedProfiles.title'),
      description: t('landing.features.verifiedProfiles.description'),
      color: 'bg-green-500',
    },
  ];

  const stats = [
    { value: '10K+', label: t('landing.hero.stats.activeModels') },
    { value: '500+', label: t('landing.hero.stats.agencies') },
    { value: '50+', label: t('landing.hero.stats.countries') },
    { value: '25K+', label: t('landing.hero.stats.successfulMatches') },
  ];

  const howItWorks = [
    {
      step: '01',
      title: t('landing.howItWorks.step1.title'),
      description: t('landing.howItWorks.step1.description'),
      icon: Camera,
    },
    {
      step: '02',
      title: t('landing.howItWorks.step2.title'),
      description: t('landing.howItWorks.step2.description'),
      icon: MessageSquare,
    },
    {
      step: '03',
      title: t('landing.howItWorks.step3.title'),
      description: t('landing.howItWorks.step3.description'),
      icon: Wallet,
    },
  ];

  const testimonials = [
    {
      name: 'Anna Petrova',
      role: 'Fashion Model',
      content: t('landing.testimonials.anna'),
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      name: 'James Wilson',
      role: 'Agency Director',
      content: t('landing.testimonials.james'),
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      name: 'Maria Garcia',
      role: 'Commercial Model',
      content: t('landing.testimonials.maria'),
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  const pricingPlans = [
    {
      name: t('landing.pricing.free.name'),
      price: 0,
      period: 'forever',
      description: t('landing.pricing.free.description'),
      features: [
        t('landing.pricing.free.feature1'),
        t('landing.pricing.free.feature2'),
        t('landing.pricing.free.feature3'),
        t('landing.pricing.free.feature4'),
      ],
      cta: t('landing.pricing.free.cta'),
      popular: false,
    },
    {
      name: t('landing.pricing.plus.name'),
      price: 29,
      period: 'month',
      description: t('landing.pricing.plus.description'),
      features: [
        t('landing.pricing.plus.feature1'),
        t('landing.pricing.plus.feature2'),
        t('landing.pricing.plus.feature3'),
        t('landing.pricing.plus.feature4'),
        t('landing.pricing.plus.feature5'),
      ],
      cta: t('landing.pricing.plus.cta'),
      popular: true,
    },
    {
      name: t('landing.pricing.pro.name'),
      price: 99,
      period: 'month',
      description: t('landing.pricing.pro.description'),
      features: [
        t('landing.pricing.pro.feature1'),
        t('landing.pricing.pro.feature2'),
        t('landing.pricing.pro.feature3'),
        t('landing.pricing.pro.feature4'),
        t('landing.pricing.pro.feature5'),
      ],
      cta: t('landing.pricing.pro.cta'),
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Crown className="w-7 h-7 text-amber-500" />
              <span className="text-xl font-bold">ModelMatch</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">{t('common.features')}</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">{t('common.howItWorks')}</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">{t('common.pricing')}</a>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Button variant="ghost" onClick={() => navigate('/login')}>
                {t('common.login')}
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-amber-500 hover:bg-amber-600"
              >
                {t('common.register')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-pink-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Trusted by 10,000+ models and 500+ agencies
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('landing.hero.title')}{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                {t('landing.hero.highlight')}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/register', { state: { role: 'model' } })}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-lg px-8"
              >
                <Users className="w-5 h-5 mr-2" />
                {t('common.imAModel')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/register', { state: { role: 'agency' } })}
                className="w-full sm:w-auto text-lg px-8"
              >
                <Building2 className="w-5 h-5 mr-2" />
                {t('common.imAnAgency')}
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Images */}
        <div className="hidden lg:block absolute top-1/4 left-10 w-48 h-64 rounded-2xl overflow-hidden shadow-2xl transform -rotate-6">
          <img 
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop" 
            alt="Model"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden lg:block absolute top-1/3 right-10 w-48 h-64 rounded-2xl overflow-hidden shadow-2xl transform rotate-6">
          <img 
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop" 
            alt="Model"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('landing.features.title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-4">{t('landing.howItWorks.title')}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-100" />
            
            {howItWorks.map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-amber-500/10 flex items-center justify-center mx-auto mb-8 relative z-10 group-hover:border-amber-500/30 transition-colors">
                  <item.icon className="w-10 h-10 text-amber-500" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-white text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('landing.pricing.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-lg relative overflow-hidden ${
                  plan.popular ? 'ring-2 ring-amber-500 scale-105 z-10' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                        : 'bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50'
                    }`}
                    onClick={() => navigate('/register')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('landing.cta.title')}
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              {t('landing.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto text-lg px-8"
              >
                {t('landing.cta.button')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-amber-500" />
                <span className="text-lg font-bold">ModelMatch</span>
              </div>
              <p className="text-gray-400 text-sm">
                {t('footer.about')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.forModels.title')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/register')} className="hover:text-white">{t('footer.forModels.createProfile')}</button></li>
                <li><button onClick={() => navigate('/models')} className="hover:text-white">{t('footer.forModels.findAgencies')}</button></li>
                <li><a href="#pricing" className="hover:text-white">{t('footer.forModels.pricing')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.forAgencies.title')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/register')} className="hover:text-white">{t('footer.forAgencies.postCastings')}</button></li>
                <li><button onClick={() => navigate('/models')} className="hover:text-white">{t('footer.forAgencies.searchModels')}</button></li>
                <li><a href="#pricing" className="hover:text-white">{t('footer.forAgencies.enterprise')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.support.title')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">{t('footer.support.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.support.contactUs')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.support.privacy')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              {t('footer.rights')}
            </p>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
