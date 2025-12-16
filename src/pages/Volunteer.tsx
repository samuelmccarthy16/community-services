import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VolunteerRegistration from '@/components/VolunteerRegistration';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import AvailabilityScheduler from '@/components/AvailabilityScheduler';
import VolunteerHoursTracker from '@/components/VolunteerHoursTracker';
import VolunteerCertificate from '@/components/VolunteerCertificate';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { 
  Heart, 
  Users, 
  BookOpen, 
  Globe, 
  Award, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Mail,
  Loader2,
  LogOut,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Volunteer() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [volunteer, setVolunteer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('register');

  const lookupVolunteer = async () => {
    if (!email.trim()) {
      toast({ title: 'Email Required', description: 'Please enter your email address', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        toast({ 
          title: 'Not Found', 
          description: 'No volunteer found with this email. Please register first.', 
          variant: 'destructive' 
        });
      } else {
        setVolunteer(data);
        toast({ title: 'Welcome back!', description: `Hi ${data.full_name}` });
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Something went wrong. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setVolunteer(null);
    setEmail('');
    toast({ title: 'Logged out', description: 'You have been logged out successfully' });
  };

  const impactStats = [
    { icon: Users, value: '500+', label: 'Active Volunteers', color: 'text-blue-500' },
    { icon: Globe, value: '15+', label: 'Countries', color: 'text-green-500' },
    { icon: Clock, value: '10,000+', label: 'Hours Contributed', color: 'text-purple-500' },
    { icon: Heart, value: '50,000+', label: 'Lives Impacted', color: 'text-red-500' },
  ];

  const opportunities = [
    {
      icon: Heart,
      title: 'Healthcare Support',
      description: 'Assist with medical outreach programs, health education, and community wellness initiatives.',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-500'
    },
    {
      icon: BookOpen,
      title: 'Education & Tutoring',
      description: 'Help students learn, mentor youth, and support educational programs in underserved areas.',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-500'
    },
    {
      icon: Users,
      title: 'Community Outreach',
      description: 'Build stronger communities through events, counseling support, and humanitarian aid.',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-500'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Users className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Volunteer With Us
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Make a meaningful difference in communities around the world. Join our global network of volunteers.
            </p>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {impactStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Volunteer Opportunities */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Opportunities</h2>
              <p className="text-gray-600">Choose an area where you'd like to make an impact</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {opportunities.map((opp, index) => {
                const Icon = opp.icon;
                return (
                  <Card key={index} className={`p-6 border-2 ${opp.color} hover:shadow-lg transition-all group cursor-pointer`}>
                    <div className={`w-14 h-14 rounded-xl ${opp.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 ${opp.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{opp.title}</h3>
                    <p className="text-gray-600 mb-4">{opp.description}</p>
                    <button 
                      onClick={() => setActiveTab('register')}
                      className={`text-sm font-medium ${opp.iconColor} flex items-center gap-1 group-hover:gap-2 transition-all`}
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Main Tabs Section */}
          <div className="max-w-5xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 h-14 mb-6">
                <TabsTrigger value="register" className="text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <Star className="w-4 h-4 mr-2" />
                  New Volunteer
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <Award className="w-4 h-4 mr-2" />
                  My Dashboard
                </TabsTrigger>
              </TabsList>

              <TabsContent value="register" className="mt-0">
                <VolunteerRegistration />
              </TabsContent>

              <TabsContent value="dashboard" className="mt-0">
                {!volunteer ? (
                  <Card className="p-8">
                    <div className="max-w-md mx-auto text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">Access Your Dashboard</h3>
                      <p className="text-gray-600 mb-6">
                        Enter your registered email to view your volunteer dashboard, track hours, and download certificates.
                      </p>
                      <div className="space-y-4">
                        <Input 
                          type="email" 
                          placeholder="Enter your email address" 
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && lookupVolunteer()}
                          className="h-12 text-center"
                        />
                        <Button 
                          onClick={lookupVolunteer} 
                          disabled={isLoading}
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Checking...
                            </>
                          ) : (
                            <>
                              Access Dashboard
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Not registered yet?{' '}
                        <button 
                          onClick={() => setActiveTab('register')}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Sign up as a volunteer
                        </button>
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Welcome Card */}
                    <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-blue-100 mb-1">Welcome back,</p>
                            <h2 className="text-3xl font-bold mb-4">{volunteer.full_name}</h2>
                            <div className="flex flex-wrap gap-4">
                              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                <p className="text-xs text-blue-100">Status</p>
                                <p className="font-semibold capitalize flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  {volunteer.status}
                                </p>
                              </div>
                              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                <p className="text-xs text-blue-100">Total Hours</p>
                                <p className="font-semibold flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {volunteer.total_hours || 0} hrs
                                </p>
                              </div>
                              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                <p className="text-xs text-blue-100">Member Since</p>
                                <p className="font-semibold">
                                  {new Date(volunteer.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleLogout}
                            className="text-white/80 hover:text-white hover:bg-white/10"
                          >
                            <LogOut className="w-4 h-4 mr-1" />
                            Logout
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Dashboard Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <AvailabilityScheduler volunteerId={volunteer.id} />
                      <VolunteerHoursTracker volunteerId={volunteer.id} />
                    </div>

                    {/* Certificate Section */}
                    {volunteer.total_hours > 0 && (
                      <VolunteerCertificate 
                        volunteerName={volunteer.full_name}
                        totalHours={volunteer.total_hours}
                        startDate={volunteer.created_at}
                      />
                    )}

                    {/* Quick Actions */}
                    <Card className="p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <Link 
                          to="/events"
                          className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">View Events</p>
                            <p className="text-sm text-gray-500">Find opportunities</p>
                          </div>
                        </Link>
                        <Link 
                          to="/gallery"
                          className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Our Impact</p>
                            <p className="text-sm text-gray-500">See our work</p>
                          </div>
                        </Link>
                        <Link 
                          to="/contact"
                          className="flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Contact Us</p>
                            <p className="text-sm text-gray-500">Get support</p>
                          </div>
                        </Link>
                      </div>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
