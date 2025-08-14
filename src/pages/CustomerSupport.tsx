import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Users, Building, Crown, Mail, FileText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CustomerSupport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const getSupportLevel = (plan: string) => {
    const supportLevels = {
      'user-standard': { level: 'Basic', features: ['Message boards', 'Email support', 'Knowledge base'] },
      'user-premium': { level: 'Priority', features: ['Message boards', 'Priority email support', 'Knowledge base', 'Live chat'] },
      'business': { level: 'Business', features: ['Message boards', 'Email support', 'Phone support', 'Knowledge base', 'Live chat'] },
      'business-premium': { level: 'Business Premium', features: ['Message boards', 'Priority email support', 'Phone support', 'Knowledge base', 'Live chat', 'Dedicated support'] },
      'corporate': { level: 'Corporate', features: ['All Business Premium features', 'Onsite support', 'Seminars', 'Training sessions'] },
      'corporate-premium': { level: 'Corporate Premium', features: ['All Corporate features', 'Dedicated account manager', 'Custom support solutions'] }
    };
    return supportLevels[plan as keyof typeof supportLevels] || supportLevels['user-standard'];
  };

  const supportLevel = getSupportLevel(user.subscription.plan);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate ticket submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store ticket in localStorage for demo
      const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
      const newTicket = {
        id: Date.now().toString(),
        userId: user.id,
        subject: ticketForm.subject,
        category: ticketForm.category,
        priority: ticketForm.priority,
        description: ticketForm.description,
        status: 'open',
        createdAt: new Date().toISOString()
      };
      
      tickets.push(newTicket);
      localStorage.setItem('support_tickets', JSON.stringify(tickets));
      
      toast.success('Support ticket submitted successfully!');
      setTicketForm({ subject: '', category: '', priority: 'medium', description: '' });
    } catch (error) {
      toast.error('Failed to submit ticket. Please try again.');
    }
  };

  const getMyTickets = () => {
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    return tickets.filter((ticket: { userId: string }) => ticket.userId === user.id);
  };

  const myTickets = getMyTickets();

  return (
    <Layout>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <MessageSquare className="h-8 w-8" />
              Customer Support
            </h1>
            <p className="text-gray-600">Get help when you need it</p>
            <Badge variant="outline" className="mt-2">
              {supportLevel.level} Support
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Support Level Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Your Support Level
                </CardTitle>
                <CardDescription>
                  {supportLevel.level} - Included in your {user.subscription.plan} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {supportLevel.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <MessageSquare className="h-3 w-3 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get help quickly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Knowledge Base
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
                {['business', 'business-premium', 'corporate', 'corporate-premium'].includes(user.subscription.plan) && (
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Support
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach out to us directly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">support@saasplatform.com</p>
                </div>
                {['business', 'business-premium', 'corporate', 'corporate-premium'].includes(user.subscription.plan) && (
                  <div>
                    <p className="text-sm font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM EST</p>
                  </div>
                )}
                {['corporate', 'corporate-premium'].includes(user.subscription.plan) && (
                  <div>
                    <p className="text-sm font-medium">Dedicated Support</p>
                    <p className="text-sm text-gray-600">enterprise@saasplatform.com</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="submit" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="submit">Submit Ticket</TabsTrigger>
              <TabsTrigger value="tickets">My Tickets ({myTickets.length})</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="submit">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Support Ticket</CardTitle>
                  <CardDescription>
                    Describe your issue and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          className="w-full p-2 border rounded-md"
                          value={ticketForm.category}
                          onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="technical">Technical Issue</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="account">Account Management</option>
                          <option value="feature">Feature Request</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <select
                          id="priority"
                          className="w-full p-2 border rounded-md"
                          value={ticketForm.priority}
                          onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                        placeholder="Please provide detailed information about your issue..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Submit Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle>My Support Tickets</CardTitle>
                  <CardDescription>
                    Track the status of your support requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {myTickets.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tickets yet</h3>
                      <p className="text-gray-600 mb-4">You haven't submitted any support tickets</p>
                      <Button onClick={() => document.querySelector('[value="submit"]')?.click()}>
                        Submit Your First Ticket
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myTickets.map((ticket: { id: string; subject: string; description: string; status: string; createdAt: string }) => (
                        <div key={ticket.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{ticket.subject}</h4>
                            <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                              {ticket.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Base</CardTitle>
                    <CardDescription>Find answers to common questions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start">
                      Getting Started Guide
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Account Management
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Billing & Subscriptions
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      API Documentation
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Troubleshooting
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Video Tutorials</CardTitle>
                    <CardDescription>Learn through step-by-step videos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start">
                      Platform Overview
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Setting Up Chatbots
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Creating Automations
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Advanced Features
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Best Practices
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}