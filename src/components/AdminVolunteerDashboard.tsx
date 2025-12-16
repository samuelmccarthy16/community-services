import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, UserPlus, Clock } from 'lucide-react';

export default function AdminVolunteerDashboard() {
  const { toast } = useToast();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [hours, setHours] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [volData, progData, hoursData, assignData] = await Promise.all([
      supabase.from('volunteers').select('*').order('created_at', { ascending: false }),
      supabase.from('programs').select('*'),
      supabase.from('volunteer_hours').select('*, volunteers(full_name)').order('created_at', { ascending: false }),
      supabase.from('volunteer_assignments').select('*, volunteers(full_name), programs(name)')
    ]);
    
    if (volData.data) setVolunteers(volData.data);
    if (progData.data) setPrograms(progData.data);
    if (hoursData.data) setHours(hoursData.data);
    if (assignData.data) setAssignments(assignData.data);
  };

  const updateStatus = async (id: string, status: string) => {
    const volunteer = volunteers.find(v => v.id === id);
    await supabase.from('volunteers').update({ status }).eq('id', id);
    
    // Send email notification
    const emailType = status === 'approved' ? 'approved' : 'rejected';
    await supabase.functions.invoke('send-volunteer-notification', {
      body: { type: emailType, volunteer }
    });
    
    toast({ title: 'Updated', description: `Volunteer ${status} and email sent` });
    loadData();
  };


  const approveHours = async (id: string) => {
    const hourEntry = hours.find(h => h.id === id);
    await supabase.from('volunteer_hours').update({ approved: true, approved_at: new Date().toISOString() }).eq('id', id);
    
    // Get volunteer details and send email
    const { data: volunteerData } = await supabase.from('volunteers').select('*').eq('id', hourEntry.volunteer_id).single();
    if (volunteerData) {
      await supabase.functions.invoke('send-volunteer-notification', {
        body: { type: 'hours', volunteer: volunteerData, hours: hourEntry }
      });
    }
    
    toast({ title: 'Approved', description: 'Hours approved and email sent' });
    loadData();
  };


  const assignVolunteer = async (volunteerId: string, programId: string) => {
    const { error } = await supabase.from('volunteer_assignments').insert([{ volunteer_id: volunteerId, program_id: programId }]);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      // Get volunteer and program details for email
      const volunteer = volunteers.find(v => v.id === volunteerId);
      const program = programs.find(p => p.id === programId);
      
      if (volunteer && program) {
        await supabase.functions.invoke('send-volunteer-notification', {
          body: { type: 'assigned', volunteer, program }
        });
      }
      
      toast({ title: 'Success', description: 'Volunteer assigned and email sent' });
      loadData();
    }
  };


  const stats = {
    total: volunteers.length,
    pending: volunteers.filter(v => v.status === 'pending').length,
    approved: volunteers.filter(v => v.status === 'approved').length,
    totalHours: hours.reduce((sum, h) => sum + parseFloat(h.hours || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4"><div className="text-sm text-gray-600">Total Volunteers</div><div className="text-2xl font-bold">{stats.total}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-600">Pending</div><div className="text-2xl font-bold text-yellow-600">{stats.pending}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-600">Approved</div><div className="text-2xl font-bold text-green-600">{stats.approved}</div></Card>
        <Card className="p-4"><div className="text-sm text-gray-600">Total Hours</div><div className="text-2xl font-bold text-blue-600">{stats.totalHours.toFixed(0)}</div></Card>
      </div>

      <Tabs defaultValue="volunteers">
        <TabsList><TabsTrigger value="volunteers">Volunteers</TabsTrigger><TabsTrigger value="hours">Hours</TabsTrigger><TabsTrigger value="assignments">Assignments</TabsTrigger></TabsList>
        
        <TabsContent value="volunteers" className="space-y-3">
          {volunteers.map(vol => (
            <Card key={vol.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{vol.full_name}</h3>
                  <p className="text-sm text-gray-600">{vol.email}</p>
                  <div className="flex gap-2 mt-2">{vol.areas_of_interest?.map((i: string) => <Badge key={i}>{i}</Badge>)}</div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={vol.status === 'approved' ? 'default' : 'secondary'}>{vol.status}</Badge>
                  {vol.status === 'pending' && (
                    <><Button size="sm" onClick={() => updateStatus(vol.id, 'approved')}><CheckCircle className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(vol.id, 'rejected')}><XCircle className="h-4 w-4" /></Button></>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="hours" className="space-y-3">
          {hours.map(h => (
            <Card key={h.id} className="p-4 flex justify-between items-center">
              <div><div className="font-semibold">{h.volunteers?.full_name}</div><div className="text-sm text-gray-600">{h.program_name} • {h.hours} hrs • {new Date(h.date).toLocaleDateString()}</div></div>
              {!h.approved && <Button size="sm" onClick={() => approveHours(h.id)}>Approve</Button>}
              {h.approved && <Badge variant="default">Approved</Badge>}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold mb-3">Assign Volunteer to Program</h3>
            <AssignmentForm volunteers={volunteers.filter(v => v.status === 'approved')} programs={programs} onAssign={assignVolunteer} />
          </Card>
          {assignments.map(a => (
            <Card key={a.id} className="p-4"><div className="font-semibold">{a.volunteers?.full_name}</div><div className="text-sm text-gray-600">{a.programs?.name}</div></Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AssignmentForm({ volunteers, programs, onAssign }: any) {
  const [volunteerId, setVolunteerId] = useState('');
  const [programId, setProgramId] = useState('');
  return (
    <div className="flex gap-3">
      <Select value={volunteerId} onValueChange={setVolunteerId}><SelectTrigger><SelectValue placeholder="Select Volunteer" /></SelectTrigger><SelectContent>{volunteers.map((v: any) => <SelectItem key={v.id} value={v.id}>{v.full_name}</SelectItem>)}</SelectContent></Select>
      <Select value={programId} onValueChange={setProgramId}><SelectTrigger><SelectValue placeholder="Select Program" /></SelectTrigger><SelectContent>{programs.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>
      <Button onClick={() => volunteerId && programId && onAssign(volunteerId, programId)}><UserPlus className="h-4 w-4" /></Button>
    </div>
  );
}
