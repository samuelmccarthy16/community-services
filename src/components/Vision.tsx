import React from 'react';
import { Target, Eye, Globe, Award } from 'lucide-react';

const Vision: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Vision & Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guided by our core values and unwavering commitment to human dignity, 
            we work tirelessly to create a more just and compassionate world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800">Our Vision</h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              A world where every individual and community has access to the resources, 
              support, and opportunities they need to thrive with dignity, regardless of 
              their geographic location, economic status, or circumstances.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-green-600 p-3 rounded-xl">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800">Our Mission</h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              To transform lives and strengthen communities globally through our five pillars 
              of service: Community Care Counseling, Education, Healthcare, Disaster Management, 
              and Humanitarian Services, creating sustainable positive change.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">Our Global Reach</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">100,000+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">15</div>
              <div className="text-gray-600">Years of Service</div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-800 mb-2">UN Recognition</h4>
              <p className="text-sm text-gray-600">Consultative Status with UN Economic and Social Council</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-800 mb-2">GuideStar Seal</h4>
              <p className="text-sm text-gray-600">Platinum Seal of Transparency for accountability</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-800 mb-2">4-Star Rating</h4>
              <p className="text-sm text-gray-600">Charity Navigator highest rating for excellence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;