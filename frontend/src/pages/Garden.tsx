import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "@/components/Chatbot";
import HomeButton from "@/components/HomeButton";
import MuteButton from "@/components/MuteButton";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";

interface GardenItem {
  id: number;
  type: "plant" | "flower" | "tree";
  x: number; // position percentage
}

interface SessionData {
  date: string;
  completionPercent: number;
}

const Garden = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gardenItems, setGardenItems] = useState<GardenItem[]>([]);
  const [totalPlants, setTotalPlants] = useState(0);
  const [totalFlowers, setTotalFlowers] = useState(0);
  const [totalTrees, setTotalTrees] = useState(0);
  
  useKeyboardNavigation();

  // Calculate garden state from session history
  useEffect(() => {
    const sessions: SessionData[] = JSON.parse(localStorage.getItem("calmSessions") || "[]");
    
    let plants = 0;
    let flowers = 0;
    let trees = 0;
    
    sessions.forEach(session => {
      if (session.completionPercent >= 80) {
        trees++;
      } else if (session.completionPercent >= 50) {
        flowers++;
      } else {
        plants++;
      }
    });
    
    setTotalPlants(plants);
    setTotalFlowers(flowers);
    setTotalTrees(trees);
    
    // Calculate level: every 5 items = 1 level
    const totalItems = plants + flowers + trees;
    const level = Math.max(1, Math.ceil(totalItems / 5));
    setCurrentLevel(level);
    
    // Generate garden items for current view
    generateGardenForLevel(level, plants, flowers, trees);
  }, []);

  const generateGardenForLevel = (level: number, plants: number, flowers: number, trees: number) => {
    const items: GardenItem[] = [];
    const itemsPerLevel = 5;
    const startIndex = (level - 1) * itemsPerLevel;
    const endIndex = level * itemsPerLevel;
    
    let itemIndex = 0;
    
    // Add trees first (highest achievement)
    for (let i = 0; i < trees && itemIndex < endIndex; i++) {
      if (itemIndex >= startIndex && itemIndex < endIndex) {
        items.push({
          id: itemIndex,
          type: "tree",
          x: 10 + ((itemIndex - startIndex) * 18),
        });
      }
      itemIndex++;
    }
    
    // Add flowers
    for (let i = 0; i < flowers && itemIndex < endIndex; i++) {
      if (itemIndex >= startIndex && itemIndex < endIndex) {
        items.push({
          id: itemIndex,
          type: "flower",
          x: 10 + ((itemIndex - startIndex) * 18),
        });
      }
      itemIndex++;
    }
    
    // Add plants
    for (let i = 0; i < plants && itemIndex < endIndex; i++) {
      if (itemIndex >= startIndex && itemIndex < endIndex) {
        items.push({
          id: itemIndex,
          type: "plant",
          x: 10 + ((itemIndex - startIndex) * 18),
        });
      }
      itemIndex++;
    }
    
    setGardenItems(items);
  };

  const maxLevel = Math.max(1, Math.ceil((totalPlants + totalFlowers + totalTrees) / 5));

  const goToPreviousLevel = () => {
    if (currentLevel > 1) {
      const newLevel = currentLevel - 1;
      setCurrentLevel(newLevel);
      generateGardenForLevel(newLevel, totalPlants, totalFlowers, totalTrees);
    }
  };

  const goToNextLevel = () => {
    if (currentLevel < maxLevel) {
      const newLevel = currentLevel + 1;
      setCurrentLevel(newLevel);
      generateGardenForLevel(newLevel, totalPlants, totalFlowers, totalTrees);
    }
  };

  const renderGardenItem = (item: GardenItem) => {
    if (item.type === "tree") {
      return (
        <motion.div
          key={item.id}
          className="absolute bottom-0"
          style={{ left: `${item.x}%` }}
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: item.id * 0.1 }}
        >
          <svg viewBox="0 0 60 100" className="w-16 h-24">
            {/* Trunk */}
            <path
              d="M30 100 Q29 80 30 60 Q31 40 30 20"
              stroke="hsl(117 17% 41%)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Branches */}
            <path d="M30 60 Q15 50 10 45" stroke="hsl(117 17% 41%)" strokeWidth="2" fill="none" />
            <path d="M30 60 Q45 50 50 45" stroke="hsl(117 17% 41%)" strokeWidth="2" fill="none" />
            <path d="M30 40 Q20 32 15 28" stroke="hsl(117 17% 41%)" strokeWidth="2" fill="none" />
            <path d="M30 40 Q40 32 45 28" stroke="hsl(117 17% 41%)" strokeWidth="2" fill="none" />
            {/* Foliage */}
            <circle cx="10" cy="42" r="10" fill="hsl(117 17% 51%)" />
            <circle cx="50" cy="42" r="10" fill="hsl(117 17% 51%)" />
            <circle cx="15" cy="25" r="12" fill="hsl(117 17% 51%)" />
            <circle cx="45" cy="25" r="12" fill="hsl(117 17% 51%)" />
            <circle cx="30" cy="12" r="14" fill="hsl(117 17% 51%)" />
          </svg>
        </motion.div>
      );
    }

    if (item.type === "flower") {
      return (
        <motion.div
          key={item.id}
          className="absolute bottom-0"
          style={{ left: `${item.x}%` }}
          initial={{ scale: 0, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: item.id * 0.1 }}
        >
          <svg viewBox="0 0 40 70" className="w-10 h-16">
            {/* Stem */}
            <path
              d="M20 70 Q19 55 20 40 Q21 30 20 20"
              stroke="hsl(117 17% 41%)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Leaves */}
            <ellipse cx="12" cy="50" rx="6" ry="4" fill="hsl(117 17% 51%)" transform="rotate(-30 12 50)" />
            <ellipse cx="28" cy="45" rx="6" ry="4" fill="hsl(117 17% 51%)" transform="rotate(30 28 45)" />
            {/* Petals */}
            <ellipse cx="20" cy="8" rx="5" ry="8" fill="hsl(336 77% 91%)" />
            <ellipse cx="12" cy="14" rx="5" ry="8" fill="hsl(336 77% 91%)" transform="rotate(72 12 14)" />
            <ellipse cx="14" cy="24" rx="5" ry="8" fill="hsl(336 77% 91%)" transform="rotate(144 14 24)" />
            <ellipse cx="26" cy="24" rx="5" ry="8" fill="hsl(336 77% 91%)" transform="rotate(-144 26 24)" />
            <ellipse cx="28" cy="14" rx="5" ry="8" fill="hsl(336 77% 91%)" transform="rotate(-72 28 14)" />
            {/* Center */}
            <circle cx="20" cy="16" r="5" fill="hsl(45 100% 60%)" />
          </svg>
        </motion.div>
      );
    }

    // Plant (seedling)
    return (
      <motion.div
        key={item.id}
        className="absolute bottom-0"
        style={{ left: `${item.x}%` }}
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: item.id * 0.1 }}
      >
        <svg viewBox="0 0 30 50" className="w-8 h-12">
          {/* Stem */}
          <path
            d="M15 50 Q14 40 15 30"
            stroke="hsl(117 17% 41%)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <ellipse cx="8" cy="28" rx="7" ry="4" fill="hsl(117 17% 51%)" transform="rotate(-45 8 28)" />
          <ellipse cx="22" cy="28" rx="7" ry="4" fill="hsl(117 17% 51%)" transform="rotate(45 22 28)" />
          <ellipse cx="15" cy="20" rx="5" ry="8" fill="hsl(117 17% 51%)" />
        </svg>
      </motion.div>
    );
  };

  const totalItems = totalPlants + totalFlowers + totalTrees;

  return (
    <div className="min-h-screen bg-garden-bg p-6">
      <Chatbot />
      <HomeButton />
      <MuteButton />
      
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-card-foreground mb-2 text-center">
          Your Garden 🌳
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Watch your garden grow as you complete calming sessions
        </p>

        {/* Level Navigation */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <motion.button
            onClick={goToPreviousLevel}
            disabled={currentLevel <= 1}
            className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
            whileHover={{ scale: currentLevel > 1 ? 1.1 : 1 }}
            whileTap={{ scale: currentLevel > 1 ? 0.95 : 1 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>
          
          <div className="bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-semibold text-lg">
            Level {currentLevel} / {maxLevel}
          </div>
          
          <motion.button
            onClick={goToNextLevel}
            disabled={currentLevel >= maxLevel}
            className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
            whileHover={{ scale: currentLevel < maxLevel ? 1.1 : 1 }}
            whileTap={{ scale: currentLevel < maxLevel ? 0.95 : 1 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        </div>

        {/* Garden View */}
        <motion.div
          className="bg-card rounded-3xl p-8 shadow-lg min-h-[400px] relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-calm-circle/30 to-transparent rounded-3xl" />
          
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-background rounded-b-3xl" />
          
          {/* Garden Items */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLevel}
              className="absolute bottom-24 left-0 right-0 h-32"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {gardenItems.map(item => renderGardenItem(item))}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {totalItems === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-xl mb-2">Your garden is empty</p>
                <p className="text-sm">Complete calming sessions to grow plants!</p>
                <p className="text-xs mt-4 opacity-70">
                  80%+ completion → 🌳 Tree<br />
                  50-79% completion → 🌸 Flower<br />
                  Below 50% → 🌿 Plant
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-8 grid grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="bg-card rounded-2xl p-4 text-center shadow-md">
            <p className="text-3xl font-bold text-primary">{totalItems}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-md">
            <p className="text-3xl font-bold text-primary">{totalPlants}</p>
            <p className="text-sm text-muted-foreground">🌿 Plants</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-md">
            <p className="text-3xl font-bold text-primary">{totalFlowers}</p>
            <p className="text-sm text-muted-foreground">🌸 Flowers</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-md">
            <p className="text-3xl font-bold text-primary">{totalTrees}</p>
            <p className="text-sm text-muted-foreground">🌳 Trees</p>
          </div>
        </motion.div>

        {/* Growth Legend */}
        <motion.div
          className="mt-6 bg-card rounded-2xl p-4 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <p className="text-center text-muted-foreground text-sm">
            <span className="font-semibold text-card-foreground">How growth works:</span> Complete calming sessions to earn plants! 
            <span className="mx-2">|</span>
            <span className="text-primary">80%+ → 🌳</span>
            <span className="mx-2">|</span>
            <span className="text-primary">50-79% → 🌸</span>
            <span className="mx-2">|</span>
            <span className="text-primary">&lt;50% → 🌿</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Garden;
