import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface AvailabilitySchedulerProps {
  volunteerId: string;
}

export default function AvailabilityScheduler({ volunteerId }: AvailabilitySchedulerProps) {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<any[]>([]);
  const [newSlot, setNewSlot] = useState({ day_of_week: '', start_time: '', end_time: '' });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadAvailability();
  }, [volunteerId]);

  const loadAvailability = async () => {
    const { data } = await supabase
      .from('volunteer_availability')
      .select('*')
      .eq('volunteer_id', volunteerId)
      .order('day_of_week');
    if (data) setAvailability(data);
  };

  const addSlot = async () => {
    if (!newSlot.day_of_week || !newSlot.start_time || !newSlot.end_time) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('volunteer_availability').insert([{ ...newSlot, volunteer_id: volunteerId }]);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Availability added' });
      setNewSlot({ day_of_week: '', start_time: '', end_time: '' });
      loadAvailability();
    }
  };

  const deleteSlot = async (id: string) => {
    await supabase.from('volunteer_availability').delete().eq('id', id);
    toast({ title: 'Deleted', description: 'Availability removed' });
    loadAvailability();
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">My Availability</h3>
      
      <div className="space-y-4 mb-6">
        {availability.map(slot => (
          <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <span className="font-semibold">{slot.day_of_week}</span>
              <span className="ml-4 text-gray-600">{slot.start_time} - {slot.end_time}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => deleteSlot(slot.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Add New Availability</h4>
        <div className="grid grid-cols-3 gap-3">
          <Select value={newSlot.day_of_week} onValueChange={v => setNewSlot({...newSlot, day_of_week: v})}>
            <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
            <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <input type="time" className="border rounded px-3" value={newSlot.start_time} onChange={e => setNewSlot({...newSlot, start_time: e.target.value})} />
          <input type="time" className="border rounded px-3" value={newSlot.end_time} onChange={e => setNewSlot({...newSlot, end_time: e.target.value})} />
        </div>
        <Button onClick={addSlot} className="mt-3 w-full">Add Availability</Button>
      </div>
    </Card>
  );
}
