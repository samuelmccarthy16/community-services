import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock } from 'lucide-react';

interface VolunteerHoursTrackerProps {
  volunteerId: string;
}

export default function VolunteerHoursTracker({ volunteerId }: VolunteerHoursTrackerProps) {
  const { toast } = useToast();
  const [hours, setHours] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState({ program_name: '', date: '', hours: '', description: '' });

  useEffect(() => {
    loadHours();
  }, [volunteerId]);

  const loadHours = async () => {
    const { data } = await supabase
      .from('volunteer_hours')
      .select('*')
      .eq('volunteer_id', volunteerId)
      .order('date', { ascending: false });
    if (data) setHours(data);
  };

  const submitHours = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('volunteer_hours').insert([{
      ...newEntry,
      volunteer_id: volunteerId,
      hours: parseFloat(newEntry.hours)
    }]);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Hours logged successfully' });
      setNewEntry({ program_name: '', date: '', hours: '', description: '' });
      loadHours();
    }
  };

  const totalHours = hours.reduce((sum, h) => sum + parseFloat(h.hours || 0), 0);
  const approvedHours = hours.filter(h => h.approved).reduce((sum, h) => sum + parseFloat(h.hours || 0), 0);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Volunteer Hours</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total Hours Logged</div>
          <div className="text-3xl font-bold text-blue-600">{totalHours.toFixed(1)}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Approved Hours</div>
          <div className="text-3xl font-bold text-green-600">{approvedHours.toFixed(1)}</div>
        </div>
      </div>

      <form onSubmit={submitHours} className="space-y-3 mb-6 border-t pt-4">
        <h4 className="font-semibold">Log New Hours</h4>
        <div><Label>Program/Event</Label><Input required value={newEntry.program_name} onChange={e => setNewEntry({...newEntry, program_name: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Date</Label><Input type="date" required value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} /></div>
          <div><Label>Hours</Label><Input type="number" step="0.5" required value={newEntry.hours} onChange={e => setNewEntry({...newEntry, hours: e.target.value})} /></div>
        </div>
        <div><Label>Description</Label><Textarea value={newEntry.description} onChange={e => setNewEntry({...newEntry, description: e.target.value})} /></div>
        <Button type="submit" className="w-full">Log Hours</Button>
      </form>

      <div className="space-y-2">
        <h4 className="font-semibold">Recent Entries</h4>
        {hours.slice(0, 5).map(entry => (
          <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-semibold">{entry.program_name}</div>
              <div className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString()} • {entry.hours} hours</div>
            </div>
            {entry.approved ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-yellow-500" />}
          </div>
        ))}
      </div>
    </Card>
  );
}
