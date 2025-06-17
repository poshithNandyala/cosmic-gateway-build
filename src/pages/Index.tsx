
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ISSTracker from '@/components/ISSTracker';
import AstronomyEvents from '@/components/AstronomyEvents';
import SolarSystem from '@/components/SolarSystem';
import SpaceWeather from '@/components/SpaceWeather';
import StarField from '@/components/StarField';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'iss', 'events', 'solar', 'weather'];
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden relative">
      <StarField />
      <Header currentSection={currentSection} />
      
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
        
        <section id="solar" className="py-20">
          <SolarSystem />
        </section>
        
        <section id="weather" className="py-20">
          <SpaceWeather />
        </section>
      </motion.main>
      
      <footer className="text-center py-8 text-gray-400">
        <p>Built for The Stellar Gateway Hackathon 🚀</p>
        <p className="text-sm mt-2">Exploring the cosmos through technology</p>
      </footer>
    </div>
  );
};

export default Index;
