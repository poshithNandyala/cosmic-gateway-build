
import { useState, useEffect } from 'react';
import { SpaceXLaunch } from '@/types/spacex';

export const useCountdown = (nextLaunch: SpaceXLaunch | null, onExpire?: () => void) => {
  const [countdown, setCountdown] = useState<string>('');

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
        if (onExpire) onExpire();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextLaunch, onExpire]);

  return countdown;
};
