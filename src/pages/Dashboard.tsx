import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, CreditCard, User, Bot, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const updateTimer = () => {
      if (user.subscription.expiresAt) {
        const now = new Date().getTime();
        const expiry = new Date(user.subscription.expiresAt).getTime();
        const difference = expiry - now;

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  if (!user) return null;

  const getPlanDetails = (planId: string) => {
    const plans = {
      'user-standard': { name: 'User Standard', price: '€10', features: ['1 Chatbot (GPTOSS)', 'No automation', 'Basic support'] },
      'user-premium': { name: 'User Premium', price: '€40', features: ['2 Chatbots (GPTOSS & Gemini)', 'No automation', 'Priority support'] },
      'business': { name: 'Business', price: '€60', features: ['3 Chatbots', '3 Automation workflows', 'Business support'] },
      'business-premium': { name: 'Business Premium', price: '€100', features: ['3 Chatbots', '10 Automation workflows', 'Phone support'] },
      'corporate': { name: 'Corporate', price: '€120', features: ['3 Chatbots', 'Developer access', 'Unlimited automation', 'Onsite support'] },
      'corporate-premium': { name: 'Corporate Premium', price: '€200', features: ['3 Chatbots', 'Developer access', 'Unlimited automation', 'Custom options', 'Dedicated support'] }
    };
    return plans[planId as keyof typeof plans] || plans['user-standard'];
  };

  const planDetails = getPlanDetails(user.subscription.plan);
  const subscriptionProgress = user.subscription.status === 'trial' ? 100 : 
    (timeLeft.days + timeLeft.hours/24 + timeLeft.minutes/1440) / 30 * 100;

  return (
    <Layout>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">Manage your account and subscription settings</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Account Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{user.subscription.status}</div>
                <p className="text-xs text-muted-foreground">
                  {user.emailVerified ? 'Email verified' : 'Email not verified'}
                </p>
              </CardContent>
            </Card>

            {/* Current Plan */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{planDetails.name}</div>
                <p className="text-xs text-muted-foreground">
                  {planDetails.price}/month
                </p>
              </CardContent>
            </Card>

            {/* Time Remaining */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Remaining</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                </div>
                <p className="text-xs text-muted-foreground">
                  {timeLeft.seconds}s
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Subscription Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Details
                </CardTitle>
                <CardDescription>
                  Your current plan and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Plan:</span>
                  <Badge variant={user.subscription.status === 'active' ? 'default' : 'secondary'}>
                    {planDetails.name}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <Badge variant={user.subscription.status === 'active' ? 'default' : 'outline'}>
                    {user.subscription.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Time Remaining:</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(subscriptionProgress)}%
                    </span>
                  </div>
                  <Progress value={subscriptionProgress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Plan Features:</h4>
                  <ul className="text-sm space-y-1">
                    {planDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Zap className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {user.subscription.status === 'trial' && (
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/checkout')}
                  >
                    Upgrade Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Management
                </CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Account Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Name:</span> {user.name} {user.surname}</p>
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Member Since:</span> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/app')}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Access AI Platform
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/support')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Customer Support
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/settings')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}