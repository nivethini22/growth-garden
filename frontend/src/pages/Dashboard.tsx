import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SwayingTree from "@/components/SwayingTree";
import FallingLeaves from "@/components/FallingLeaves";
import EmojiCarousel from "@/components/EmojiCarousel";
import GrowingFlower from "@/components/GrowingFlower";
import OpeningBook from "@/components/OpeningBook";
import Chatbot from "@/components/Chatbot";
import MuteButton from "@/components/MuteButton";
import HomeButton from "@/components/HomeButton";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";

const Dashboard = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [username, setUsername] = useState("Friend");
  useKeyboardNavigation();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FallingLeaves />
      <Chatbot />
      <MuteButton />
      <HomeButton />
      
      {/* Background Tree */}
      <SwayingTree 
        className="left-[5%] h-[80vh] opacity-60" 
        delay={0}
      />
      
      <div className="relative z-20 min-h-screen flex items-center justify-end p-8">
        {/* Welcome Box - aligned right */}
        <motion.div
          className="bg-card/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-2xl w-full mr-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl font-bold text-card-foreground mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome, {username} 🌸
          </motion.h1>
          
          <motion.p
            className="text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            What would you like to do today?
          </motion.p>

          {/* Navigation Buttons - 4 columns with more space */}
          <div className="grid grid-cols-4 gap-5">
            {/* Mood Tracker Button */}
            <motion.button
              onClick={() => navigate("/mood-tracker")}
              onHoverStart={() => setHoveredButton("mood")}
              onHoverEnd={() => setHoveredButton(null)}
              className="relative bg-secondary hover:bg-secondary/80 rounded-2xl p-6 h-28 flex items-center justify-center transition-all overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {hoveredButton === "mood" ? (
                <EmojiCarousel />
              ) : (
                <span className="text-secondary-foreground font-semibold text-center">
                  Mood Tracker
                </span>
              )}
            </motion.button>

            {/* Garden Button */}
            <motion.button
              onClick={() => navigate("/garden")}
              onHoverStart={() => setHoveredButton("garden")}
              onHoverEnd={() => setHoveredButton(null)}
              className="relative bg-secondary hover:bg-secondary/80 rounded-2xl p-6 h-28 flex items-center justify-center transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {hoveredButton === "garden" ? (
                <GrowingFlower />
              ) : (
                <span className="text-secondary-foreground font-semibold text-center">
                  Garden
                </span>
              )}
            </motion.button>

            {/* Self-Help Button */}
            <motion.button
              onClick={() => navigate("/self-help")}
              onHoverStart={() => setHoveredButton("selfhelp")}
              onHoverEnd={() => setHoveredButton(null)}
              className="relative bg-secondary hover:bg-secondary/80 rounded-2xl p-6 h-28 flex items-center justify-center transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {hoveredButton === "selfhelp" ? (
                <OpeningBook />
              ) : (
                <span className="text-secondary-foreground font-semibold text-center">
                  Self-Help
                </span>
              )}
            </motion.button>

            {/* Calm Session Button */}
            <motion.button
              onClick={() => navigate("/calm-session")}
              onHoverStart={() => setHoveredButton("calm")}
              onHoverEnd={() => setHoveredButton(null)}
              className="relative bg-secondary hover:bg-secondary/80 rounded-2xl p-6 h-28 flex items-center justify-center transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: hoveredButton === "calm" 
                  ? "0 0 30px hsl(162 29% 62% / 0.5), 0 0 60px hsl(162 29% 62% / 0.3)" 
                  : "none",
              }}
            >
              <span className="text-secondary-foreground font-semibold text-center">
                Calm Session
              </span>
            </motion.button>
          </div>

          {/* Emergency Contacts Link */}
          <motion.button
            onClick={() => navigate("/emergency-contacts")}
            className="mt-6 w-full text-center text-muted-foreground hover:text-foreground transition-colors text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            📞 Emergency Contacts
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;