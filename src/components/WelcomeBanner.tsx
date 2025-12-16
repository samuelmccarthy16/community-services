import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WelcomeBannerProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
  variant?: 'info' | 'success' | 'warning' | 'announcement';
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  message = "Welcome to Blissful Transformations! Join us in making a difference around the world.",
  linkText = "Learn More",
  linkHref = "/#about",
  variant = 'announcement'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed in this session
    const dismissed = sessionStorage.getItem('welcomeBannerDismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('welcomeBannerDismissed', 'true');
    }, 300);
  };

  const variantStyles = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-amber-500',
    announcement: 'bg-gradient-to-r from-green-600 via-blue-600 to-purple-600'
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`${variantStyles[variant]} text-white relative overflow-hidden transition-all duration-300 ${
        isAnimating ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-white/20 rounded-full flex-shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <p className="text-sm sm:text-base font-medium truncate sm:whitespace-normal">
              {message}
            </p>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to={linkHref}
              className="hidden sm:inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full text-sm font-medium transition-colors group"
            >
              {linkText}
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
