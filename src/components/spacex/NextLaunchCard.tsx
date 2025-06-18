
import { Calendar, Clock, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpaceXLaunch } from '@/types/spacex';

interface NextLaunchCardProps {
  nextLaunch: SpaceXLaunch;
  countdown: string;
}

const NextLaunchCard = ({ nextLaunch, countdown }: NextLaunchCardProps) => {
  return (
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
              <div className="flex items-center space-x-2">
                <Rocket className="w-4 h-4" />
                <span>{nextLaunch.rocket?.name || 'Rocket TBD'}</span>
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
  );
};

export default NextLaunchCard;
