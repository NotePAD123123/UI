import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Zap, Settings, Send, User, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  botType?: 'GPTOSS' | 'Gemini' | 'AutoBot';
}

export default function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedBot, setSelectedBot] = useState<'GPTOSS' | 'Gemini' | 'AutoBot'>('GPTOSS');
  const [isTrialUser, setIsTrialUser] = useState(false);

  useEffect(() => {
    if (!user) {
      // Allow demo access for non-logged users
      setIsTrialUser(true);
      // Add welcome message for demo
      setMessages([{
        id: '1',
        content: 'Welcome to the demo! You have limited access to our AI consultants. Register for full features and a 3-day free trial.',
        sender: 'bot',
        timestamp: new Date(),
        botType: 'GPTOSS'
      }]);
    } else {
      setIsTrialUser(user.subscription.status === 'trial');
      // Add welcome message for logged users
      setMessages([{
        id: '1', 
        content: `Welcome back, ${user.name}! I'm your AI consultant. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date(),
        botType: 'GPTOSS'
      }]);
    }
  }, [user]);

  const getAvailableBots = () => {
    if (!user) return ['GPTOSS']; // Demo user
    
    const plan = user.subscription.plan;
    if (plan === 'user-standard') return ['GPTOSS'];
    if (plan === 'user-premium') return ['GPTOSS', 'Gemini'];
    return ['GPTOSS', 'Gemini', 'AutoBot']; // Business and above
  };

  const hasAutomation = () => {
    if (!user) return false;
    const plan = user.subscription.plan;
    return ['business', 'business-premium', 'corporate', 'corporate-premium'].includes(plan);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputMessage, selectedBot),
        sender: 'bot',
        timestamp: new Date(),
        botType: selectedBot
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage('');
  };

  const getBotResponse = (input: string, bot: string) => {
    const responses = {
      GPTOSS: [
        "I'm GPTOSS, your AI business consultant. I can help with strategy, analysis, and problem-solving.",
        "Based on your query, here are some strategic insights...",
        "As your AI consultant, I recommend considering these factors...",
        "Let me analyze that for you from a business perspective..."
      ],
      Gemini: [
        "Hello! I'm Gemini, your creative AI assistant. I excel at innovative solutions and creative thinking.",
        "From a creative standpoint, here's what I suggest...",
        "Let me offer some innovative approaches to your challenge...",
        "Creative solutions often emerge from thinking differently..."
      ],
      AutoBot: [
        "I'm AutoBot, your automation specialist. I can help design workflows and automated processes.",
        "Here's how we can automate this process...",
        "I can create an automation workflow for this task...",
        "Let me suggest some automation strategies..."
      ]
    };
    
    const botResponses = responses[bot as keyof typeof responses];
    return botResponses[Math.floor(Math.random() * botResponses.length)];
  };

  const availableBots = getAvailableBots();

  return (
    <Layout>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Platform</h1>
            <p className="text-gray-600">
              {user ? `Welcome ${user.name}! Chat with your AI consultants and manage automation.` : 'Demo Mode - Limited Features Available'}
            </p>
            {(isTrialUser || !user) && (
              <div className="mt-4">
                <Badge variant="outline" className="mr-2">
                  {user ? 'Free Trial' : 'Demo Mode'}
                </Badge>
                {user && (
                  <Button size="sm" variant="outline" onClick={() => navigate('/checkout')}>
                    Upgrade Plan
                  </Button>
                )}
                {!user && (
                  <Button size="sm" onClick={() => navigate('/registration')}>
                    Get Full Access
                  </Button>
                )}
              </div>
            )}
          </div>

          <Tabs defaultValue="chat" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">AI Consultants</TabsTrigger>
              <TabsTrigger value="automation" disabled={!hasAutomation()}>
                Business Automation
                {!hasAutomation() && <Badge variant="secondary" className="ml-2">Pro</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Bot Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Select AI Consultant</CardTitle>
                    <CardDescription>Choose your AI assistant</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {availableBots.map((bot) => (
                      <Button
                        key={bot}
                        variant={selectedBot === bot ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedBot(bot as 'GPTOSS' | 'Gemini' | 'AutoBot')}
                      >
                        <Bot className="h-4 w-4 mr-2" />
                        {bot}
                      </Button>
                    ))}
                    
                    {!availableBots.includes('Gemini') && (
                      <div className="text-sm text-gray-500 p-2 border rounded">
                        <p>Gemini available in Premium plans</p>
                      </div>
                    )}
                    
                    {!availableBots.includes('AutoBot') && (
                      <div className="text-sm text-gray-500 p-2 border rounded">
                        <p>AutoBot available in Business plans</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Chat Interface */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Chat with {selectedBot}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Messages */}
                      <ScrollArea className="h-96 w-full border rounded-lg p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                {message.sender === 'bot' && (
                                  <div className="text-xs opacity-70 mb-1">
                                    {message.botType}
                                  </div>
                                )}
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Business Automation
                  </CardTitle>
                  <CardDescription>
                    Manage your automated workflows and processes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hasAutomation() ? (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Active Workflows</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-4">You have 0 active workflows</p>
                            <Button variant="outline" className="w-full">
                              <Settings className="h-4 w-4 mr-2" />
                              Create New Workflow
                            </Button>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">N8N Integration</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                              Connect with N8N for advanced automation capabilities
                            </p>
                            <Button variant="outline" className="w-full">
                              Connect N8N
                            </Button>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="text-center py-8">
                        <h3 className="text-lg font-semibold mb-2">Ready to Automate?</h3>
                        <p className="text-gray-600 mb-4">
                          Create powerful workflows to streamline your business processes
                        </p>
                        <Button>Get Started with Automation</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Zap className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Automation Not Available</h3>
                      <p className="text-gray-600 mb-4">
                        Upgrade to Business plan or higher to access automation features
                      </p>
                      <Button onClick={() => navigate('/registration')}>
                        Upgrade Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}