import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface PillarCardProps {
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  isReversed?: boolean;
}

const PillarCard: React.FC<PillarCardProps> = ({ 
  title, 
  description, 
  image, 
  icon: Icon, 
  isReversed = false 
}) => {
  return (
    <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 mb-20`}>
      <div className="lg:w-1/2">
        <img 
          src={image} 
          alt={title}
          className="w-full h-80 object-cover rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
        />
      </div>
      <div className="lg:w-1/2 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors group">
          <span>Learn More</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PillarCard;