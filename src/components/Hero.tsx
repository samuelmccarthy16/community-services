import React from 'react';
import { ArrowRight, Globe, Users, Heart, Play, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  return <section id="home" className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center" style={{
      backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1758070111329_60105f15.webp')`
    }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-green-800/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-200 font-medium">Making a difference since 2015</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transforming Lives
              <span className="block text-green-300">Across the Globe</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed max-w-3xl">
              An international non-profit organization dedicated to creating lasting change through 
              Community Care Counseling, Education, Healthcare, Disaster Management, and Humanitarian Services.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/donate" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl hover:scale-105 group">
                <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Make a Donation</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={() => scrollToSection('#about')} className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all group">
                <Globe className="h-5 w-5" />
                <span>Learn More</span>
              </button>
              <Link to="/gallery" className="bg-transparent border-2 border-green-400/50 hover:border-green-400 hover:bg-green-400/10 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all group">
                <Play className="h-5 w-5" />
                <span>Watch Our Story</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer group" onClick={() => scrollToSection('#pillars')}>
                <div className="text-4xl font-bold text-green-300 group-hover:scale-110 transition-transform">2+</div>
                <div className="text-sm text-blue-100 mt-1">Continent Served</div>
                <div className="text-xs text-blue-200/70 mt-2">Click to learn more</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer group" onClick={() => scrollToSection('#about')}>
                <div className="text-4xl font-bold text-green-300 group-hover:scale-110 transition-transform">100K+</div>
                <div className="text-sm text-blue-100 mt-1">Lives Impacted</div>
                <div className="text-xs text-blue-200/70 mt-2">Click to learn more</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer group" onClick={() => scrollToSection('#pillars')}>
                <div className="text-4xl font-bold text-green-300 group-hover:scale-110 transition-transform">5</div>
                <div className="text-sm text-blue-100 mt-1">Core Pillars</div>
                <div className="text-xs text-blue-200/70 mt-2">Click to learn more</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button onClick={() => scrollToSection('#pillars')} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 hover:text-white transition-colors cursor-pointer group" aria-label="Scroll to content">
          <span className="text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Scroll Down</span>
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </button>
      </div>
    </section>;
};
export default Hero;