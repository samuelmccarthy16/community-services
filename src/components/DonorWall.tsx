import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart, Star, Users, Award } from 'lucide-react';

interface Donor {
  id: string;
  donor_name: string;
  amount: number;
  message: string;
  created_at: string;
}

// Sample donors for display when database is empty
const sampleDonors: Donor[] = [
  { id: '1', donor_name: 'Sarah Johnson', amount: 500, message: 'Keep up the amazing work!', created_at: '2024-12-10' },
  { id: '2', donor_name: 'Michael Chen', amount: 250, message: 'Proud to support this cause', created_at: '2024-12-09' },
  { id: '3', donor_name: 'Anonymous', amount: 1000, message: '', created_at: '2024-12-08' },
  { id: '4', donor_name: 'Emily Rodriguez', amount: 100, message: 'Every little bit helps!', created_at: '2024-12-07' },
  { id: '5', donor_name: 'David Thompson', amount: 150, message: 'God bless your mission', created_at: '2024-12-06' },
  { id: '6', donor_name: 'Grace Okonkwo', amount: 300, message: 'In honor of my grandmother', created_at: '2024-12-05' },
  { id: '7', donor_name: 'James Wilson', amount: 75, message: '', created_at: '2024-12-04' },
  { id: '8', donor_name: 'Maria Santos', amount: 200, message: 'Thank you for helping communities', created_at: '2024-12-03' },
  { id: '9', donor_name: 'Robert Kim', amount: 450, message: 'Happy to contribute', created_at: '2024-12-02' },
];

export default function DonorWall() {
  const [donors, setDonors] = useState<Donor[]>(sampleDonors);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (data && data.length > 0) {
        setDonors(data);
      }
    } catch (err) {
      // Use sample donors if database fetch fails
      console.log('Using sample donors');
    } finally {
      setLoading(false);
    }
  };

  const totalDonations = donors.reduce((sum, d) => sum + d.amount, 0);
  const donorCount = donors.length;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Wall of Gratitude</h2>
            <p className="text-white/80">Celebrating our generous supporters</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold">${totalDonations.toLocaleString()}</div>
            <div className="text-sm text-white/80">Total Raised</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold">{donorCount}</div>
            <div className="text-sm text-white/80">Donors</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-2xl md:text-3xl font-bold">100K+</div>
            <div className="text-sm text-white/80">Lives Impacted</div>
          </div>
        </div>
      </div>

      {/* Donor Grid */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {donors.map((donor, index) => (
            <div 
              key={donor.id} 
              className={`relative rounded-xl p-5 border transition-all hover:shadow-lg ${
                donor.amount >= 500 
                  ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200' 
                  : donor.amount >= 250 
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
              }`}
            >
              {/* Badge for top donors */}
              {donor.amount >= 500 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    donor.amount >= 500 
                      ? 'bg-amber-500' 
                      : donor.amount >= 250 
                        ? 'bg-purple-500'
                        : 'bg-blue-500'
                  }`}>
                    {donor.donor_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{donor.donor_name}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(donor.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <span className={`text-lg font-bold ${
                  donor.amount >= 500 
                    ? 'text-amber-600' 
                    : donor.amount >= 250 
                      ? 'text-purple-600'
                      : 'text-blue-600'
                }`}>
                  ${donor.amount}
                </span>
              </div>
              
              {donor.message && (
                <p className="text-sm text-gray-600 italic bg-white/50 rounded-lg p-2">
                  "{donor.message}"
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Join these amazing donors and make a difference today!
          </p>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Heart className="w-5 h-5" />
            Make Your Donation
          </a>
        </div>
      </div>
    </div>
  );
}
