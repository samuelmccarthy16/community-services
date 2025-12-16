import React, { useState } from 'react';
import { Building2, Mail, Phone, Send, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const partners = [
  { name: 'United Nations', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327459959_5702e04e.webp', description: 'Global humanitarian initiatives', url: 'https://un.org' },
  { name: 'World Health Org', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327460756_447f9e7b.webp', description: 'Health programs', url: '#' },
  { name: 'Red Cross', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327461463_b3647065.webp', description: 'Emergency response', url: '#' },
  { name: 'UNICEF', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327462150_19a6b2ba.webp', description: 'Children welfare', url: '#' },
  { name: 'World Bank', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327468980_bdc8b0cf.webp', description: 'Development funding', url: '#' },
  { name: 'Gates Foundation', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327469785_e0d94a50.webp', description: 'Global health', url: '#' },
  { name: 'Doctors Without Borders', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327470468_dd1e20aa.webp', description: 'Medical aid', url: '#' },
  { name: 'Save the Children', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327471165_621c2503.webp', description: 'Child protection', url: '#' },
  { name: 'Oxfam', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327477815_995a63ef.webp', description: 'Poverty alleviation', url: '#' },
  { name: 'CARE International', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327478607_3fd024e4.webp', description: 'Humanitarian aid', url: '#' },
  { name: 'World Vision', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327479350_7e369380.webp', description: 'Community development', url: '#' },
  { name: 'Mercy Corps', logo: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327480104_69074d73.webp', description: 'Crisis response', url: '#' },
];

const Partners = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '', contactName: '', email: '', phone: '', partnershipType: '', message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-partnership-inquiry', { body: formData });
      if (error) throw error;
      toast({ title: 'Success!', description: 'Partnership inquiry submitted' });
      setFormData({ organizationName: '', contactName: '', email: '', phone: '', partnershipType: '', message: '' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit inquiry', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-green-600">
        <img src="https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1760327484490_c2f2f350.webp" alt="Partners" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Our Partners</h1>
            <p className="text-xl">Together we create lasting impact</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Partner Organizations</h2>
          <p className="text-gray-600">We collaborate with leading organizations worldwide</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20">
          {partners.map((partner, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <img src={partner.logo} alt={partner.name} className="w-full h-32 object-contain mb-4" />
              <h3 className="font-bold text-center mb-2">{partner.name}</h3>
              <p className="text-sm text-gray-600 text-center mb-3">{partner.description}</p>
              <a href={partner.url} className="flex items-center justify-center text-blue-600 hover:text-blue-700 text-sm">
                <ExternalLink className="h-4 w-4 mr-1" /> Visit
              </a>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Become a Partner</h2>
            <p className="text-gray-600">Join us in making a difference</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input placeholder="Organization Name" value={formData.organizationName} onChange={(e) => setFormData({...formData, organizationName: e.target.value})} required />
              <Input placeholder="Contact Name" value={formData.contactName} onChange={(e) => setFormData({...formData, contactName: e.target.value})} required />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <Input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <Select value={formData.partnershipType} onValueChange={(val) => setFormData({...formData, partnershipType: val})}>
              <SelectTrigger><SelectValue placeholder="Partnership Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="funding">Funding Partner</SelectItem>
                <SelectItem value="implementation">Implementation Partner</SelectItem>
                <SelectItem value="corporate">Corporate Sponsor</SelectItem>
                <SelectItem value="technical">Technical Partner</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Tell us about your organization and partnership interest" rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required />
            <Button type="submit" className="w-full" disabled={loading}>
              <Send className="h-4 w-4 mr-2" /> {loading ? 'Submitting...' : 'Submit Inquiry'}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Partners;