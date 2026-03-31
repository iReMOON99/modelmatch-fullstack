import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Crown, 
  Users, 
  Building2, 
  Star, 
  Zap, 
  Shield, 
  Globe,
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
      title: 'For Models',
      description: 'Create your portfolio, connect with top agencies, and find your next big opportunity.',
      color: 'bg-pink-500',
    },
    {
      icon: Building2,
      title: 'For Agencies',
      description: 'Discover fresh talent, manage castings, and streamline your booking process.',
      color: 'bg-blue-500',
    },
    {
      icon: Zap,
      title: 'Instant Connections',
      description: 'Direct messaging and contact exchange with verified industry professionals.',
      color: 'bg-amber-500',
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'All profiles are verified to ensure authentic connections in the industry.',
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
      title: 'Create Your Profile',
      description: 'Sign up and build your portfolio with photos, measurements, and experience.',
      icon: Camera,
    },
    {
      step: '02',
      title: 'Connect',
      description: 'Browse and connect with models or agencies that match your criteria.',
      icon: MessageSquare,
    },
    {
      step: '03',
      title: 'Collaborate',
      description: 'Exchange contacts, discuss opportunities, and start working together.',
      icon: Wallet,
    },
  ];

  const testimonials = [
    {
      name: 'Anna Petrova',
      role: 'Fashion Model',
      content: 'ModelMatch helped me find my dream agency in just two weeks. The platform is incredibly easy to use!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      name: 'James Wilson',
      role: 'Agency Director',
      content: 'We\'ve discovered amazing talent through this platform. The verification system gives us confidence.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      name: 'Maria Garcia',
      role: 'Commercial Model',
      content: 'The micro-payment system is perfect. I only pay for what I need, when I need it.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '15 profile views per day',
        '1 request per week',
        'Basic search filters',
        'Public profile',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Model Plus',
      price: 29,
      period: 'month',
      description: 'For serious models',
      features: [
        'Unlimited profile views',
        '10 contacts per month',
        'Priority in search',
        'Profile statistics',
        'No daily limits',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Agency Pro',
      price: 99,
      period: 'month',
      description: 'For professional agencies',
      features: [
        'Everything in Model Plus',
        'Mass messaging (100/month)',
        'API access',
        'Personal manager',
        'Advanced analytics',
      ],
      cta: 'Contact Sales',
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
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to connect talent with opportunity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How ModelMatch Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and start making connections
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-gray-200 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                  <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 ${plan.popular ? 'border-amber-500' : 'border-gray-200'} overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of models and agencies already connecting on ModelMatch
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto text-lg px-8"
              >
                Create Free Account
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
                Connecting talent with opportunity in the fashion industry.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Models</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Create Profile</a></li>
                <li><a href="#" className="hover:text-white">Find Agencies</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Agencies</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Post Castings</a></li>
                <li><a href="#" className="hover:text-white">Search Models</a></li>
                <li><a href="#" className="hover:text-white">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 ModelMatch. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 text-sm">English</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
