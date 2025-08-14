import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailVerification() {
  const [isResending, setIsResending] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    // Check if email is already verified (simulate checking URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Simulate email verification
      verifyEmail();
    }
  }, []);

  const verifyEmail = async () => {
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user verification status
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: { email: string }) => u.email === email);
      
      if (userIndex !== -1) {
        users[userIndex].emailVerified = true;
        localStorage.setItem('users', JSON.stringify(users));
        setEmailVerified(true);
        toast.success('Email verified successfully!');
      }
    } catch (error) {
      toast.error('Email verification failed');
    }
  };

  const resendVerification = async () => {
    setIsResending(true);
    
    try {
      // Simulate resending verification email
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  if (emailVerified) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Email Verified!</CardTitle>
                <CardDescription>
                  Your email has been successfully verified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  You can now sign in to your account and start using our platform.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/login')}
                >
                  Sign In to Your Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Verify Your Email</CardTitle>
              <CardDescription>
                We've sent a verification link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Please check your email and click the verification link to activate your account. 
                If you don't see the email, check your spam folder.
              </p>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={resendVerification}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  For demo purposes, you can simulate email verification by clicking{' '}
                  <button 
                    className="text-blue-600 underline"
                    onClick={verifyEmail}
                  >
                    here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}