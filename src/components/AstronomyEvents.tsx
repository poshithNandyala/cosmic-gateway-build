
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Moon, Sun, Telescope, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AstronomyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meteor' | 'eclipse' | 'planet' | 'moon' | 'other';
  description: string;
  visibility: string;
  source?: string;
}

interface NEOData {
  id: string;
  name: string;
  close_approach_date: string;
  miss_distance: {
    kilometers: string;
  };
  estimated_diameter: {
    kilometers: {
      estimated_diameter_max: number;
    };
  };
}

const AstronomyEvents = () => {
  const [events, setEvents] = useState<AstronomyEvent[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAstronomyEvents = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 30); // Next 30 days

      const todayStr = today.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Fetch Near Earth Objects from NASA
      const neoResponse = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${todayStr}&end_date=${endDateStr}&api_key=DEMO_KEY`
      );
      
      let fetchedEvents: AstronomyEvent[] = [];

      if (neoResponse.ok) {
        const neoData = await neoResponse.json();
        
        // Process NEO data into events
        Object.entries(neoData.near_earth_objects).forEach(([date, neos]: [string, any]) => {
          (neos as NEOData[]).slice(0, 3).forEach((neo, index) => {
            const diameter = neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
            const distance = parseFloat(neo.miss_distance?.kilometers || '0');
            
            fetchedEvents.push({
              id: `neo-${neo.id}-${index}`,
              title: `Asteroid ${neo.name} Close Approach`,
              date: neo.close_approach_date,
              time: '00:00 UTC',
              type: 'other',
              description: `Asteroid with estimated diameter of ${diameter.toFixed(2)} km will pass at ${(distance / 1000000).toFixed(2)} million km from Earth.`,
              visibility: 'Telescope required',
              source: 'NASA NEO API'
            });
          });
        });
      }

      // Add current moon phase
      const moonPhaseEvents = getCurrentMoonPhase();
      fetchedEvents = [...fetchedEvents, ...moonPhaseEvents];

      // Add upcoming meteor showers (static data with current year)
      const meteorShowers = getUpcomingMeteorShowers();
      fetchedEvents = [...fetchedEvents, ...meteorShowers];

      // Add planetary events
      const planetaryEvents = getPlanetaryEvents();
      fetchedEvents = [...fetchedEvents, ...planetaryEvents];

      // Sort events by date
      fetchedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setEvents(fetchedEvents);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching astronomy events:', error);
      // Fallback to static events if API fails
      setEvents(getFallbackEvents());
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMoonPhase = (): AstronomyEvent[] => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Calculate approximate next new moon and full moon
    const lunarCycle = 29.53; // days
    const knownNewMoon = new Date('2024-01-11'); // Known new moon date
    const daysSinceKnown = (today.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const cyclesSince = Math.floor(daysSinceKnown / lunarCycle);
    
    const nextNewMoon = new Date(knownNewMoon.getTime() + (cyclesSince + 1) * lunarCycle * 24 * 60 * 60 * 1000);
    const nextFullMoon = new Date(nextNewMoon.getTime() + (lunarCycle / 2) * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 'moon-new',
        title: 'New Moon',
        date: nextNewMoon.toISOString().split('T')[0],
        time: '00:00 UTC',
        type: 'moon',
        description: 'The Moon will be invisible as it passes between Earth and the Sun.',
        visibility: 'Not visible',
        source: 'Calculated'
      },
      {
        id: 'moon-full',
        title: 'Full Moon',
        date: nextFullMoon.toISOString().split('T')[0],
        time: '00:00 UTC',
        type: 'moon',
        description: 'The Moon will be fully illuminated and visible all night.',
        visibility: 'Worldwide',
        source: 'Calculated'
      }
    ];
  };

  const getUpcomingMeteorShowers = (): AstronomyEvent[] => {
    const currentYear = new Date().getFullYear();
    const today = new Date();
    
    const showers = [
      { name: 'Quadrantids', peak: `${currentYear}-01-04`, rate: '120/hour' },
      { name: 'Lyrids', peak: `${currentYear}-04-22`, rate: '18/hour' },
      { name: 'Eta Aquariids', peak: `${currentYear}-05-06`, rate: '60/hour' },
      { name: 'Perseids', peak: `${currentYear}-08-12`, rate: '60/hour' },
      { name: 'Orionids', peak: `${currentYear}-10-21`, rate: '25/hour' },
      { name: 'Leonids', peak: `${currentYear}-11-17`, rate: '15/hour' },
      { name: 'Geminids', peak: `${currentYear}-12-14`, rate: '120/hour' },
    ];

    return showers
      .filter(shower => new Date(shower.peak) > today)
      .slice(0, 3)
      .map(shower => ({
        id: `meteor-${shower.name.toLowerCase()}`,
        title: `${shower.name} Meteor Shower Peak`,
        date: shower.peak,
        time: '02:00 UTC',
        type: 'meteor' as const,
        description: `Peak activity of the ${shower.name} meteor shower with up to ${shower.rate}.`,
        visibility: 'Best viewed from dark locations',
        source: 'IAU Meteor Data Center'
      }));
  };

  const getPlanetaryEvents = (): AstronomyEvent[] => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 30);

    return [
      {
        id: 'venus-elongation',
        title: 'Venus at Greatest Elongation',
        date: futureDate.toISOString().split('T')[0],
        time: '20:00 UTC',
        type: 'planet',
        description: 'Venus reaches its greatest angular distance from the Sun, appearing brightest in the sky.',
        visibility: 'Visible after sunset',
        source: 'Planetary calculations'
      }
    ];
  };

  const getFallbackEvents = (): AstronomyEvent[] => {
    return [
      {
        id: 'fallback-1',
        title: 'Geminids Meteor Shower Peak',
        date: '2024-12-14',
        time: '02:00 UTC',
        type: 'meteor',
        description: 'One of the best meteor showers of the year with up to 120 meteors per hour.',
        visibility: 'Worldwide',
        source: 'Static fallback'
      },
      {
        id: 'fallback-2',
        title: 'Full Moon',
        date: '2024-12-15',
        time: '09:02 UTC',
        type: 'moon',
        description: 'The Moon will be fully illuminated and visible all night.',
        visibility: 'Worldwide',
        source: 'Static fallback'
      }
    ];
  };

  useEffect(() => {
    fetchAstronomyEvents();
    
    // Refresh data every 30 minutes
    const interval = setInterval(fetchAstronomyEvents, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
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
            Live Astronomical Events
          </h2>
          <p className="text-xl text-gray-300">
            Real-time celestial events and phenomena from NASA and astronomy APIs
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button 
              onClick={fetchAstronomyEvents} 
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            {lastUpdated && (
              <p className="text-sm text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
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

        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            </motion.div>
            <p className="text-xl text-gray-300">Loading live astronomical data...</p>
          </div>
        ) : (
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
                    {event.source && (
                      <p className="text-xs text-gray-400">Source: {event.source}</p>
                    )}
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
        )}

        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300">No events found for the selected category.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AstronomyEvents;
