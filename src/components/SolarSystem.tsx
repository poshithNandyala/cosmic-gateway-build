
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Info, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Planet {
  name: string;
  distance: number;
  size: number;
  color: string;
  facts: {
    diameter: string;
    mass: string;
    orbitalPeriod: string;
    rotationPeriod: string;
    moons: number;
    description: string;
  };
}

const SolarSystem = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  const planets: Planet[] = [
    {
      name: 'Mercury',
      distance: 80,
      size: 8,
      color: 'bg-gray-400',
      facts: {
        diameter: '4,879 km',
        mass: '0.055 Earth masses',
        orbitalPeriod: '88 Earth days',
        rotationPeriod: '59 Earth days',
        moons: 0,
        description: 'The smallest planet in our solar system and nearest to the Sun.',
      },
    },
    {
      name: 'Venus',
      distance: 120,
      size: 12,
      color: 'bg-yellow-300',
      facts: {
        diameter: '12,104 km',
        mass: '0.815 Earth masses',
        orbitalPeriod: '225 Earth days',
        rotationPeriod: '243 Earth days',
        moons: 0,
        description: 'The hottest planet in our solar system with a thick, toxic atmosphere.',
      },
    },
    {
      name: 'Earth',
      distance: 160,
      size: 14,
      color: 'bg-blue-400',
      facts: {
        diameter: '12,756 km',
        mass: '1 Earth mass',
        orbitalPeriod: '365.25 days',
        rotationPeriod: '24 hours',
        moons: 1,
        description: 'Our home planet, the only known planet to harbor life.',
      },
    },
    {
      name: 'Mars',
      distance: 200,
      size: 10,
      color: 'bg-red-500',
      facts: {
        diameter: '6,792 km',
        mass: '0.107 Earth masses',
        orbitalPeriod: '687 Earth days',
        rotationPeriod: '24.6 hours',
        moons: 2,
        description: 'The Red Planet, known for its iron oxide surface and polar ice caps.',
      },
    },
    {
      name: 'Jupiter',
      distance: 280,
      size: 32,
      color: 'bg-orange-300',
      facts: {
        diameter: '142,984 km',
        mass: '317.8 Earth masses',
        orbitalPeriod: '12 Earth years',
        rotationPeriod: '9.9 hours',
        moons: 95,
        description: 'The largest planet in our solar system, a gas giant with a Great Red Spot.',
      },
    },
    {
      name: 'Saturn',
      distance: 360,
      size: 28,
      color: 'bg-yellow-200',
      facts: {
        diameter: '120,536 km',
        mass: '95.2 Earth masses',
        orbitalPeriod: '29 Earth years',
        rotationPeriod: '10.7 hours',
        moons: 146,
        description: 'Known for its prominent ring system made of ice and rock particles.',
      },
    },
    {
      name: 'Uranus',
      distance: 440,
      size: 20,
      color: 'bg-cyan-300',
      facts: {
        diameter: '51,118 km',
        mass: '14.5 Earth masses',
        orbitalPeriod: '84 Earth years',
        rotationPeriod: '17.2 hours',
        moons: 27,
        description: 'An ice giant that rotates on its side with a unique tilted axis.',
      },
    },
    {
      name: 'Neptune',
      distance: 520,
      size: 18,
      color: 'bg-blue-600',
      facts: {
        diameter: '49,528 km',
        mass: '17.1 Earth masses',
        orbitalPeriod: '165 Earth years',
        rotationPeriod: '16.1 hours',
        moons: 16,
        description: 'The windiest planet with speeds up to 2,100 km/h in its atmosphere.',
      },
    },
  ];

  return (
    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Solar System Explorer
          </h2>
          <p className="text-xl text-gray-300">
            Interactive journey through our cosmic neighborhood
          </p>
        </div>

        <div className="relative bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-white/20 overflow-x-auto">
          <div className="relative min-w-[600px] h-[400px] flex items-center justify-center">
            {/* Sun */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg relative"
              >
                <div className="absolute inset-0 bg-yellow-300 rounded-full animate-pulse opacity-50"></div>
              </motion.div>
              <p className="text-center text-yellow-400 text-sm mt-2 font-semibold">Sun</p>
            </div>

            {/* Planets */}
            {planets.map((planet, index) => (
              <motion.div
                key={planet.name}
                className="absolute"
                style={{
                  left: `${planet.distance}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.button
                  onClick={() => setSelectedPlanet(planet)}
                  className={`w-${planet.size} h-${planet.size} ${planet.color} rounded-full shadow-lg hover:scale-110 transition-transform duration-300 relative group`}
                  style={{
                    width: `${planet.size * 4}px`,
                    height: `${planet.size * 4}px`,
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Info className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
                <p className="text-center text-white text-xs mt-2 font-medium">{planet.name}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">Click on any planet to learn more about it</p>
        </div>
      </motion.div>

      {/* Planet Details Modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlanet(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 ${selectedPlanet.color} rounded-full`}
                  ></div>
                  <h3 className="text-2xl font-bold text-white">{selectedPlanet.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedPlanet.facts.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs">Diameter</p>
                    <p className="text-white font-semibold">{selectedPlanet.facts.diameter}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Mass</p>
                    <p className="text-white font-semibold">{selectedPlanet.facts.mass}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Orbital Period</p>
                    <p className="text-white font-semibold">{selectedPlanet.facts.orbitalPeriod}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Rotation Period</p>
                    <p className="text-white font-semibold">{selectedPlanet.facts.rotationPeriod}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 text-xs">Moons</p>
                    <p className="text-white font-semibold">{selectedPlanet.facts.moons}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolarSystem;
