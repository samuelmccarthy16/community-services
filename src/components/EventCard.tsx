import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Event } from '@/data/events';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const spotsLeft = event.capacity - event.registeredCount;
  const percentFull = (event.registeredCount / event.capacity) * 100;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-4 right-4 bg-white text-gray-900">
          {event.category}
        </Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {event.registeredCount} / {event.capacity} registered
            {spotsLeft < 20 && spotsLeft > 0 && (
              <span className="ml-2 text-orange-600 font-semibold">
                Only {spotsLeft} spots left!
              </span>
            )}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${percentFull}%` }}
          />
        </div>

        <Link to={`/events/${event.id}`}>
          <Button className="w-full">View Details & Register</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
