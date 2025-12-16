import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function VolunteerRegistration() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', full_name: '', phone: '', address: '', city: '', state: '', zip_code: '',
    date_of_birth: '', emergency_contact_name: '', emergency_contact_phone: '', skills: '',
    areas_of_interest: [] as string[]
  });

  const interests = [
    { id: 'education', label: 'Education' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'community_outreach', label: 'Community Outreach' }
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      areas_of_interest: checked 
        ? [...prev.areas_of_interest, interest]
        : prev.areas_of_interest.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('volunteers').insert([formData]);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success!', description: 'Application submitted. We will review and contact you soon.' });
      setFormData({ email: '', full_name: '', phone: '', address: '', city: '', state: '', zip_code: '',
        date_of_birth: '', emergency_contact_name: '', emergency_contact_phone: '', skills: '', areas_of_interest: [] });
    }
    setLoading(false);
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Volunteer Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Full Name *</Label><Input required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} /></div>
          <div><Label>Email *</Label><Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div><Label>Phone</Label><Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          <div><Label>Date of Birth</Label><Input type="date" value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} /></div>
        </div>
        <div><Label>Address</Label><Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
        <div className="grid md:grid-cols-3 gap-4">
          <div><Label>City</Label><Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
          <div><Label>State</Label><Input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} /></div>
          <div><Label>Zip</Label><Input value={formData.zip_code} onChange={e => setFormData({...formData, zip_code: e.target.value})} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Emergency Contact Name</Label><Input value={formData.emergency_contact_name} onChange={e => setFormData({...formData, emergency_contact_name: e.target.value})} /></div>
          <div><Label>Emergency Contact Phone</Label><Input value={formData.emergency_contact_phone} onChange={e => setFormData({...formData, emergency_contact_phone: e.target.value})} /></div>
        </div>
        <div><Label>Areas of Interest *</Label>
          <div className="flex gap-6 mt-2">
            {interests.map(int => (
              <div key={int.id} className="flex items-center space-x-2">
                <Checkbox checked={formData.areas_of_interest.includes(int.id)} onCheckedChange={(checked) => handleInterestChange(int.id, checked as boolean)} />
                <label>{int.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div><Label>Skills & Experience</Label><Textarea value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="Tell us about your skills and experience..." /></div>
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Submitting...' : 'Submit Application'}</Button>
      </form>
    </Card>
  );
}
