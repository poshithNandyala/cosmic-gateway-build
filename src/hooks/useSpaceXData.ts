
import { useState, useEffect } from 'react';
import { SpaceXLaunch } from '@/types/spacex';

export const useSpaceXData = () => {
  const [upcomingLaunches, setUpcomingLaunches] = useState<SpaceXLaunch[]>([]);
  const [recentLaunches, setRecentLaunches] = useState<SpaceXLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextLaunch, setNextLaunch] = useState<SpaceXLaunch | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaceXData = async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching SpaceX data...');
    
    try {
      const currentDate = new Date().toISOString();
      console.log('Current date:', currentDate);
      
      const upcomingResponse = await fetch('https://api.spacexdata.com/v5/launches/upcoming');
      const recentResponse = await fetch('https://api.spacexdata.com/v5/launches/past?limit=10');
      
      if (!upcomingResponse.ok || !recentResponse.ok) {
        throw new Error('Failed to fetch SpaceX data');
      }
      
      const upcomingData = await upcomingResponse.json();
      const recentData = await recentResponse.json();
      
      console.log('Upcoming launches raw data:', upcomingData.slice(0, 2));
      console.log('Recent launches raw data:', recentData.slice(0, 2));
      
      const validUpcoming = upcomingData.filter((launch: any) => {
        const launchDate = new Date(launch.date_utc);
        const now = new Date();
        return launchDate > now;
      }).slice(0, 6);
      
      const validRecent = recentData
        .filter((launch: any) => {
          const launchDate = new Date(launch.date_utc);
          const now = new Date();
          return launchDate <= now;
        })
        .sort((a: any, b: any) => new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime())
        .slice(0, 6);
      
      console.log('Filtered upcoming launches:', validUpcoming.length);
      console.log('Filtered recent launches:', validRecent.length);
      
      setUpcomingLaunches(validUpcoming);
      setRecentLaunches(validRecent);
      setNextLaunch(validUpcoming[0] || null);
      setLastUpdated(new Date());
      
      if (validUpcoming.length === 0 && validRecent.length === 0) {
        setError('No current SpaceX launch data available');
      }
      
    } catch (error) {
      console.error('Error fetching SpaceX data:', error);
      setError('Failed to fetch real-time SpaceX data. Please try again.');
      
      setUpcomingLaunches([]);
      setRecentLaunches([]);
      setNextLaunch(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaceXData();
    const interval = setInterval(fetchSpaceXData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    upcomingLaunches,
    recentLaunches,
    loading,
    nextLaunch,
    lastUpdated,
    error,
    refetch: fetchSpaceXData
  };
};
