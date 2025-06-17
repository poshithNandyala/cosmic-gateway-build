
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Rocket, Telescope, Satellite, Users, MessageCircle, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface EnhancedHeaderProps {
  currentSection: string;
}

const EnhancedHeader = ({ currentSection }: EnhancedHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { id: 'hero', label: 'Home', icon: Rocket, path: '/' },
    { id: 'iss', label: 'ISS Tracker', icon: Satellite, path: '/#iss' },
    { id: 'crew', label: 'Crew Details', icon: Users, path: '/crew' },
    { id: 'events', label: 'Events', icon: Telescope, path: '/#events' },
    { id: 'solar', label: 'Solar System', icon: Rocket, path: '/#solar' },
    { id: 'weather', label: 'Space Weather', icon: Telescope, path: '/#weather' },
    { id: 'stargazing', label: 'Stargazing', icon: Users, path: '/#stargazing' },
    { id: 'chat', label: 'AI Tutor', icon: MessageCircle, path: '/#chat' },
  ];

  const handleNavigation = (item: any) => {
    if (item.path.startsWith('/#')) {
      // Scroll to section on home page
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => scrollToSection(item.id), 100);
      } else {
        scrollToSection(item.id);
      }
    } else {
      // Navigate to different page
      navigate(item.path);
    }
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur opacity-30 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Nebula Nexus
              </h1>
              <p className="text-xs text-gray-400">Stellar Gateway Quest</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = (item.path === '/' && window.location.pathname === '/') || 
                              (item.path !== '/' && window.location.pathname === item.path) ||
                              currentSection === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleNavigation(item)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-500/30 text-purple-400 border border-purple-400/50'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Auth Button */}
            {user ? (
              <div className="hidden lg:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="text-gray-300 hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="hidden lg:flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = (item.path === '/' && window.location.pathname === '/') || 
                                (item.path !== '/' && window.location.pathname === item.path) ||
                                currentSection === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 justify-start ${
                      isActive
                        ? 'bg-purple-500/30 text-purple-400 border border-purple-400/50'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              {/* Mobile Auth */}
              <div className="border-t border-white/10 pt-4 mt-4">
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full justify-start text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <User className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full justify-start text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign Out</span>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full justify-start text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </Button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default EnhancedHeader;
