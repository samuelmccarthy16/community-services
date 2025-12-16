import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Heart, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm';
const Footer: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  return <footer className="bg-gray-900 text-white">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to Make a Difference?</h3>
              <p className="text-green-100 mt-2">Join us in transforming lives around the world.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/donate" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2 group">
                <Heart className="h-5 w-5" />
                <span>Donate Now</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/volunteer" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center space-x-2">
                <span>Become a Volunteer</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Organization Info */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1758070058663_5c79d114.jpeg" alt="Blissful Transformations Inc" className="h-12 w-12 rounded-full ring-2 ring-green-400/30 group-hover:ring-green-400 transition-all" />
              <div>
                <h3 className="text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors">Blissful Transformations</h3>
                <p className="text-sm text-blue-300">Incorporated</p>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transforming lives globally through Community Care Counseling, Education, 
              Healthcare, Disaster Management, and Humanitarian Services.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/share/1BTZ8iWCjw/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors group" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-sky-500 transition-colors group" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-700 transition-colors group" aria-label="Connect on LinkedIn">
                <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="https://www.instagram.com/blissful_transformations?igsh=OTA0cmI3aWcwMzUx" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-colors group" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <button onClick={() => scrollToSection('#pillars')} className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Our Pillars</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('#about')} className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>About Us</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('#team')} className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Leadership</span>
                </button>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Our Programs</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => scrollToSection('#pillars')} className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Community Care Counseling</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('#courses')} className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Education Initiatives</span>
                </button>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Healthcare Services</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Disaster Management</span>
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Volunteer Opportunities</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <a href="mailto:info@blissfultransformations.org" className="flex items-center space-x-3 text-gray-300 hover:text-green-400 transition-colors group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-green-600/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>info@blissfultransformations.org</span>
              </a>
              <Link to="/contact" className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 font-medium transition-colors group">
                <span>View All Offices</span>
                <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold text-white mb-3">Stay Connected</h4>
            <p className="text-gray-300 mb-6">
              Subscribe to our newsletter for updates on our programs, success stories, and ways to make a difference.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Office Locations */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <h4 className="text-lg font-semibold text-white mb-6 text-center">Our Global Offices</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* United States */}
            <div className="bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-blue-500/30">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🇺🇸</span>
                <h5 className="font-semibold text-blue-400">United States</h5>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">1422 Oatland Road, George Town, South Carolina</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <a href="tel:+19108821423" className="text-gray-300 hover:text-white transition-colors">+1 (910) 882-1423
+1(213)331-5695</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <a href="mailto:usa@blissfultransformations.org" className="text-gray-300 hover:text-white transition-colors text-xs">usa@blissfultransformations.org</a>
                </div>
              </div>
            </div>

            {/* Liberia */}
            <div className="bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-green-500/30">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🇱🇷</span>
                <h5 className="font-semibold text-green-400">Liberia</h5>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">4th Floor City Plazza unit 13, Carey & Gurley Street, Monrovia</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-green-400" />
                  <a href="tel:+231555318779" className="text-gray-300 hover:text-white transition-colors">+231 555 318 779</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-green-400" />
                  <a href="mailto:liberia@blissfultransformations.org" className="text-gray-300 hover:text-white transition-colors text-xs">liberia@blissfultransformations.org</a>
                </div>
              </div>
            </div>

            {/* Sierra Leone */}
            <div className="bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-blue-500/30">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🇸🇱</span>
                <h5 className="font-semibold text-blue-400">Sierra Leone</h5>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">Tunneh Drive, Upper Mayenkinneh, Calabatown, Freetown</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <a href="tel:+23278373155" className="text-gray-300 hover:text-white transition-colors">+232 78 373 155</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <a href="mailto:sierraleone@blissfultransformations.org" className="text-gray-300 hover:text-white transition-colors text-xs">sierraleone@blissfultransformations.org</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
              <span>© 2026 Blissful Transformations Inc. All rights reserved.</span>
              <span className="hidden md:inline">|</span>
              <Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>for humanity</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;