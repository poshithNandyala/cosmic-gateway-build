
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Calendar, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StarField from '@/components/StarField';

interface CrewMember {
  name: string;
  craft: string;
  nationality?: string;
  role?: string;
  mission_start?: string;
  bio?: string;
  photo_url?: string;
}

const CrewDetails = () => {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrewData();
  }, []);

  const fetchCrewData = async () => {
    try {
      const response = await fetch('http://api.open-notify.org/astros.json');
      const data = await response.json();
      
      // Enhance crew data with mock additional information
      const enhancedCrew = data.people
        .filter((person: any) => person.craft === 'ISS')
        .map((person: any, index: number) => ({
          ...person,
          nationality: ['USA', 'Russia', 'Japan', 'ESA', 'Canada'][index % 5],
          role: ['Commander', 'Flight Engineer', 'Science Officer', 'Mission Specialist'][index % 4],
          mission_start: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
          bio: `Experienced astronaut with multiple space missions. Currently aboard the International Space Station conducting scientific research and maintaining station operations.`,
          photo_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name.replace(' ', '')}`
        }));
      
      setCrew(enhancedCrew);
    } catch (error) {
      console.error('Error fetching crew data:', error);
      // Fallback data
      setCrew([
        {
          name: 'Demo Astronaut Alpha',
          craft: 'ISS',
          nationality: 'USA',
          role: 'Commander',
          mission_start: new Date().toISOString(),
          bio: 'Experienced space commander leading current ISS operations.',
          photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alpha'
        },
        {
          name: 'Demo Astronaut Beta',
          craft: 'ISS',
          nationality: 'Russia',
          role: 'Flight Engineer',
          mission_start: new Date().toISOString(),
          bio: 'Skilled flight engineer maintaining ISS systems.',
          photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beta'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Commander': return 'text-yellow-400 border-yellow-400/30 bg-yellow-500/20';
      case 'Flight Engineer': return 'text-blue-400 border-blue-400/30 bg-blue-500/20';
      case 'Science Officer': return 'text-green-400 border-green-400/30 bg-green-500/20';
      case 'Mission Specialist': return 'text-purple-400 border-purple-400/30 bg-purple-500/20';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-500/20';
    }
  };

  const getNationalityFlag = (nationality: string) => {
    const flags: { [key: string]: string } = {
      'USA': '🇺🇸',
      'Russia': '🇷🇺',
      'Japan': '🇯🇵',
      'ESA': '🇪🇺',
      'Canada': '🇨🇦'
    };
    return flags[nationality] || '🌍';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white relative">
        <StarField />
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Rocket className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            </motion.div>
            <p className="text-xl text-gray-300">Loading crew information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white relative">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ISS Crew Details
            </h1>
            <p className="text-xl text-gray-300">
              Meet the brave astronauts currently aboard the International Space Station
            </p>
          </div>

          {/* Crew Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-black/30 border-blue-400/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-blue-400">
                  <Users className="w-5 h-5" />
                  <span>Total Crew</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{crew.length}</p>
                <p className="text-gray-400">astronauts aboard</p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-green-400/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-green-400">
                  <Globe className="w-5 h-5" />
                  <span>Countries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">
                  {new Set(crew.map(member => member.nationality)).size}
                </p>
                <p className="text-gray-400">represented</p>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-purple-400/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-purple-400">
                  <Rocket className="w-5 h-5" />
                  <span>Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">Active</p>
                <p className="text-gray-400">operations</p>
              </CardContent>
            </Card>
          </div>

          {/* Crew Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crew.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="bg-black/30 border-white/20 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300 cursor-pointer hover:scale-105">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-20 h-20 rounded-full border-2 border-white/20"
                          />
                        </div>
                        <CardTitle className="text-white">{member.name}</CardTitle>
                        <div className="flex justify-center items-center space-x-2">
                          <span className="text-2xl">{getNationalityFlag(member.nationality || '')}</span>
                          <span className="text-gray-400">{member.nationality}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="text-center">
                        <Badge className={`mb-2 ${getRoleColor(member.role || '')}`}>
                          {member.role}
                        </Badge>
                        <div className="text-sm text-gray-400">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>Mission Start</span>
                          </div>
                          <span>{member.mission_start ? new Date(member.mission_start).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  
                  <DialogContent className="bg-black/90 border-white/20 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-24 h-24 rounded-full border-2 border-white/20"
                          />
                          <div>
                            <h2 className="text-xl font-bold">{member.name}</h2>
                            <div className="flex items-center justify-center space-x-2 mt-1">
                              <span className="text-2xl">{getNationalityFlag(member.nationality || '')}</span>
                              <span className="text-gray-400">{member.nationality}</span>
                            </div>
                          </div>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <Badge className={getRoleColor(member.role || '')}>
                          {member.role}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Spacecraft</p>
                          <p className="text-white">{member.craft}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Mission Start</p>
                          <p className="text-white">
                            {member.mission_start ? new Date(member.mission_start).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Biography</p>
                        <p className="text-white text-sm leading-relaxed">{member.bio}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CrewDetails;
