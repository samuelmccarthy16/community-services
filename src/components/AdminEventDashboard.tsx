import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import EventCreationForm from './EventCreationForm';
import EventRegistrationsList from './EventRegistrationsList';
import EventAnalytics from './EventAnalytics';
import BulkPhotoUpload from './BulkPhotoUpload';
import { useToast } from '@/hooks/use-toast';

export default function AdminEventDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: false });
    setEvents(data || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Event deleted' });
      fetchEvents();
    }
  };

  return (
    <Tabs defaultValue="analytics">
      <TabsList>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="events">Manage Events</TabsTrigger>
        <TabsTrigger value="registrations">All Registrations</TabsTrigger>
      </TabsList>

      <TabsContent value="analytics" className="mt-6">
        <EventAnalytics />
      </TabsContent>

      <TabsContent value="events" className="mt-6">
        <div className="mb-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedEvent(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedEvent ? 'Edit' : 'Create'} Event</DialogTitle>
              </DialogHeader>
              <EventCreationForm event={selectedEvent} onSuccess={() => { fetchEvents(); setDialogOpen(false); }} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {events.map(event => (
            <Card key={event.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-2">{event.location}</p>
                  <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                  <p className="text-sm font-medium mt-2">Capacity: {event.capacity}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedEvent(event); setPhotoDialogOpen(true); }}>
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedEvent(event); setDialogOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Event Photos</DialogTitle>
            </DialogHeader>
            <BulkPhotoUpload eventId={selectedEvent?.id} onSuccess={() => setPhotoDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </TabsContent>

      <TabsContent value="registrations" className="mt-6">
        <EventRegistrationsList />
      </TabsContent>
    </Tabs>
  );
}
