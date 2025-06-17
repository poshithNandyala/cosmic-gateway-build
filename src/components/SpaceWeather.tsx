
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Zap, Wind, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpaceWeatherData {
  solarFlareRisk: string;
  geomagneticStorm: string;
  radiationLevel: string;
  solarWindSpeed: number;
  kpIndex: number;
  lastUpdate: string;
}

const SpaceWeather = () => {
  const [weatherData, setWeatherData] = useState<SpaceWeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock space weather data (in a real app, this would fetch from NOAA Space Weather API)
    const mockData: SpaceWeatherData = {
      solarFlareRisk: 'Low',
      geomagneticStorm: 'Quiet',
      radiationLevel: 'Normal',
      solarWindSpeed: 425,
      kpIndex: 2,
      lastUpdate: new Date().toISOString(),
    };

    setTimeout(() => {
      setWeatherData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
      case 'quiet':
      case 'normal':
        return 'text-green-400 border-green-400/30 bg-green-500/20';
      case 'moderate':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-500/20';
      case 'high':
      case 'active':
        return 'text-orange-400 border-orange-400/30 bg-orange-500/20';
      case 'extreme':
      case 'severe':
        return 'text-red-400 border-red-400/30 bg-red-500/20';
      default:
        return 'text-gray-400 border-gray-400/30 bg-gray-500/20';
    }
  };

  const getKpIndexStatus = (kp: number) => {
    if (kp <= 2) return { status: 'Quiet', color: 'text-green-400' };
    if (kp <= 4) return { status: 'Unsettled', color: 'text-yellow-400' };
    if (kp <= 6) return { status: 'Active', color: 'text-orange-400' };
    if (kp <= 8) return { status: 'Storm', color: 'text-red-400' };
    return { status: 'Extreme Storm', color: 'text-purple-400' };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sun className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          </motion.div>
          <p className="text-xl text-gray-300">Monitoring space weather conditions...</p>
        </div>
      </div>
    );
  }

  const kpStatus = getKpIndexStatus(weatherData?.kpIndex || 0);

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
            Space Weather Monitor
          </h2>
          <p className="text-xl text-gray-300">
            Real-time monitoring of solar activity and geomagnetic conditions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className={`bg-black/30 border backdrop-blur-sm ${getRiskColor(weatherData?.solarFlareRisk || 'normal')}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2">
                <Sun className="w-5 h-5" />
                <span>Solar Flare Risk</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <p className="text-3xl font-bold">{weatherData?.solarFlareRisk}</p>
                <p className="text-gray-400 text-sm mt-2">X-ray flux monitoring</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-black/30 border backdrop-blur-sm ${getRiskColor(weatherData?.geomagneticStorm || 'quiet')}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Geomagnetic Storm</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <p className="text-3xl font-bold">{weatherData?.geomagneticStorm}</p>
                <p className="text-gray-400 text-sm mt-2">Earth's magnetosphere</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-black/30 border backdrop-blur-sm ${getRiskColor(weatherData?.radiationLevel || 'normal')}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Radiation Level</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <p className="text-3xl font-bold">{weatherData?.radiationLevel}</p>
                <p className="text-gray-400 text-sm mt-2">Proton flux levels</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/30 border-blue-400/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-400">
                <Wind className="w-5 h-5" />
                <span>Solar Wind</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-4xl font-bold">{weatherData?.solarWindSpeed}</span>
                  <span className="text-gray-400">km/s</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((weatherData?.solarWindSpeed || 0) / 800 * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">Normal range: 300-500 km/s</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-black/30 border backdrop-blur-sm border-gray-400/30`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-400">
                <AlertTriangle className="w-5 h-5" />
                <span>Kp Index</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-4xl font-bold">{weatherData?.kpIndex}</span>
                  <span className={`text-sm font-semibold ${kpStatus.color}`}>
                    {kpStatus.status}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      weatherData?.kpIndex && weatherData.kpIndex <= 2 ? 'bg-green-400' :
                      weatherData?.kpIndex && weatherData.kpIndex <= 4 ? 'bg-yellow-400' :
                      weatherData?.kpIndex && weatherData.kpIndex <= 6 ? 'bg-orange-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${Math.min((weatherData?.kpIndex || 0) / 9 * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">Geomagnetic activity scale: 0-9</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Last updated: {weatherData?.lastUpdate ? new Date(weatherData.lastUpdate).toLocaleString() : 'Unknown'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SpaceWeather;
