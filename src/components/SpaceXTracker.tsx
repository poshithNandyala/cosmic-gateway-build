
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpaceXData } from '@/hooks/useSpaceXData';
import { useCountdown } from '@/hooks/useCountdown';
import NextLaunchCard from '@/components/spacex/NextLaunchCard';
import LaunchCard from '@/components/spacex/LaunchCard';
import LoadingState from '@/components/spacex/LoadingState';
import ErrorState from '@/components/spacex/ErrorState';

const SpaceXTracker = () => {
  const {
    upcomingLaunches,
    recentLaunches,
    loading,
    nextLaunch,
    lastUpdated,
    error,
    refetch
  } = useSpaceXData();

  const countdown = useCountdown(nextLaunch, refetch);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
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
            Real-time tracking of SpaceX launches and missions
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button 
              onClick={refetch} 
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
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

        {/* Next Launch Countdown */}
        {nextLaunch && (
          <NextLaunchCard nextLaunch={nextLaunch} countdown={countdown} />
        )}

        {/* Upcoming Launches */}
        {upcomingLaunches.length > 0 && (
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
                  <LaunchCard launch={launch} type="upcoming" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Launches */}
        {recentLaunches.length > 0 && (
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
                  <LaunchCard launch={launch} type="recent" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {upcomingLaunches.length === 0 && recentLaunches.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300">No SpaceX launch data available at the moment.</p>
            <Button onClick={refetch} className="mt-4 bg-orange-500 hover:bg-orange-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SpaceXTracker;
