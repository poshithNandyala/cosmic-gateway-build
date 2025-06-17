
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Moon, Sun, Telescope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AstronomyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meteor' | 'eclipse' | 'planet' | 'moon' | 'other';
  description: string;
  visibility: string;
}

const AstronomyEvents = () => {
  const [events, setEvents] = useState<AstronomyEvent[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    // Mock astronomy events data
    const mockEvents: AstronomyEvent[] = [
      {
        id: '1',
        title: 'Geminids Meteor Shower Peak',
        date: '2024-12-14',
        time: '02:00 UTC',
        type: 'meteor',
        description: 'One of the best meteor showers of the year with up to 120 meteors per hour.',
        visibility: 'Worldwide',
      },
      {
        id: '2',
        title: 'Full Wolf Moon',
        date: '2024-01-25',
        time: '17:54 UTC',
        type: 'moon',
        description: 'The first full moon of 2024, traditionally called the Wolf Moon.',
        visibility: 'Worldwide',
      },
      {
        id: '3',
        title: 'Venus at Greatest Elongation',
        date: '2024-01-09',
        time: '20:00 UTC',
        type: 'planet',
        description: 'Venus will reach its greatest eastern elongation, appearing brightest in the evening sky.',
        visibility: 'Western Hemisphere',
      },
      {
        id: '4',
        title: 'Lunar Eclipse',
        date: '2024-03-25',
        time: '07:13 UTC',
        type: 'eclipse',
        description: 'A penumbral lunar eclipse visible from Europe, Asia, Australia, and Africa.',
        visibility: 'Europe, Asia, Australia, Africa',
      },
      {
        id: '5',
        title: 'Perseid Meteor Shower',
        date: '2024-08-12',
        time: '21:00 UTC',
        type: 'meteor',
        description: 'Annual meteor shower with up to 60 meteors per hour at peak.',
        visibility: 'Northern Hemisphere',
      },
    ];

    setEvents(mockEvents);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meteor':
        return <Star className="w-5 h-5" />;
      case 'eclipse':
        return <Sun className="w-5 h-5" />;
      case 'moon':
        return <Moon className="w-5 h-5" />;
      case 'planet':
        return <Telescope className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meteor':
        return 'text-blue-400 border-blue-400/30 bg-blue-500/20';
      case 'eclipse':
        return 'text-orange-400 border-orange-400/30 bg-orange-500/20';
      case 'moon':
        return 'text-gray-300 border-gray-400/30 bg-gray-500/20';
      case 'planet':
        return 'text-purple-400 border-purple-400/30 bg-purple-500/20';
      default:
        return 'text-green-400 border-green-400/30 bg-green-500/20';
    }
  };

  const filteredEvents = selectedType === 'all' ? events : events.filter(event => event.type === selectedType);

  const eventTypes = [
    { value: 'all', label: 'All Events', icon: Calendar },
    { value: 'meteor', label: 'Meteor Showers', icon: Star },
    { value: 'eclipse', label: 'Eclipses', icon: Sun },
    { value: 'moon', label: 'Moon Phases', icon: Moon },
    { value: 'planet', label: 'Planetary Events', icon: Telescope },
  ];

  return (
    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Upcoming Astronomical Events
          </h2>
          <p className="text-xl text-gray-300">
            Don't miss these celestial spectacles visible from Earth
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {eventTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  selectedType === type.value
                    ? 'bg-purple-500/30 border-purple-400 text-purple-400'
                    : 'bg-black/30 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{type.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`bg-black/30 backdrop-blur-sm border ${getEventColor(event.type)} hover:scale-105 transition-transform duration-300`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className={getEventColor(event.type)}>
                      {getEventIcon(event.type)}
                    </span>
                    <span className="text-white">{event.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white">{event.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Visibility:</span>
                      <span className="text-white">{event.visibility}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AstronomyEvents;
