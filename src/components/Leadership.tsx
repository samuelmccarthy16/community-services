import React from 'react';
import TeamCard from './TeamCard';

const Leadership: React.FC = () => {
  const boardMembers = [
    {
      name: "SSG Eric Twum",
      title: "Board Chairman",
      bio: "Distinguished military leader and humanitarian advocate with extensive experience in international relief operations and strategic program development.",
      image: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760304715377_c4355341.jpg",
      education: "Military Leadership, Strategic Studies",
      experience: "Staff Sergeant, U.S. Army"
    },
    {
      name: "Pastor Jimmy S Philips",
      title: "Vice Chairman",
      bio: "Dedicated spiritual leader and community advocate committed to uplifting lives through faith-based initiatives and compassionate service.",
      image: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1765661704306_252a97b5.jpeg",
      education: "Pastoral Ministry & Leadership",
      experience: "Community & Faith Leadership"
    },

    {
      name: "Mrs. Sylvia Strickland",
      title: "Treasurer",
      bio: "Experienced financial professional with a passion for nonprofit financial stewardship and transparent fiscal management.",
      image: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760308240670_933bdf7b.jpg",
      education: "MBA Finance, CPA",
      experience: "20+ years nonprofit finance"
    },



    {
      name: "Mrs. Sierra Twum",
      title: "President / Founder",
      bio: "Visionary leader and humanitarian dedicated to transforming lives through compassionate service and sustainable community development initiatives.",
      image: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760308665716_0037a576.jpg",
      education: "PhD (C) Community Care Counseling, Liberty University",
      experience: "Founder & President"
    },

    {
      name: "Mr. Charles Vonleh",
      title: "Executive Director Liberia Chapter",
      bio: "Former military officer and emergency management specialist leading our rapid response and disaster preparedness initiatives.",
      image: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760324249550_47c204aa.jpg",
      education: "MS Emergency Management",
      experience: "20 years military service"
    },

    {
      name: "Mrs. Rosaline Browne",
      title: "Executive Director Sierra Leone Chapter",
      bio: "Passionate advocate for human rights and social justice, overseeing our comprehensive humanitarian assistance programs globally.",
      image: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760838699165_65c8d7be.jpg",
      education: "MA International Relations",
      experience: "Former UN Program Officer"
    },
    {
      name: "Ms. Serenity Boyd",
      title: "Youth President",
      bio: "Dynamic youth leader committed to empowering young people and driving positive change through youth-led initiatives and community engagement.",
      image: "https://d64gsuwffb70l.cloudfront.net/68bc23b62963e7ffb41a2a8a_1760841388121_d0e2ea1a.jpg",
      education: "Youth Leadership & Development",
      experience: "Youth Advocacy & Engagement"
    }
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Leadership Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated professionals who guide our mission and ensure our programs 
            create lasting impact in communities around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boardMembers.map((member, index) => (
            <TeamCard
              key={index}
              name={member.name}
              title={member.title}
              bio={member.bio}
              image={member.image}
              education={member.education}
              experience={member.experience}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;