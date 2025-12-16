import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function EventCreationForm({ event, onSuccess }: any) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    time: event?.time || '',
    location: event?.location || '',
    category: event?.category || 'conference',
    capacity: event?.capacity || 100,
    image_url: event?.image_url || '',
    latitude: event?.latitude || '',
    longitude: event?.longitude || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = event?.id
      ? await supabase.from('events').update(formData).eq('id', event.id)
      : await supabase.from('events').insert([formData]);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Event ${event?.id ? 'updated' : 'created'} successfully` });
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Event Title</Label>
        <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date</Label>
          <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
        </div>
        <div>
          <Label>Time</Label>
          <Input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
        </div>
      </div>
      <div>
        <Label>Location</Label>
        <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="fundraiser">Fundraiser</SelectItem>
              <SelectItem value="community">Community</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Capacity</Label>
          <Input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} required />
        </div>
      </div>
      <Button type="submit" className="w-full">{event?.id ? 'Update' : 'Create'} Event</Button>
    </form>
  );
}
