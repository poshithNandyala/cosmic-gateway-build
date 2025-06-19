import { useState, useEffect } from "react";
import { Satellite, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ISSData {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  timestamp: number;
}

interface Astronaut {
  name: string;
  craft: string;
}

const fallbackAstronauts: Astronaut[] = [
  { name: "Oleg Kononenko", craft: "ISS" },
  { name: "Tracy C. Dyson", craft: "ISS" },
  { name: "Jeanette Epps", craft: "ISS" },
  { name: "Alexander Grebenkin", craft: "ISS" },
  { name: "Satoshi Furukawa", craft: "ISS" },
  { name: "Konstantin Borisov", craft: "ISS" },
  { name: "Andreas Mogensen", craft: "ISS" },
];

const ISSTracker = () => {
  const [issData, setIssData] = useState<ISSData | null>(null);
  const [astronauts, setAstronauts] = useState<Astronaut[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithProxy = async (url: string) => {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      url
    )}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Fetch failed");
    return response.json();
  };

  const fetchISSInfo = async () => {
    try {
      const [positionData, crewData] = await Promise.all([
        fetchWithProxy("http://api.open-notify.org/iss-now.json"),
        fetchWithProxy("http://api.open-notify.org/astros.json"),
      ]);

      setIssData({
        latitude: parseFloat(positionData.iss_position.latitude),
        longitude: parseFloat(positionData.iss_position.longitude),
        altitude: 408,
        velocity: 27600,
        visibility: "Visible",
        timestamp: positionData.timestamp * 1000,
      });

      setAstronauts(
        crewData.people.filter((p: Astronaut) => p.craft === "ISS")
      );
    } catch (err) {
      console.error("Using fallback astronauts due to error:", err);
      setIssData({
        latitude: 0,
        longitude: 0,
        altitude: 408,
        velocity: 27600,
        visibility: "Visible",
        timestamp: Date.now(),
      });
      setAstronauts(fallbackAstronauts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchISSInfo();
    const interval = setInterval(fetchISSInfo, 10000); // update every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 text-center py-10">
        <div className="animate-pulse mb-4">
          <Satellite className="w-12 h-12 text-blue-400 mx-auto" />
        </div>
        <p className="text-xl text-gray-300">
          Connecting to the International Space Station...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <a
          href="https://isstracker.pl/en"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:underline transition-all">
            ISS Live Tracker
          </h2>
        </a>
        <p className="text-lg text-gray-300 mt-2">
          Real-time International Space Station info
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-black/30 border-blue-400/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <MapPin className="w-5 h-5" /> Position
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <p className="text-sm text-gray-400">Latitude</p>
            <p className="text-lg font-semibold">
              {issData?.latitude.toFixed(4)}°
            </p>
            <p className="text-sm text-gray-400 mt-2">Longitude</p>
            <p className="text-lg font-semibold">
              {issData?.longitude.toFixed(4)}°
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-purple-400/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Satellite className="w-5 h-5" /> Altitude
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <p className="text-3xl font-bold">{issData?.altitude}</p>
            <p className="text-gray-400">km</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-green-400/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Clock className="w-5 h-5" /> Velocity
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <p className="text-3xl font-bold">
              {issData?.velocity.toLocaleString()}
            </p>
            <p className="text-gray-400">km/h</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-orange-400/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Users className="w-5 h-5" /> Crew
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <p className="text-3xl font-bold">{astronauts.length}</p>
            <p className="text-gray-400">astronauts aboard</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Current Crew Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {astronauts.map((astro) => (
              <div
                key={astro.name}
                className="bg-white/10 p-4 rounded-lg transition hover:bg-white/20"
              >
                <p className="text-white font-semibold">{astro.name}</p>
                <p className="text-gray-400 text-sm">
                  International Space Station
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ISSTracker;
