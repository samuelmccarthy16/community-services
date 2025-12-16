import React from 'react';
import { Quote } from 'lucide-react';

const FounderMessage: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/3">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760294800292_b9b19ae8.jpg"
              alt="Founder"
              className="w-80 h-80 object-cover rounded-full shadow-2xl mx-auto border-8 border-white/20"
            />
          </div>
          <div className="lg:w-2/3 space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <Quote className="h-12 w-12 text-green-300" />
              <h2 className="text-4xl font-bold">Message from Our Founder</h2>
            </div>
            
            <div className="text-lg leading-relaxed space-y-4 text-blue-100">
              <p>
                "When I founded Blissful Transformations Inc, I had a vision of a world where every person, 
                regardless of their circumstances, could access the support and resources they need to thrive. 
                Today, that vision has become a reality touching lives across 3 countries: the United States, 
                Liberia, and Sierra Leone."
              </p>
              
              <p>
                "Our five pillars represent the foundation of human dignity: mental wellness through counseling, 
                empowerment through education, health through medical care, security through disaster preparedness, 
                and hope through humanitarian services. Each pillar supports the others, creating a comprehensive 
                approach to sustainable development."
              </p>
              
              <p>
                "I am deeply grateful to our dedicated team, generous donors, and the communities we serve who 
                continue to inspire us every day. Together, we are not just changing lives – we are transforming 
                the future of our global family."
              </p>
            </div>
            
            <div className="pt-6">
              <div className="text-2xl font-bold text-green-300">Mrs. Sierra Twum</div>
              <div className="text-lg text-blue-200">Founder & Executive Director</div>
              <div className="text-sm text-blue-300 mt-2">Doctoral (c) Community Care Counseling, Liberty University</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FounderMessage;