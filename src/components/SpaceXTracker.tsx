
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SpaceXLaunch {
  id: string;
  name: string;
  date_utc: string;
  rocket: {
    name: string;
  };
  launchpad: {
    name: string;
    locality: string;
    region: string;
  };
  details?: string;
  links: {
    webcast?: string;
    article?: string;
    wikipedia?: string;
  };
  success?: boolean;
  upcoming: boolean;
}

const SpaceXTracker = () => {
  const [upcomingLaunches, setUpcomingLaunches] = useState<SpaceXLaunch[]>([]);
  const [recentLaunches, setRecentLaunches] = useState<SpaceXLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextLaunch, setNextLaunch] = useState<SpaceXLaunch | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    const fetchSpaceXData = async () => {
      try {
        // Fetch upcoming launches
        const upcomingResponse = await fetch('https://api.spacexdata.com/v4/launches/upcoming?limit=5');
        const upcomingData = await upcomingResponse.json();
        
        // Fetch recent launches
        const recentResponse = await fetch('https://api.spacexdata.com/v4/launches/past?limit=5');
        const recentData = await recentResponse.json();
        
        setUpcomingLaunches(upcomingData);
        setRecentLaunches(recentData.reverse()); // Show most recent first
        setNextLaunch(upcomingData[0] || null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching SpaceX data:', error);
        setLoading(false);
      }
    };

    fetchSpaceXData();
    const interval = setInterval(fetchSpaceXData, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!nextLaunch) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const launchTime = new Date(nextLaunch.date_utc).getTime();
      const distance = launchTime - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown('Launch time has passed');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextLaunch]);

  if (loading) {
    return (
      <div className="container mx-auto px-6">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Rocket className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          </motion.div>
          <p className="text-xl text-gray-300">Loading SpaceX mission data...</p>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            SpaceX Mission Tracker
          </h2>
          <p className="text-xl text-gray-300">
            Live tracking of SpaceX launches and missions
          </p>
        </div>

        {/* Next Launch Countdown */}
        {nextLaunch && (
          <Card className="mb-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-400">
                <Rocket className="w-6 h-6" />
                <span>Next Launch</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{nextLaunch.name}</h3>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(nextLaunch.date_utc).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(nextLaunch.date_utc).toLocaleTimeString()} UTC</span>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-3xl font-mono font-bold text-orange-400 mb-2">
                    {countdown}
                  </div>
                  <Badge variant="outline" className="border-orange-400 text-orange-400">
                    T-minus countdown
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Launches */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Upcoming Launches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingLaunches.map((launch, index) => (
              <motion.div
                key={launch.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-black/30 border-orange-400/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">{launch.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Rocket className="w-4 h-4" />
                        <span>{launch.rocket.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(launch.date_utc).toLocaleDateString()}</span>
                      </div>
                      {launch.details && (
                        <p className="text-gray-300 text-sm line-clamp-3">{launch.details}</p>
                      )}
                      {launch.links.webcast && (
                        <Button
                          size="sm"
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          onClick={() => window.open(launch.links.webcast, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Watch Live
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Launches */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Recent Launches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLaunches.map((launch, index) => (
              <motion.div
                key={launch.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`bg-black/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300 ${
                  launch.success ? 'border-green-400/30' : 'border-red-400/30'
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-white">{launch.name}</span>
                      <Badge 
                        variant={launch.success ? "default" : "destructive"}
                        className={launch.success ? "bg-green-500" : "bg-red-500"}
                      >
                        {launch.success ? "Success" : "Failed"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Rocket className="w-4 h-4" />
                        <span>{launch.rocket.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(launch.date_utc).toLocaleDateString()}</span>
                      </div>
                      {launch.details && (
                        <p className="text-gray-300 text-sm line-clamp-3">{launch.details}</p>
                      )}
                      <div className="flex space-x-2">
                        {launch.links.article && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => window.open(launch.links.article, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Article
                          </Button>
                        )}
                        {launch.links.wikipedia && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => window.open(launch.links.wikipedia, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Wiki
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SpaceXTracker;
