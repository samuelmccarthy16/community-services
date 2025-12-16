import React from 'react';
import { Globe, MapPin } from 'lucide-react';

const AboutUsReach: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl">
          <Globe className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800">Our Reach</h3>
      </div>
      <p className="text-lg text-gray-600 leading-relaxed mb-6">
        Originally founded in South Carolina, Blissful Transformations INC has expanded to North Carolina and West Africa, Liberia and Sierra Leone. Our global presence enables us to respond to the needs of diverse communities and make a meaningful impact worldwide.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-800">United States</h4>
            <p className="text-sm text-gray-600">South Carolina & North Carolina</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
          <MapPin className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-800">Liberia</h4>
            <p className="text-sm text-gray-600">West Africa</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
          <MapPin className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-800">Sierra Leone</h4>
            <p className="text-sm text-gray-600">West Africa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsReach;
