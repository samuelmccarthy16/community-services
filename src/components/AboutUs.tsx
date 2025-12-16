import React from 'react';
import { Heart, BookOpen, Stethoscope, Shield, HandHeart, Eye } from 'lucide-react';
import AboutUsFounder from './AboutUsFounder';
import AboutUsReach from './AboutUsReach';

const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Blissful Transformations INC is an international nonprofit organization dedicated to transforming lives and communities through its five pillars: Community Care Counseling, Education, Healthcare, Disaster Management, and Humanitarian Relief. Our mission is to empower individuals, families, and communities to overcome challenges and achieve their full potential.
          </p>
        </div>

        {/* Our Pillars Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Pillars</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-600 p-3 rounded-xl w-fit mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Community Care Counseling</h4>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Addiction recovery and rehabilitation</li>
                <li>Marriage and family counseling</li>
                <li>Research-focused solutions</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-600 p-3 rounded-xl w-fit mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Education</h4>
              <p className="text-gray-600 mb-2">In partnership with Africa Union Trading Company:</p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Technical skills training</li>
                <li>Toolkits and textbooks</li>
                <li>International standard curriculum</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-red-600 p-3 rounded-xl w-fit mb-4">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Healthcare</h4>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Healthcare management software</li>
                <li>Substance abuse training</li>
                <li>Rapid drug testing</li>
                <li>Occupational health training</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-600 p-3 rounded-xl w-fit mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Disaster Management</h4>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Disaster management training</li>
                <li>Community assistance</li>
                <li>Self-sufficiency empowerment</li>
                <li>Crisis management capability</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-600 p-3 rounded-xl w-fit mb-4">
                <HandHeart className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Humanitarian Relief</h4>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>Back-to-school supplies</li>
                <li>Clothing distribution</li>
                <li>Financial assistance for families</li>
              </ul>
            </div>
          </div>
        </div>

        <AboutUsFounder />
        <AboutUsReach />

        {/* Our Vision */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">Our Vision</h3>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            At Blissful Transformations INC, we envision a world where individuals, families, and communities thrive, empowered by our support and services. We strive to minimize everyday challenges and struggles by focusing on finding solutions within our communities. Through our work, we aim to create a brighter future for all.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
