import { Calendar, MapPin, ArrowRight, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { events } from '@/data/events';
import { Link } from 'react-router-dom';
export default function UpcomingEvents() {
  const upcomingEvents = events.filter(e => e.status === 'upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', {
        month: 'short'
      }),
      year: date.getFullYear()
    };
  };
  const getDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  return <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Don't Miss Out
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us at our upcoming events and be part of the positive change in communities worldwide
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {upcomingEvents.map(event => {
          const date = formatDate(event.date);
          const daysUntil = getDaysUntil(event.date);
          return <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white rounded-xl p-2 text-center shadow-lg min-w-[60px]">
                    <div className="text-2xl font-bold text-gray-900 leading-none">{date.day}</div>
                    <div className="text-xs font-medium text-blue-600 uppercase">{date.month}</div>
                  </div>

                  {/* Days Until Badge */}
                  {daysUntil > 0 && daysUntil <= 30 && <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                    </div>}

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-green-500" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600" data-mixed-content="true" data-mixed-content="true"><Users className="w-4 h-4 mr-2 text-purple-500" />{event.registeredCount}{event.maxCapacity && <span className="text-gray-400 ml-1" data-mixed-content="true" data-mixed-content="true">/ {event.maxCapacity} spots</span>}102</div>
                  </div>

                  {/* Progress Bar for Registration */}
                  {event.maxCapacity && <div className="mb-4">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" style={{
                    width: `${Math.min(event.registeredCount / event.maxCapacity * 100, 100)}%`
                  }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.maxCapacity - event.registeredCount > 0 ? `${event.maxCapacity - event.registeredCount} spots left` : 'Event is full'}
                      </p>
                    </div>}

                  <Link to={`/events/${event.id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group/btn">
                      Register Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/events">
            <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg group">
              View All Events
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Bottom Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm" data-mixed-content="true" data-mixed-content="true">
            Can't find an event near you?{' '}
            <Link to="/contact" className="text-blue-600 hover:underline font-medium">
              Contact us
            </Link>
            {' '}to suggest a location or{' '}
            <Link to="/volunteer" className="text-blue-600 hover:underline font-medium">
              volunteer
            </Link>
            {' '}to help organize one.
          </p>
        </div>
      </div>
    </section>;
}