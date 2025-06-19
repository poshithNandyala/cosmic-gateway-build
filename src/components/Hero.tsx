import { motion } from 'framer-motion';
import { ArrowDown, Rocket, Satellite, Globe } from 'lucide-react';

const Hero = () => {
  const scrollToNext = () => {
    document.getElementById('iss')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <div className="text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Cosmic Navigator
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Your gateway to the universe. Track the ISS, discover astronomical events, 
            explore the solar system, and monitor space weather in real-time.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          <div className="flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-400/30">
            <Satellite className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400">Real-time ISS Tracking</span>
          </div>
          <div className="flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-400/30">
            <Globe className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400">Solar System Explorer</span>
          </div>
          <div className="flex items-center space-x-2 bg-pink-500/20 px-4 py-2 rounded-full border border-pink-400/30">
            <Rocket className="w-5 h-5 text-pink-400" />
            <span className="text-pink-400">Space Weather Monitor</span>
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          onClick={scrollToNext}
          className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center space-x-2">
            <span>Explore the Cosmos</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default Hero;
