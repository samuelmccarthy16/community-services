export type MediaType = 'photo' | 'video';
export type MediaStatus = 'approved' | 'pending' | 'rejected';

export interface GalleryMedia {
  id?: string;
  title: string;
  description: string;
  media_url: string;
  thumbnail_url?: string;
  media_type: MediaType;
  location: string;
  activity_date: string;
  duration?: string; // For videos
  created_at?: string;
  status?: MediaStatus;
  file_size?: number;
}


export const galleryMedia: GalleryMedia[] = [
  { 
    title: "Glenn Krystle's Manor Visit", 
    description: "Community outreach at Glenn Krystle's Manor", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842092546_98876d87.jpg", 
    media_type: 'photo',
    location: "USA", 
    activity_date: "2024-01-15" 
  },
  { 
    title: "Substance Abuse Prevention", 
    description: "Collaboration with Africa Union Trading Company", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842093467_14afbdc8.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-02-10" 
  },
  { 
    title: "Holiday Giving", 
    description: "Christmas gift distribution to families", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842094074_3bd427b6.jpg", 
    media_type: 'photo',
    location: "USA", 
    activity_date: "2023-12-20" 
  },
  { 
    title: "Medical Team Training", 
    description: "Healthcare professionals training session", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842094803_708ed0fb.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-03-05" 
  },
  { 
    title: "Certificate Ceremony", 
    description: "Graduation and certificate presentation", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842095213_91ec6f6e.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-02-15" 
  },
  { 
    title: "Computer Literacy Program", 
    description: "Youth computer training initiative", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842095920_ae686fcc.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-03-10" 
  },
  { 
    title: "Destiny Recovery Programme", 
    description: "Community outreach and support", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842096746_1bc31675.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-02-20" 
  },
  { 
    title: "Theresa Nah Foundation", 
    description: "Educational support and rice distribution", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842097269_cedc4dac.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-01-25" 
  },
  { 
    title: "Partnership Recognition", 
    description: "Certificate presentation ceremony", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842097791_998a4bc9.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-03-15" 
  },
  { 
    title: "Medical Outreach Team", 
    description: "Healthcare professionals in white uniforms", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842098246_aee4451d.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-02-25" 
  },
  { 
    title: "Certificate Achievement", 
    description: "Individual recognition ceremony", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842098784_5953926d.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-03-20" 
  },
  { 
    title: "Group Graduation", 
    description: "Team certificate presentation", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842099301_4f457595.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-02-28" 
  },
  { 
    title: "Drug Enforcement Collaboration", 
    description: "Partnership with LDEA Bong County", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842099810_45fc8e51.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-03-25" 
  },
  { 
    title: "Leadership Team", 
    description: "Organization leadership and partners", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842100319_0c74119b.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-03-30" 
  },
  { 
    title: "Glenn Krystle's Manor", 
    description: "Founder at community center", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842100898_b97db377.jpg", 
    media_type: 'photo',
    location: "USA", 
    activity_date: "2024-01-10" 
  },
  { 
    title: "Medical Team Unity", 
    description: "Healthcare workers collaboration", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842101371_33842047.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-04-05" 
  },
  { 
    title: "Youth Empowerment", 
    description: "Community development with youth", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842101687_74b778a8.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-04-10" 
  },
  { 
    title: "Technical Training", 
    description: "Computer hardware repair training", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842102440_1a426c18.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-04-15" 
  },
  { 
    title: "Community Recognition", 
    description: "Achievement celebration with partners", 
    media_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842102947_7b5d4a41.jpg", 
    media_type: 'photo',
    location: "Liberia", 
    activity_date: "2024-04-20" 
  },
  // Sample video entries
  {
    title: "Community Outreach Documentary",
    description: "A look at our community outreach programs and their impact on local families",
    media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842092546_98876d87.jpg",
    media_type: 'video',
    location: "Liberia",
    activity_date: "2024-05-01",
    duration: "2:30"
  },
  {
    title: "Medical Mission Highlights",
    description: "Highlights from our recent medical mission providing healthcare to underserved communities",
    media_url: "https://www.w3schools.com/html/movie.mp4",
    thumbnail_url: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760842094803_708ed0fb.jpg",
    media_type: 'video',
    location: "Liberia",
    activity_date: "2024-05-15",
    duration: "3:45"
  }
];
