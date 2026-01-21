import { motion } from "framer-motion";

const GrowingFlower = () => {
  return (
    <div className="relative w-16 h-20 flex items-end justify-center">
      {/* Pot/Base */}
      <motion.div
        className="absolute bottom-0 w-8 h-4 rounded-b-lg bg-background"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Stem */}
      <motion.div
        className="absolute bottom-4 w-1 bg-tree origin-bottom"
        initial={{ height: 0 }}
        animate={{ height: 32 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      
      {/* Leaves */}
      <motion.div
        className="absolute bottom-8 -left-1 w-3 h-2 bg-tree rounded-full origin-right"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: -30 }}
        transition={{ duration: 0.2, delay: 0.3 }}
      />
      <motion.div
        className="absolute bottom-10 -right-1 w-3 h-2 bg-tree rounded-full origin-left"
        initial={{ scale: 0, rotate: 30 }}
        animate={{ scale: 1, rotate: 30 }}
        transition={{ duration: 0.2, delay: 0.35 }}
      />
      
      {/* Flower Petals */}
      {[0, 72, 144, 216, 288].map((rotation, i) => (
        <motion.div
          key={rotation}
          className="absolute top-0 left-1/2 w-3 h-4 bg-flower rounded-full origin-bottom"
          style={{
            marginLeft: -6,
            rotate: `${rotation}deg`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
        />
      ))}
      
      {/* Flower Center */}
      <motion.div
        className="absolute top-2 left-1/2 w-3 h-3 bg-accent rounded-full"
        style={{ marginLeft: -6 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, delay: 0.65 }}
      />
    </div>
  );
};

export default GrowingFlower;
