import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, Send } from 'lucide-react';

export default function ShiftReminderScheduler() {
  const { toast } = useToast();
  const [shifts, setShifts] = useState<any[]>([]);

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    const { data } = await supabase
      .from('volunteer_assignments')
      .select('*, volunteers(*), programs(*)')
      .order('created_at', { ascending: false });
    if (data) setShifts(data);
  };

  const sendReminder = async (shift: any) => {
    await supabase.functions.invoke('send-volunteer-notification', {
      body: {
        type: 'reminder',
        volunteer: shift.volunteers,
        shift: {
          program_name: shift.programs.name,
          date: new Date().toISOString(),
          time: '9:00 AM',
          location: shift.programs.location
        }
      }
    });
    toast({ title: 'Reminder Sent', description: 'Email reminder sent to volunteer' });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Shift Reminders</h2>
      <div className="space-y-3">
        {shifts.slice(0, 5).map(shift => (
          <div key={shift.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <div className="font-semibold">{shift.volunteers?.full_name}</div>
              <div className="text-sm text-gray-600">{shift.programs?.name}</div>
            </div>
            <Button size="sm" onClick={() => sendReminder(shift)}>
              <Send className="h-4 w-4 mr-2" />Send Reminder
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
