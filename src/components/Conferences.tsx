import React, { useState } from 'react';
import { Calendar, MapPin, Users, Video, Clock, Globe, Award, Mic } from 'lucide-react';
import ConferenceRegistrationForm from './ConferenceRegistrationForm';

const Conferences: React.FC = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedConference, setSelectedConference] = useState<typeof upcomingConferences[0] | null>(null);

  const upcomingConferences = [
    {
      title: "Global Humanitarian Summit 2026",
      date: "March 15-17, 2026",
      location: "Geneva, Switzerland",
      type: "Hybrid",
      attendees: "500+ Expected",
      description: "Join world leaders, NGO executives, and humanitarian experts for three days of collaboration on addressing global challenges.",
      highlights: ["Keynote Speakers", "Panel Discussions", "Networking Gala"],
      price: "Free Registration"
    },
    {
      title: "Mental Health & Community Care Conference",
      date: "June 8-10, 2026",
      location: "Virtual Event",
      type: "Online",
      attendees: "1000+ Expected",
      description: "Exploring innovative approaches to community-based mental health support and trauma-informed care practices.",
      highlights: ["Interactive Workshops", "Case Studies", "Q&A Sessions"],
      price: "Free Registration"
    },
    {
      title: "Education for All: Innovation Summit",
      date: "September 22-24, 2026",
      location: "Monrovia, Liberia",
      type: "In-Person",
      attendees: "300+ Expected",
      description: "Showcasing breakthrough educational technologies and methodologies transforming learning in developing regions.",
      highlights: ["Tech Demos", "Field Visits", "Awards Ceremony"],
      price: "Free Registration"
    }

  ];

  const handleRegisterClick = (conference: typeof upcomingConferences[0] | null = null) => {
    setSelectedConference(conference);
    setIsRegistrationOpen(true);
  };

  return (
    <section id="conferences" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            International Events
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            International Conferences
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with global leaders, share knowledge, and collaborate on solutions 
            that address the world's most pressing humanitarian challenges.
          </p>
        </div>

        {/* Hero Conference Image */}
        <div className="mb-16 relative">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1758070151048_62100349.webp"
            alt="International Conference"
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl flex items-end">
            <div className="p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Join Our Global Community</h3>
              <p className="text-white/80 mb-4">Be part of meaningful conversations that shape the future of humanitarian work</p>
              <button 
                onClick={() => handleRegisterClick(null)}
                className="px-6 py-3 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Register for a Conference
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Conferences */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {upcomingConferences.map((conference, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              {/* Conference Header */}
              <div className={`p-4 ${
                index === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                index === 1 ? 'bg-gradient-to-r from-green-600 to-green-700' :
                'bg-gradient-to-r from-amber-600 to-amber-700'
              }`}>
                <div className="flex items-center justify-between text-white">
                  <span className="text-sm font-medium">{conference.type}</span>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{conference.price}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                  {conference.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span>{conference.date}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{conference.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span>{conference.attendees}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{conference.description}</p>
                
                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {conference.highlights.map((highlight, hIndex) => (
                    <span key={hIndex} className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 border border-gray-200">
                      {highlight}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => handleRegisterClick(conference)}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Globe className="h-5 w-5" />
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Conference Features */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            What to Expect at Our Conferences
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Expert Speakers</h4>
              <p className="text-sm text-gray-600">World-renowned leaders and practitioners</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Interactive Workshops</h4>
              <p className="text-sm text-gray-600">Hands-on learning and skill development</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Virtual Participation</h4>
              <p className="text-sm text-gray-600">Global access through live streaming</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Networking</h4>
              <p className="text-sm text-gray-600">Connect with global humanitarian network</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Join Us?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Register today and be part of the global movement to create positive change. 
            All our conferences are free to attend, whether in-person or virtually.
          </p>
          <button 
            onClick={() => handleRegisterClick(null)}
            className="px-8 py-4 bg-white text-gray-800 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <Globe className="h-5 w-5" />
            Register for a Conference
          </button>
        </div>
      </div>

      {/* Registration Modal */}
      <ConferenceRegistrationForm
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        conference={selectedConference}
        conferences={upcomingConferences}
      />
    </section>
  );
};

export default Conferences;
