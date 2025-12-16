import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Heart, Camera, Users, ShoppingBag, Calendar, GraduationCap, ChevronDown, Home, Info, Award, BookOpen, Handshake, Phone, Building2, ImageIcon, HelpCircle, Search, ArrowRight } from 'lucide-react';
import { ShoppingCartDrawer } from './ShoppingCartDrawer';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavDropdownProps {
  label: string;
  icon: React.ReactNode;
  items: { label: string; href: string; icon?: React.ReactNode; description?: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label, icon, items, isOpen, onToggle, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium transition-colors py-2 px-3 rounded-lg hover:bg-green-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon}
        <span>{label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={onClose}
              className="flex items-start space-x-3 px-4 py-3 hover:bg-green-50 transition-colors group"
            >
              {item.icon && (
                <span className="text-gray-400 group-hover:text-green-600 mt-0.5 transition-colors flex-shrink-0">
                  {item.icon}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</div>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all mt-0.5" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setMobileSubmenu(null);
    setShowSearch(false);
  }, [location.pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setMobileSubmenu(null);
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.querySelector(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.querySelector(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to events page with search query
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const aboutItems = [
    { label: 'About Us', href: '/#about', icon: <Info className="h-4 w-4" />, description: 'Learn about our mission' },
    { label: 'Our Pillars', href: '/#pillars', icon: <Building2 className="h-4 w-4" />, description: 'Our core focus areas' },
    { label: 'Leadership Team', href: '/#team', icon: <Users className="h-4 w-4" />, description: 'Meet our leaders' },
    { label: 'Our Partners', href: '/partners', icon: <Handshake className="h-4 w-4" />, description: 'Organizations we work with' },
  ];

  const programItems = [
    { label: 'Conferences', href: '/#conferences', icon: <Calendar className="h-4 w-4" />, description: 'Upcoming conferences' },
    { label: 'Online Courses', href: '/#courses', icon: <BookOpen className="h-4 w-4" />, description: 'Learn at your own pace' },
    { label: 'Events', href: '/events', icon: <Calendar className="h-4 w-4" />, description: 'Community events' },
    { label: 'Student Portal', href: '/student-portal', icon: <GraduationCap className="h-4 w-4" />, description: 'Access your courses' },
  ];

  const getInvolvedItems = [
    { label: 'Volunteer', href: '/volunteer', icon: <Heart className="h-4 w-4" />, description: 'Join our volunteer team' },
    { label: 'Donate', href: '/donate', icon: <Heart className="h-4 w-4" />, description: 'Support our mission' },
    { label: 'Shop', href: '/shop', icon: <ShoppingBag className="h-4 w-4" />, description: 'Browse our store' },
  ];

  return (
    <>
      <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1758070058663_5c79d114.jpeg" 
                alt="Blissful Transformations Inc" 
                className="h-12 w-12 rounded-full ring-2 ring-green-100 group-hover:ring-green-300 transition-all"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-green-700 group-hover:text-green-600 transition-colors">Blissful Transformations</h1>
                <p className="text-sm text-blue-600">Incorporated</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link 
                to="/" 
                className={`flex items-center space-x-1 font-medium px-3 py-2 rounded-lg transition-all ${
                  location.pathname === '/' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <NavDropdown
                label="About"
                icon={<Info className="h-4 w-4" />}
                items={aboutItems}
                isOpen={activeDropdown === 'about'}
                onToggle={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
                onClose={() => setActiveDropdown(null)}
              />

              <NavDropdown
                label="Programs"
                icon={<BookOpen className="h-4 w-4" />}
                items={programItems}
                isOpen={activeDropdown === 'programs'}
                onToggle={() => setActiveDropdown(activeDropdown === 'programs' ? null : 'programs')}
                onClose={() => setActiveDropdown(null)}
              />

              <NavDropdown
                label="Get Involved"
                icon={<Heart className="h-4 w-4" />}
                items={getInvolvedItems}
                isOpen={activeDropdown === 'involved'}
                onToggle={() => setActiveDropdown(activeDropdown === 'involved' ? null : 'involved')}
                onClose={() => setActiveDropdown(null)}
              />

              <Link 
                to="/gallery" 
                className={`flex items-center space-x-1 font-medium px-3 py-2 rounded-lg transition-all ${
                  location.pathname === '/gallery' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span>Gallery</span>
              </Link>

              <Link 
                to="/contact" 
                className={`flex items-center space-x-1 font-medium px-3 py-2 rounded-lg transition-all ${
                  location.pathname === '/contact' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </Link>

              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                {/* Search Button */}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>

                <ShoppingCartDrawer />
                
                <Link 
                  to="/donate" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Heart className="h-4 w-4" />
                  <span>Donate</span>
                </Link>
                
                <Link 
                  to="/student-portal" 
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Portal</span>
                </Link>
              </div>
            </nav>

            {/* Mobile: Cart + Menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <ShoppingCartDrawer />
              <button 
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar (Expandable) */}
          <div 
            className={`overflow-hidden transition-all duration-300 ${
              showSearch ? 'max-h-20 opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
          >
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, courses, and more..."
                className="w-full pl-12 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-[calc(100vh-80px)] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-gray-50 border-t border-gray-100 px-4 py-4 space-y-1 max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pb-4 border-b border-gray-200">
              <Link 
                to="/donate" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-md active:scale-95 transition-transform"
              >
                <Heart className="h-4 w-4" />
                <span className="font-medium">Donate</span>
              </Link>
              <Link 
                to="/student-portal" 
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-md active:scale-95 transition-transform"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">Portal</span>
              </Link>
            </div>

            {/* Main Links */}
            <Link 
              to="/" 
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-green-100 text-green-700' 
                  : 'hover:bg-white text-gray-700 hover:text-green-600'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>

            {/* About Section */}
            <div>
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'about' ? null : 'about')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white text-gray-700 hover:text-green-600 transition-colors"
                aria-expanded={mobileSubmenu === 'about'}
              >
                <div className="flex items-center space-x-3">
                  <Info className="h-5 w-5" />
                  <span className="font-medium">About</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileSubmenu === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'about' && (
                <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-2">
                  {aboutItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-white transition-colors"
                    >
                      {item.icon}
                      <div>
                        <span className="block">{item.label}</span>
                        {item.description && (
                          <span className="text-xs text-gray-400">{item.description}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Programs Section */}
            <div>
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'programs' ? null : 'programs')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white text-gray-700 hover:text-green-600 transition-colors"
                aria-expanded={mobileSubmenu === 'programs'}
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">Programs</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileSubmenu === 'programs' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'programs' && (
                <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-2">
                  {programItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-white transition-colors"
                    >
                      {item.icon}
                      <div>
                        <span className="block">{item.label}</span>
                        {item.description && (
                          <span className="text-xs text-gray-400">{item.description}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Get Involved Section */}
            <div>
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === 'involved' ? null : 'involved')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white text-gray-700 hover:text-green-600 transition-colors"
                aria-expanded={mobileSubmenu === 'involved'}
              >
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Get Involved</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileSubmenu === 'involved' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'involved' && (
                <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-2">
                  {getInvolvedItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-white transition-colors"
                    >
                      {item.icon}
                      <div>
                        <span className="block">{item.label}</span>
                        {item.description && (
                          <span className="text-xs text-gray-400">{item.description}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/gallery" 
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/gallery' 
                  ? 'bg-green-100 text-green-700' 
                  : 'hover:bg-white text-gray-700 hover:text-green-600'
              }`}
            >
              <Camera className="h-5 w-5" />
              <span className="font-medium">Gallery</span>
            </Link>

            <Link 
              to="/contact" 
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/contact' 
                  ? 'bg-green-100 text-green-700' 
                  : 'hover:bg-white text-gray-700 hover:text-green-600'
              }`}
            >
              <Phone className="h-5 w-5" />
              <span className="font-medium">Contact</span>
            </Link>

            {/* Help Link */}
            <div className="pt-4 border-t border-gray-200 mt-4">
              <Link 
                to="/contact" 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
              >
                <HelpCircle className="h-5 w-5" />
                <div>
                  <span className="font-medium block">Need Help?</span>
                  <span className="text-xs text-green-600">We're here to assist you</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
