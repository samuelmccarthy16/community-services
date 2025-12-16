import { Heart, GraduationCap, Users, Stethoscope, Home, Utensils, Sparkles } from 'lucide-react';

interface DonationImpactProps {
  amount: number;
}

export default function DonationImpact({ amount }: DonationImpactProps) {
  const impacts = [
    { 
      icon: Heart, 
      text: 'Counseling Sessions', 
      value: Math.floor(amount / 50), 
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      description: 'Providing mental health support'
    },
    { 
      icon: GraduationCap, 
      text: 'Students Supported', 
      value: Math.floor(amount / 100), 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Educational opportunities'
    },
    { 
      icon: Stethoscope, 
      text: 'Medical Checkups', 
      value: Math.floor(amount / 30), 
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Healthcare access'
    },
    { 
      icon: Utensils, 
      text: 'Meals Provided', 
      value: Math.floor(amount / 5), 
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Fighting hunger'
    },
  ];

  const validImpacts = impacts.filter(impact => impact.value > 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">Your Impact</h3>
        </div>
        <p className="text-white/90 text-sm">
          See how your donation of ${amount > 0 ? amount.toFixed(2) : '0.00'} can transform lives
        </p>
      </div>

      {/* Impact Grid */}
      <div className="p-6">
        {amount < 5 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Select an amount to see your potential impact</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {validImpacts.map((impact, idx) => (
              <div 
                key={idx} 
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className={`w-12 h-12 ${impact.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                  <impact.icon className={`w-6 h-6 ${impact.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{impact.value}</div>
                <div className="font-medium text-gray-800 text-sm">{impact.text}</div>
                <div className="text-xs text-gray-500 mt-1">{impact.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonial */}
        {amount >= 25 && (
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
            <p className="text-sm text-gray-700 italic">
              "Thanks to generous donors like you, we've been able to reach over 100,000 people across 2 continents with life-changing programs."
            </p>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              — Blissful Transformations Team
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
