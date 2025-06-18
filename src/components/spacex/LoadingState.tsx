
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="text-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Rocket className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        </motion.div>
        <p className="text-xl text-gray-300">Loading real-time SpaceX data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
