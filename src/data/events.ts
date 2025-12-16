export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  capacity: number;
  registeredCount: number;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Annual Charity Gala',
    description: 'Join us for an elegant evening of dining, entertainment, and fundraising to support our education programs across West Africa.',
    date: '2026-07-11',
    time: '6:00 PM - 11:00 PM',
    location: 'Radisson Blu Mammy Yoko Hotel',
    address: 'Aberdeen, Freetown, Sierra Leone',
    latitude: 8.4657,
    longitude: -13.2317,
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1761495826691_fd286b27.webp',
    capacity: 200,
    registeredCount: 142,
    category: 'Fundraiser',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Substance Abuse & Rapid Drugs Testing Training',
    description: 'Comprehensive training on substance abuse awareness, prevention strategies, and rapid drug testing procedures for healthcare professionals and community workers.',
    date: '2026-02-19',
    time: '9:00 AM - 4:00 PM',
    location: 'Monrovia Convention Center',
    address: 'Tubman Boulevard, Monrovia, Liberia',
    latitude: 6.3156,
    longitude: -10.8074,
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1761495832019_4d904a59.webp',
    capacity: 500,
    registeredCount: 287,
    category: 'Health',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Youth Sports Tournament',
    description: 'Annual soccer tournament for youth ages 8-16. Promoting health, teamwork, and community spirit.',
    date: '2026-10-10',
    time: '8:00 AM - 6:00 PM',
    location: 'Fayetteville Athletic Complex',
    address: '2301 Coliseum Drive, Fayetteville, NC 28306, USA',
    latitude: 35.0527,
    longitude: -78.8784,
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1761495830558_d0ba872d.webp',
    capacity: 300,
    registeredCount: 156,
    category: 'Sports',
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Education Workshop Series',
    description: 'Professional development workshops for teachers and educators focusing on innovative teaching methods.',
    date: '2026-05-13',
    time: '10:00 AM - 3:00 PM',
    location: 'Learning Center Auditorium',
    address: '321 Education Blvd, Manhattan, NY 10016',
    latitude: 40.7489,
    longitude: -73.9680,
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1765669185429_dad945c9.jpg',
    capacity: 150,
    registeredCount: 98,
    category: 'Education',
    status: 'upcoming'
  },

  {
    id: '5',
    title: 'Summer Festival Fundraiser',
    description: 'Family-friendly festival with food, games, live music, and activities. All proceeds support our programs.',
    date: '2026-06-20',
    time: '11:00 AM - 7:00 PM',
    location: 'Piedmont Park',
    address: 'Piedmont Park, Atlanta, Georgia 30309',
    latitude: 33.7879,
    longitude: -84.3732,
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1761495827508_8d00cf83.webp',
    capacity: 1000,
    registeredCount: 623,
    category: 'Fundraiser',
    status: 'upcoming'
  },

  {
    id: '6',
    title: 'Cultural Heritage Celebration',
    description: 'Celebrate West African culture with traditional music, dance, food, and art exhibitions.',
    date: '2026-10-17',
    time: '5:00 PM - 10:00 PM',
    location: 'Georgetown Waterfront Park',
    address: 'Front Street, Georgetown, South Carolina 29440',
    latitude: 33.3668,
    longitude: -79.2948,
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/68ca0536291bf6a7dcd8df21_1761495833152_710b7a78.webp',
    capacity: 400,
    registeredCount: 201,
    category: 'Cultural',
    status: 'upcoming'
  }
];

