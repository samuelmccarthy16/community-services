import React from 'react';
import { GraduationCap } from 'lucide-react';

const AboutUsFounder: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800">Our Founder</h3>
      </div>
      <p className="text-lg text-gray-600 leading-relaxed">
        Blissful Transformations INC was founded by <strong>Mrs. Sierra Lavada Twum</strong>, a humanitarian, wife, mother, researcher, and devoted Christian. Mrs. Twum's passion for finding solutions to everyday problems and her commitment to community development drive our organization's mission. As a current Doctoral student at Liberty University in the United States, Mrs. Twum brings a wealth of knowledge and experience to our organization.
      </p>
    </div>
  );
};

export default AboutUsFounder;
