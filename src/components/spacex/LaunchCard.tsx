
import { Calendar, Clock, Rocket, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SpaceXLaunch } from '@/types/spacex';

interface LaunchCardProps {
  launch: SpaceXLaunch;
  type: 'upcoming' | 'recent';
}

const LaunchCard = ({ launch, type }: LaunchCardProps) => {
  const isRecent = type === 'recent';
  
  return (
    <Card className={`bg-black/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300 ${
      isRecent 
        ? launch.success 
          ? 'border-green-400/30' 
          : launch.success === false 
            ? 'border-red-400/30' 
            : 'border-gray-400/30'
        : 'border-orange-400/30'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-white">{launch.name}</span>
          {isRecent && launch.success !== null && (
            <Badge 
              variant={launch.success ? "default" : "destructive"}
              className={launch.success ? "bg-green-500" : "bg-red-500"}
            >
              {launch.success ? "Success" : "Failed"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Rocket className="w-4 h-4" />
            <span>{launch.rocket?.name || (isRecent ? 'Unknown Rocket' : 'Rocket TBD')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{new Date(launch.date_utc).toLocaleDateString()}</span>
          </div>
          {!isRecent && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{new Date(launch.date_utc).toLocaleTimeString()} UTC</span>
            </div>
          )}
          {launch.details && (
            <p className="text-gray-300 text-sm line-clamp-3">{launch.details}</p>
          )}
          
          {/* Buttons */}
          {!isRecent && launch.links?.webcast && (
            <Button
              size="sm"
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={() => window.open(launch.links.webcast, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Watch Live
            </Button>
          )}
          
          {isRecent && (
            <div className="flex space-x-2">
              {launch.links?.article && (
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
              {launch.links?.wikipedia && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LaunchCard;
