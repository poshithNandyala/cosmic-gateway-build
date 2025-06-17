
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Satellite, MapPin, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ISSData {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  timestamp: number;
}

const ISSTracker = () => {
  const [issData, setIssData] = useState<ISSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [astronauts, setAstronauts] = useState<any[]>([]);

  useEffect(() => {
    const fetchISSData = async () => {
      try {
        // Fetch ISS position
        const positionResponse = await fetch('http://api.open-notify.org/iss-now.json');
        const positionData = await positionResponse.json();
        
        // Fetch people in space
        const peopleResponse = await fetch('http://api.open-notify.org/astros.json');
        const peopleData = await peopleResponse.json();
        
        setIssData({
          latitude: parseFloat(positionData.iss_position.latitude),
          longitude: parseFloat(positionData.iss_position.longitude),
          altitude: 408, // Average ISS altitude in km
          velocity: 27600, // Average ISS speed in km/h
          visibility: 'Visible',
          timestamp: positionData.timestamp * 1000,
        });
        
        setAstronauts(peopleData.people.filter((person: any) => person.craft === 'ISS'));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ISS data:', error);
        // Fallback data for demo
        setIssData({
          latitude: 25.7617,
          longitude: -80.1918,
          altitude: 408,
          velocity: 27600,
          visibility: 'Visible',
          timestamp: Date.now(),
        });
        setAstronauts([
          { name: 'Demo Astronaut 1', craft: 'ISS' },
          { name: 'Demo Astronaut 2', craft: 'ISS' },
        ]);
        setLoading(false);
      }
    };

    fetchISSData();
    const interval = setInterval(fetchISSData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Satellite className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          </motion.div>
          <p className="text-xl text-gray-300">Connecting to the International Space Station...</p>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ISS Live Tracker
          </h2>
          <p className="text-xl text-gray-300">
            Follow the International Space Station as it orbits Earth at 27,600 km/h
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/30 border-blue-400/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-blue-400">
                <MapPin className="w-5 h-5" />
                <span>Position</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <p className="text-sm text-gray-400">Latitude</p>
                <p className="text-lg font-semibold">{issData?.latitude.toFixed(4)}°</p>
                <p className="text-sm text-gray-400 mt-2">Longitude</p>
                <p className="text-lg font-semibold">{issData?.longitude.toFixed(4)}°</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-purple-400/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-purple-400">
                <Satellite className="w-5 h-5" />
                <span>Altitude</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <p className="text-3xl font-bold">{issData?.altitude}</p>
                <p className="text-gray-400">kilometers</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-green-400/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-green-400">
                <Clock className="w-5 h-5" />
                <span>Velocity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <p className="text-3xl font-bold">{issData?.velocity.toLocaleString()}</p>
                <p className="text-gray-400">km/h</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-orange-400/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-orange-400">
                <Users className="w-5 h-5" />
                <span>Crew</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <p className="text-3xl font-bold">{astronauts.length}</p>
                <p className="text-gray-400">astronauts aboard</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Current Crew Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {astronauts.map((astronaut, index) => (
                <motion.div
                  key={astronaut.name}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 p-4 rounded-lg"
                >
                  <p className="text-white font-semibold">{astronaut.name}</p>
                  <p className="text-gray-400 text-sm">International Space Station</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ISSTracker;
