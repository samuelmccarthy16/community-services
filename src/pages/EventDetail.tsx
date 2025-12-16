import { useParams, Link } from 'react-router-dom';
import { events } from '@/data/events';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EventDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const spotsLeft = event.capacity - event.registeredCount;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied!',
      description: 'Event link copied to clipboard',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Link to="/events">
              <Button variant="ghost" className="text-white mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
            <h1 className="text-5xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-xl text-white">{event.category}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-lg">{event.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-3 mt-1 text-blue-600" />
                    <div>
                      <p className="font-semibold">Date</p>
                      <p className="text-gray-600">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 mr-3 mt-1 text-blue-600" />
                    <div>
                      <p className="font-semibold">Time</p>
                      <p className="text-gray-600">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 mt-1 text-blue-600" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                      <p className="text-sm text-gray-500">{event.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="w-5 h-5 mr-3 mt-1 text-blue-600" />
                    <div>
                      <p className="font-semibold">Capacity</p>
                      <p className="text-gray-600">
                        {event.registeredCount} / {event.capacity} registered
                      </p>
                      {spotsLeft > 0 && (
                        <p className="text-sm text-orange-600 font-semibold">
                          {spotsLeft} spots remaining
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${event.latitude},${event.longitude}&zoom=15`}
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Register for Event</CardTitle>
              </CardHeader>
              <CardContent>
                {spotsLeft > 0 ? (
                  <EventRegistrationForm 
                    eventId={event.id} 
                    eventTitle={event.title}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-lg font-semibold text-red-600 mb-4">
                      Event is Full
                    </p>
                    <p className="text-gray-600">
                      This event has reached maximum capacity.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share Button */}
            <Button 
              onClick={handleShare}
              variant="outline" 
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
