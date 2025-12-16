import React, { useState } from 'react';
import { Heart, BookOpen, Stethoscope, Shield, Users, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Pillar {
  title: string;
  description: string;
  image: string;
  icon: React.ElementType;
  color: string;
  lightColor: string;
}

const Pillars: React.FC = () => {
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const pillars: Pillar[] = [
    {
      title: "Community Care Counseling",
      description: "Providing mental health support and counseling services to communities worldwide. Our trained professionals offer individual and group therapy, crisis intervention, and emotional wellness programs to help people overcome trauma and build resilience.",
      image: "https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1758070115364_35452116.webp",
      icon: Heart,
      color: "bg-rose-500",
      lightColor: "bg-rose-50"
    },
    {
      title: "Education",
      description: "Empowering communities through quality education and skill development programs. We build schools, train teachers, provide scholarships, and develop curriculum that prepares students for success in the modern world while preserving cultural values.",
      image: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1765659819084_d7cc948b.jpg",
      icon: BookOpen,
      color: "bg-blue-500",
      lightColor: "bg-blue-50"
    },

    {
      title: "Healthcare",
      description: "Delivering essential medical services and health education to underserved populations. Our mobile clinics, health centers, and medical missions provide preventive care, treatment, and health awareness programs to improve community wellness.",
      image: "https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1758070123367_1f3d5bf5.webp",
      icon: Stethoscope,
      color: "bg-green-500",
      lightColor: "bg-green-50"
    },
    {
      title: "Disaster Management",
      description: "Rapid response and recovery support for communities affected by natural disasters and emergencies. Our teams provide immediate relief, emergency supplies, temporary shelter, and long-term rebuilding assistance to help communities recover stronger.",
      image: "https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1758070126619_8a59c9c0.webp",
      icon: Shield,
      color: "bg-orange-500",
      lightColor: "bg-orange-50"
    },
    {
      title: "Humanitarian Services",
      description: "Comprehensive support for vulnerable populations including refugees, orphans, and marginalized communities. We provide food security, clean water access, shelter, and advocacy programs that address root causes of poverty and inequality.",
      image: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1765660102795_22e2fab4.jpg",
      icon: Users,
      color: "bg-purple-500",
      lightColor: "bg-purple-50"
    }

  ];

  return (
    <section id="pillars" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            Our Mission
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Five Pillars of Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We transform communities through comprehensive programs that address the most critical needs 
            of our global family, creating sustainable change that lasts for generations.
          </p>
        </div>

        {/* Quick Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  setActivePillar(index);
                  const element = document.getElementById(`pillar-${index}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  activePillar === index 
                    ? `${pillar.color} text-white shadow-lg` 
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">{pillar.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Pillar Cards */}
        <div className="space-y-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isReversed = index % 2 === 1;
            
            return (
              <div
                id={`pillar-${index}`}
                key={pillar.title}
                className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  activePillar === index ? 'ring-2 ring-green-500 ring-offset-2' : ''
                }`}
                onMouseEnter={() => setActivePillar(index)}
                onMouseLeave={() => setActivePillar(null)}
              >
                {/* Image */}
                <div className="lg:w-1/2 relative overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className={`absolute top-4 ${isReversed ? 'right-4' : 'left-4'}`}>
                    <div className={`${pillar.color} p-3 rounded-xl shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
                </div>

                {/* Content */}
                <div className="lg:w-1/2 p-6 lg:p-10">
                  <div className={`inline-flex items-center space-x-2 ${pillar.lightColor} px-3 py-1 rounded-full mb-4`}>
                    <span className={`w-2 h-2 rounded-full ${pillar.color}`}></span>
                    <span className="text-sm font-medium text-gray-700">Pillar {index + 1} of 5</span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/donate"
                      className={`inline-flex items-center space-x-2 ${pillar.color} text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity group`}
                    >
                      <span>Support This Cause</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/gallery"
                      className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors group"
                    >
                      <span>See Our Work</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Want to Learn More About Our Impact?
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Explore our gallery to see real stories of transformation, or contact us to discuss how you can get involved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/gallery"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center space-x-2"
              >
                <span>View Gallery</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pillars;
