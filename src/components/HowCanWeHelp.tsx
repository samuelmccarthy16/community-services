import React from 'react';
import { 
  Heart, 
  GraduationCap, 
  Calendar, 
  Users, 
  ShoppingBag, 
  Camera, 
  Phone, 
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowCanWeHelp: React.FC = () => {
  const helpCards = [
    {
      icon: Heart,
      title: "I want to donate",
      description: "Support our mission with a one-time or recurring donation",
      href: "/donate",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: Users,
      title: "I want to volunteer",
      description: "Join our team and make a direct impact in communities",
      href: "/volunteer",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      icon: GraduationCap,
      title: "I'm a student",
      description: "Access your courses and learning materials",
      href: "/student-portal",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Calendar,
      title: "Find an event",
      description: "Discover upcoming events and workshops near you",
      href: "/events",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: BookOpen,
      title: "Take a course",
      description: "Explore our online courses and certifications",
      href: "/#courses",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: ShoppingBag,
      title: "Shop for a cause",
      description: "Browse merchandise that supports our programs",
      href: "/shop",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      icon: Camera,
      title: "See our impact",
      description: "View photos and videos from our programs",
      href: "/gallery",
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600"
    },
    {
      icon: Phone,
      title: "Get in touch",
      description: "Have questions? We're here to help",
      href: "/contact",
      color: "from-gray-600 to-gray-700",
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Quick Navigation</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Can We Help You Today?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you want to give, learn, or get involved, we've made it easy to find what you're looking for.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {helpCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                className={`group relative ${card.bgColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`${card.iconBg} group-hover:bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300`}>
                    <Icon className={`h-6 w-6 ${card.iconColor} group-hover:text-white transition-colors duration-300`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">
                    {card.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 group-hover:text-white/90 mb-4 transition-colors duration-300">
                    {card.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                    <span>Get started</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom help text */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Not sure where to start?{' '}
            <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Contact us
            </Link>
            {' '}and we'll guide you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowCanWeHelp;
