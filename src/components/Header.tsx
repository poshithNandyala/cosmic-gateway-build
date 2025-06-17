
import { motion } from 'framer-motion';
import { Rocket, Satellite, Calendar, Globe, Sun } from 'lucide-react';

interface HeaderProps {
  currentSection: string;
}

const Header = ({ currentSection }: HeaderProps) => {
  const navItems = [
    { id: 'hero', label: 'Home', icon: Rocket },
    { id: 'iss', label: 'ISS Tracker', icon: Satellite },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'solar', label: 'Solar System', icon: Globe },
    { id: 'weather', label: 'Space Weather', icon: Sun },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cosmic Navigator
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
