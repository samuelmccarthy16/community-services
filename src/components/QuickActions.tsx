import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Calendar, ShoppingBag, X, Plus, Phone, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show quick actions after scrolling past hero section
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const actions = [
    {
      icon: Heart,
      label: 'Donate',
      href: '/donate',
      color: 'bg-red-500 hover:bg-red-600',
      description: 'Support our mission'
    },
    {
      icon: Calendar,
      label: 'Events',
      href: '/events',
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'View upcoming events'
    },
    {
      icon: ShoppingBag,
      label: 'Shop',
      href: '/shop',
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Browse our store'
    },
    {
      icon: Phone,
      label: 'Contact',
      href: '/contact',
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Get in touch'
    },
    {
      icon: HelpCircle,
      label: 'Volunteer',
      href: '/volunteer',
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Join our team'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Action buttons */}
      <div 
        className={`flex flex-col-reverse gap-3 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.href}
              className={`group flex items-center gap-3 ${action.color} text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-xl`}
              style={{ 
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                transform: isOpen ? 'scale(1)' : 'scale(0.8)'
              }}
              onClick={() => setIsOpen(false)}
            >
              {/* Label tooltip */}
              <span className="hidden sm:block bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                {action.description}
              </span>
              <div className="w-12 h-12 flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
          isOpen 
            ? 'bg-gray-800 hover:bg-gray-700 rotate-45' 
            : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
        }`}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white transition-transform" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 -z-10 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default QuickActions;
