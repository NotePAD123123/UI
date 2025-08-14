import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const plans = {
  'user-standard': { name: 'User Standard', price: 10, features: ['1 Chatbot (GPTOSS)', 'No automation', 'Basic support'] },
  'user-premium': { name: 'User Premium', price: 40, features: ['2 Chatbots (GPTOSS & Gemini)', 'No automation', 'Priority support'] },
  'business': { name: 'Business', price: 60, features: ['3 Chatbots', '3 Automation workflows', 'Business support'] },
  'business-premium': { name: 'Business Premium', price: 100, features: ['3 Chatbots', '10 Automation workflows', 'Phone support'] },
  'corporate': { name: 'Corporate', price: 120, features: ['3 Chatbots', 'Developer access', 'Unlimited automation', 'Onsite support'] },
  'corporate-premium': { name: 'Corporate Premium', price: 200, features: ['3 Chatbots', 'Developer access', 'Unlimited automation', 'Custom options', 'Dedicated support'] }
};

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(user?.subscription.plan || 'user-premium');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if plan was passed from registration
    const searchParams = new URLSearchParams(location.search);
    const planFromUrl = searchParams.get('plan');
    if (planFromUrl && plans[planFromUrl as keyof typeof plans]) {
      setSelectedPlan(planFromUrl);
    }
  }, [user, navigate, location.search]);

  if (!user) return null;

  const currentPlan = plans[selectedPlan as keyof typeof plans];
  const discount = billingPeriod === 'annual' ? 0.2 : 0; // 20% discount for annual
  const monthlyPrice = currentPlan.price;
  const annualPrice = currentPlan.price * 12 * (1 - discount);
  const displayPrice = billingPeriod === 'monthly' ? monthlyPrice : annualPrice;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate card number (simple validation)
    if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }

    // Validate expiry date
    if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      toast.error('Please enter expiry date in MM/YY format');
      return;
    }

    // Validate CVV
    if (paymentData.cvv.length !== 3) {
      toast.error('Please enter a valid 3-digit CVV');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate successful payment (90% success rate)
      const paymentSuccess = Math.random() > 0.1;

      if (paymentSuccess) {
        // Update user subscription in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: { id: string }) => u.id === user.id);
        
        if (userIndex !== -1) {
          users[userIndex].subscription = {
            plan: selectedPlan,
            expiresAt: new Date(Date.now() + (billingPeriod === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
            status: 'active'
          };
          localStorage.setItem('users', JSON.stringify(users));
          
          // Update current user session
          const updatedUser = { ...user, subscription: users[userIndex].subscription };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        toast.success('Payment successful! Redirecting...');
        setTimeout(() => {
          navigate('/subscription-success', { 
            state: { 
              plan: currentPlan.name, 
              period: billingPeriod,
              amount: displayPrice 
            } 
          });
        }, 1000);
      } else {
        toast.error('Payment failed. Please check your card details and try again.');
      }
    } catch (error) {
      toast.error('Payment processing error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your subscription purchase</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your subscription details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Selected Plan</Label>
                    <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(plans).map(([key, plan]) => (
                          <SelectItem key={key} value={key}>
                            {plan.name} - €{plan.price}/month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Billing Period</Label>
                    <Select value={billingPeriod} onValueChange={(value: 'monthly' | 'annual') => setBillingPeriod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual (20% discount)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Plan Features:</h4>
                    <ul className="text-sm space-y-1">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>€{billingPeriod === 'monthly' ? monthlyPrice : (monthlyPrice * 12).toFixed(2)}</span>
                    </div>
                    {billingPeriod === 'annual' && (
                      <div className="flex justify-between text-green-600">
                        <span>Annual Discount (20%):</span>
                        <span>-€{(monthlyPrice * 12 * 0.2).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>€{displayPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {billingPeriod === 'monthly' ? 'Billed monthly' : 'Billed annually'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>
                    Enter your payment details securely
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        value={paymentData.cardholderName}
                        onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4);
                            }
                            setPaymentData({ ...paymentData, expiryDate: value });
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '') })}
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="billingAddress">Billing Address</Label>
                      <Input
                        id="billingAddress"
                        value={paymentData.billingAddress}
                        onChange={(e) => setPaymentData({ ...paymentData, billingAddress: e.target.value })}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={paymentData.city}
                          onChange={(e) => setPaymentData({ ...paymentData, city: e.target.value })}
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={paymentData.zipCode}
                          onChange={(e) => setPaymentData({ ...paymentData, zipCode: e.target.value })}
                          placeholder="10001"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select value={paymentData.country} onValueChange={(value) => setPaymentData({ ...paymentData, country: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="ES">Spain</SelectItem>
                          <SelectItem value="IT">Italy</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded">
                      <Lock className="h-4 w-4" />
                      Your payment information is secure and encrypted
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                      {isProcessing ? 'Processing Payment...' : `Pay €${displayPrice.toFixed(2)}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}