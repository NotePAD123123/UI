import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Bot, Zap, Users, Building, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    name: 'User Standard',
    price: '€10',
    period: '/month',
    description: 'Perfect for individuals getting started',
    features: ['1 Chatbot (GPTOSS)', 'No automation', 'Basic support'],
    icon: <Bot className="h-6 w-6" />,
    popular: false
  },
  {
    name: 'User Premium',
    price: '€40',
    period: '/month',
    description: 'Enhanced features for power users',
    features: ['2 Chatbots (GPTOSS & Gemini)', 'No automation', 'Priority support'],
    icon: <Zap className="h-6 w-6" />,
    popular: true
  },
  {
    name: 'Business',
    price: '€60',
    period: '/month',
    description: 'Automation tools for growing teams',
    features: ['3 Chatbots', '3 Automation workflows', 'Business support'],
    icon: <Users className="h-6 w-6" />,
    popular: false
  },
  {
    name: 'Business Premium',
    price: '€100',
    period: '/month',
    description: 'Advanced automation for businesses',
    features: ['3 Chatbots', '10 Automation workflows', 'Phone support'],
    icon: <Building className="h-6 w-6" />,
    popular: false
  },
  {
    name: 'Corporate',
    price: '€120',
    period: '/month',
    description: 'Unlimited workflows with developer tools',
    features: ['3 Chatbots', 'Developer access', 'Unlimited automation', 'Onsite support'],
    icon: <Crown className="h-6 w-6" />,
    popular: false
  },
  {
    name: 'Corporate Premium',
    price: '€200',
    period: '/month',
    description: 'Full customization and premium support',
    features: ['3 Chatbots', 'Developer access', 'Unlimited automation', 'Custom options', 'Dedicated support'],
    icon: <Crown className="h-6 w-6 text-yellow-500" />,
    popular: false
  }
];

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI-Powered Business Automation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your business with intelligent chatbots and powerful automation workflows. 
            Start your free 3-day trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate(user ? '/app' : '/registration')}
            >
              {user ? 'Go to App' : 'Start Free Trial'}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/app')}
            >
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Perfect Plan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold">
                    {plan.price}<span className="text-lg font-normal text-gray-500">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate('/registration')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses already using our AI-powered automation platform.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => navigate('/registration')}
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </Layout>
  );
}