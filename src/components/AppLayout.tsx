import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './Header';
import WelcomeBanner from './WelcomeBanner';
import Hero from './Hero';
import HowCanWeHelp from './HowCanWeHelp';
import Pillars from './Pillars';
import FounderMessage from './FounderMessage';
import AboutUs from './AboutUs';
import Leadership from './Leadership';
import Conferences from './Conferences';
import Courses from './Courses';
import UpcomingEvents from './UpcomingEvents';
import Footer from './Footer';
import BackToTop from './BackToTop';
import QuickActions from './QuickActions';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-to-main"
      >
        Skip to main content
      </a>

      {/* Welcome/Announcement Banner */}
      <WelcomeBanner 
        message="Join us for our upcoming Education for All Summit in Monrovia, Liberia!"
        linkText="Register Now"
        linkHref="/#conferences"
        variant="announcement"
      />

      <Header />
      
      <main id="main-content">
        <Hero />
        <HowCanWeHelp />
        <Pillars />
        <FounderMessage />
        <AboutUs />
        <Leadership />
        <UpcomingEvents />
        <Conferences />
        <Courses />
      </main>
      
      <Footer />
      
      {/* Floating elements */}
      <BackToTop />
      <QuickActions />
    </div>
  );
};

export default AppLayout;
