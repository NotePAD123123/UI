import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Bot, Zap, Users, Building, Crown } from 'lucide-react';
import { toast } from 'sonner';

const plans = [
  {
    id: 'user-standard',
    name: 'User Standard',
    price: 10,
    description: '1 Chatbot (GPTOSS), No automation',
    features: ['1 Chatbot (GPTOSS)', 'No automation', 'Basic support'],
    icon: <Bot className="h-5 w-5" />
  },
  {
    id: 'user-premium',
    name: 'User Premium',
    price: 40,
    description: '2 Chatbots (GPTOSS & Gemini), No automation',
    features: ['2 Chatbots (GPTOSS & Gemini)', 'No automation', 'Priority support'],
    icon: <Zap className="h-5 w-5" />,
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    price: 60,
    description: '3 Chatbots & 3 Automation workflows',
    features: ['3 Chatbots', '3 Automation workflows', 'Business support'],
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 'business-premium',
    name: 'Business Premium',
    price: 100,
    description: '3 Chatbots & 10 Automation workflows',
    features: ['3 Chatbots', '10 Automation workflows', 'Phone support'],
    icon: <Building className="h-5 w-5" />
  },
  {
    id: 'corporate',
    name: 'Corporate',
    price: 120,
    description: '3 Chatbots, Developer & Unlimited automation',
    features: ['3 Chatbots', 'Developer access', 'Unlimited automation', 'Onsite support'],
    icon: <Crown className="h-5 w-5" />
  },
  {
    id: 'corporate-premium',
    name: 'Corporate Premium',
    price: 200,
    description: '3 Chatbots, Developer & Unlimited automation & Custom options',
    features: ['3 Chatbots', 'Developer access', 'Unlimited automation', 'Custom options', 'Dedicated support'],
    icon: <Crown className="h-5 w-5 text-yellow-500" />
  }
];

export default function Registration() {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to User Premium
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.surname,
        selectedPlan.id
      );

      if (success) {
        toast.success('Registration successful! Please verify your email.');
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        toast.error('Registration failed. Email may already be in use.');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-gray-600">Select the perfect plan for your needs and create your account</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plan Selection */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Select Plan</h2>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer transition-all ${
                      selectedPlan.id === plan.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {plan.icon}
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {plan.name}
                              {plan.popular && <Badge variant="secondary">Popular</Badge>}
                            </CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">€{plan.price}</div>
                          <div className="text-sm text-gray-500">/month</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Registration Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Account</CardTitle>
                  <CardDescription>
                    Fill in your details to get started with your {selectedPlan.name} plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">First Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="surname">Last Name</Label>
                        <Input
                          id="surname"
                          type="text"
                          value={formData.surname}
                          onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">Selected Plan:</span>
                        <span className="text-lg font-bold">€{selectedPlan.price}/month</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        You'll start with a 3-day free trial. No payment required now.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Start Free Trial'}
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
                        Sign in
                      </Button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}