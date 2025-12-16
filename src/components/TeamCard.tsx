import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

interface TeamCardProps {
  name: string;
  title: string;
  bio: string;
  image: string;
  education?: string;
  experience?: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ 
  name, 
  title, 
  bio, 
  image, 
  education, 
  experience 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
            <Linkedin className="h-4 w-4" />
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full">
            <Mail className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-blue-600 font-semibold mb-3">{title}</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{bio}</p>
        
        {education && (
          <div className="mb-2">
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Education</span>
            <p className="text-sm text-gray-700">{education}</p>
          </div>
        )}
        
        {experience && (
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Experience</span>
            <p className="text-sm text-gray-700">{experience}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;