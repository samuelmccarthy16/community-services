import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Calendar, Award } from 'lucide-react';

export default function EventAnalytics() {
  const [stats, setStats] = useState({ total: 0, upcoming: 0, registrations: 0, capacity: 0 });
  const [eventData, setEventData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const { data: events } = await supabase.from('events').select('*');
    const { data: registrations } = await supabase.from('event_registrations').select('*');
    
    const upcoming = events?.filter(e => new Date(e.date) > new Date()).length || 0;
    const totalReg = registrations?.length || 0;
    const totalCap = events?.reduce((sum, e) => sum + (e.capacity || 0), 0) || 0;

    setStats({ total: events?.length || 0, upcoming, registrations: totalReg, capacity: totalCap });

    // Event popularity
    const eventCounts = events?.map(e => ({
      name: e.title.substring(0, 20),
      registrations: registrations?.filter(r => r.event_id === e.id).length || 0
    })) || [];
    setEventData(eventCounts.slice(0, 5));

    // Registration trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    
    const trend = last7Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: registrations?.filter(r => r.created_at?.startsWith(date)).length || 0
    }));
    setTrendData(trend);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <Calendar className="h-8 w-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Events</p>
        </Card>
        <Card className="p-6">
          <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold">{stats.upcoming}</p>
          <p className="text-sm text-gray-600">Upcoming</p>
        </Card>
        <Card className="p-6">
          <Users className="h-8 w-8 text-purple-600 mb-2" />
          <p className="text-2xl font-bold">{stats.registrations}</p>
          <p className="text-sm text-gray-600">Registrations</p>
        </Card>
        <Card className="p-6">
          <Award className="h-8 w-8 text-orange-600 mb-2" />
          <p className="text-2xl font-bold">{stats.capacity}</p>
          <p className="text-sm text-gray-600">Total Capacity</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Registration Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Popular Events</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={eventData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="registrations" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
