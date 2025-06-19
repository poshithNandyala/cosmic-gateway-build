import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Telescope, Cloud, Sun, Moon, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface StargazingEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location_name: string;
  location_lat: number;
  location_lng: number;
  organizer: string | null;
  event_type: string | null;
}

interface WeatherData {
  temperature: number;
  cloudCover: number;
  visibility: number;
  humidity: number;
  conditions: string;
}

const StargazingGuide = () => {
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [events, setEvents] = useState<StargazingEvent[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState<string>('');

  useEffect(() => {
    getUserLocation();
    fetchStargazingEvents();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Get location name
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setLocationName(`${data.city}, ${data.principalSubdivision}`);
          } catch (error) {
            console.error('Error getting location name:', error);
          }

          // Fetch weather data
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported');
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,cloud_cover,visibility&timezone=auto`
      );
      const data = await response.json();
      
      const current = data.current;
      setWeather({
        temperature: Math.round(current.temperature_2m),
        cloudCover: current.cloud_cover,
        visibility: current.visibility / 1000, // Convert to km
        humidity: current.relative_humidity_2m,
        conditions: getConditionsFromCloudCover(current.cloud_cover)
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStargazingEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('stargazing_events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(6);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching stargazing events:', error);
    }
  };

  const getConditionsFromCloudCover = (cloudCover: number): string => {
    if (cloudCover < 20) return 'Clear';
    if (cloudCover < 40) return 'Partly Cloudy';
    if (cloudCover < 70) return 'Mostly Cloudy';
    return 'Overcast';
  };

  const getStargazingScore = (): { score: number; rating: string; color: string } => {
    if (!weather) return { score: 0, rating: 'Unknown', color: 'gray' };
    
    const cloudScore = Math.max(0, 100 - weather.cloudCover);
    const visibilityScore = Math.min(100, (weather.visibility / 10) * 100);
    const score = Math.round((cloudScore + visibilityScore) / 2);
    
    if (score >= 80) return { score, rating: 'Excellent', color: 'green' };
    if (score >= 60) return { score, rating: 'Good', color: 'blue' };
    if (score >= 40) return { score, rating: 'Fair', color: 'yellow' };
    return { score, rating: 'Poor', color: 'red' };
  };

  const stargazingScore = getStargazingScore();

  if (loading) {
    return (
      <div className="container mx-auto px-6">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Telescope className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          </motion.div>
          <p className="text-xl text-gray-300">Getting your stargazing conditions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Stargazing Guide
          </h2>
          <p className="text-xl text-gray-300">
            Personalized stargazing conditions and nearby events
          </p>
        </div>

        {/* Current Conditions */}
        {userLocation && weather && (
          <Card className="mb-8 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-400/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-400">
                <MapPin className="w-6 h-6" />
                <span>Current Conditions - {locationName}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold text-${stargazingScore.color}-400 mb-2`}>
                    {stargazingScore.score}%
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`border-${stargazingScore.color}-400 text-${stargazingScore.color}-400`}
                  >
                    {stargazingScore.rating}
                  </Badge>
                  <p className="text-sm text-gray-400 mt-1">Viewing Quality</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Cloud className="w-6 h-6 text-blue-400 mr-2" />
                    <span className="text-2xl font-bold text-white">{weather.cloudCover}%</span>
                  </div>
                  <p className="text-sm text-gray-400">Cloud Cover</p>
                  <p className="text-xs text-gray-500">{weather.conditions}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Sun className="w-6 h-6 text-yellow-400 mr-2" />
                    <span className="text-2xl font-bold text-white">{weather.temperature}°C</span>
                  </div>
                  <p className="text-sm text-gray-400">Temperature</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-6 h-6 text-purple-400 mr-2" />
                    <span className="text-2xl font-bold text-white">{weather.visibility.toFixed(1)}km</span>
                  </div>
                  <p className="text-sm text-gray-400">Visibility</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Best Viewing Times */}
        <Card className="mb-8 bg-black/30 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Moon className="w-6 h-6" />
              <span>Best Viewing Times Tonight</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">Evening Twilight</h4>
                <p className="text-2xl font-bold text-purple-400">8:30 PM</p>
                <p className="text-sm text-gray-400">Civil twilight ends</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">Astronomical Dark</h4>
                <p className="text-2xl font-bold text-indigo-400">9:45 PM</p>
                <p className="text-sm text-gray-400">Best viewing begins</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">Morning Twilight</h4>
                <p className="text-2xl font-bold text-orange-400">5:30 AM</p>
                <p className="text-sm text-gray-400">Viewing window ends</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StargazingGuide;
