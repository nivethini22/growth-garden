import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SwayingTree from "@/components/SwayingTree";
import FallingLeaves from "@/components/FallingLeaves";
import MuteButton from "@/components/MuteButton";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";

const Welcome = () => {
  const navigate = useNavigate();
  useKeyboardNavigation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center">
      <FallingLeaves />
      <MuteButton />
      
      {/* Trees */}
      <SwayingTree 
        className="left-[8%] h-[65vh]" 
        delay={0}
      />
      <SwayingTree 
        className="right-[8%] h-[55vh]" 
        delay={0.5}
      />
      
      {/* Main Content */}
      <motion.div
        className="z-20 text-center px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold mb-4"
          style={{ color: "hsl(117 25% 25%)" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Growth Garden
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl mb-8 font-medium"
          style={{ color: "hsl(117 20% 35%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          Nurture your mind, watch yourself bloom
        </motion.p>
        
        <motion.button
          onClick={() => navigate("/login")}
          className="bg-card hover:bg-secondary text-card-foreground font-semibold text-lg px-12 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Begin Your Journey
        </motion.button>
      </motion.div>
      
      {/* Decorative ground */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-primary/30" />
    </div>
  );
};

export default Welcome;
