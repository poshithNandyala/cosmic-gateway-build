import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from '@/contexts/ThemeContext';
import EnhancedHeader from '@/components/enhanced-header';
import Hero from '@/components/Hero';
import ISSTracker from '@/components/ISSTracker';
import AstronomyEvents from '@/components/AstronomyEvents';
import SolarSystem from '@/components/SolarSystem';
import SpaceWeather from '@/components/SpaceWeather';
import SpaceXTracker from '@/components/SpaceXTracker';
import StargazingGuide from '@/components/StargazingGuide';
import AITutor from '@/components/AITutor';
import StarField from '@/components/StarField';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('hero');
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'iss', 'events', 'spacex', 'solar', 'weather', 'stargazing', 'chat'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:from-blue-50 light:via-purple-50 light:to-pink-50 text-white dark:text-white light:text-gray-900 overflow-x-hidden relative transition-all duration-300">
        <StarField />
        <EnhancedHeader currentSection={currentSection} />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <section id="hero">
            <Hero />
          </section>
          
          <section id="iss" className="py-20">
            <ISSTracker />
          </section>
          
          <section id="events" className="py-20">
            <AstronomyEvents />
          </section>

          <section id="spacex" className="py-20">
            <SpaceXTracker />
          </section>
          
          <section id="solar" className="py-20">
            <SolarSystem />
          </section>
          
          <section id="weather" className="py-20">
            <SpaceWeather />
          </section>

          <section id="stargazing" className="py-20">
            <StargazingGuide />
          </section>

          <section id="chat" className="py-20">
            <AITutor />
          </section>
        </motion.main>
        
       <footer className="text-center py-8 text-gray-400">
  <p>Built for The Stellar Gateway Hackathon 🚀</p>
  <p className="text-sm mt-2">
    Exploring the cosmos through technology with Cosmic Navigator
  </p>
  <p className="text-xs mt-4">
    Made with ❤️ by{" "}
    <a
      href="https://github.com/poshith"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white font-medium hover:underline"
    >
      Poshith
    </a>
  </p>
</footer>

      </div>
    </ThemeProvider>
  );
};

export default Index;
