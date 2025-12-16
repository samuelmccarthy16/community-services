import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EventRegistrationsList({ eventId }: { eventId?: string }) {
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    fetchRegistrations();
  }, [eventId]);

  const fetchRegistrations = async () => {
    let query = supabase.from('event_registrations').select('*, events(title)');
    if (eventId) query = query.eq('event_id', eventId);
    
    const { data } = await query.order('created_at', { ascending: false });
    setRegistrations(data || []);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Event', 'Tickets', 'Status', 'Date'];
    const rows = registrations.map(r => [
      r.name, r.email, r.phone, r.events?.title, r.tickets, r.status, new Date(r.created_at).toLocaleDateString()
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h3 className="text-xl font-bold">{registrations.length} Registrations</h3>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Tickets</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map(reg => (
            <TableRow key={reg.id}>
              <TableCell className="font-medium">{reg.name}</TableCell>
              <TableCell>{reg.email}</TableCell>
              <TableCell>{reg.phone}</TableCell>
              <TableCell>{reg.events?.title}</TableCell>
              <TableCell>{reg.tickets}</TableCell>
              <TableCell>
                <Badge variant={reg.status === 'confirmed' ? 'default' : 'secondary'}>
                  {reg.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
