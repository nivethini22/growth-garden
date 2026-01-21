import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Leaf {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  tree: "left" | "right";
}

// Tree positions based on Welcome.tsx
// Left tree: left-[8%], h-[65vh]
// Right tree: right-[8%], h-[55vh]
const LEFT_TREE_LEFT = 8;
const LEFT_TREE_WIDTH = 10; // approx width percentage
const RIGHT_TREE_LEFT = 82; // 100 - 8 - 10
const RIGHT_TREE_WIDTH = 10;

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const createLeaf = () => {
      // Randomly choose which tree to drop from
      const tree = Math.random() > 0.5 ? "left" : "right";
      
      // Calculate x position based on tree
      let xPosition: number;
      if (tree === "left") {
        xPosition = LEFT_TREE_LEFT + Math.random() * LEFT_TREE_WIDTH;
      } else {
        xPosition = RIGHT_TREE_LEFT + Math.random() * RIGHT_TREE_WIDTH;
      }
      
      const newLeaf: Leaf = {
        id: Date.now() + Math.random(),
        x: xPosition,
        delay: 0,
        duration: 3 + Math.random() * 2,
        size: 8 + Math.random() * 12,
        tree,
      };
      setLeaves(prev => [...prev, newLeaf]);

      // Remove leaf after animation
      setTimeout(() => {
        setLeaves(prev => prev.filter(l => l.id !== newLeaf.id));
      }, newLeaf.duration * 1000);
    };

    // Create initial leaves
    for (let i = 0; i < 8; i++) {
      setTimeout(createLeaf, i * 400);
    }

    // Continue creating leaves
    const interval = setInterval(createLeaf, 1200);
    return () => clearInterval(interval);
  }, []);

  // Fall distance based on foliage height to stem (roughly 30% of tree height)
  const leftTreeFallVh = 65 * 0.30; // Left tree is 65vh
  const rightTreeFallVh = 55 * 0.30; // Right tree is 55vh

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      <AnimatePresence>
        {leaves.map((leaf) => {
          // Calculate starting position based on tree
          // Foliage starts at top of tree, stem is bottom portion
          const treeHeight = leaf.tree === "left" ? 65 : 55;
          const startFromTop = 100 - treeHeight; // vh from top where tree top is
          const fallDistance = leaf.tree === "left" ? leftTreeFallVh : rightTreeFallVh;
          
          return (
            <motion.div
              key={leaf.id}
              className="absolute"
              style={{
                left: `${leaf.x}%`,
                top: `${startFromTop}vh`,
              }}
              initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
              animate={{
                y: `${fallDistance}vh`,
                x: [0, 15, -10, 20, 5],
                rotate: [0, 90, 180, 270, 360],
                opacity: [1, 1, 1, 0.5, 0],
              }}
              transition={{
                duration: leaf.duration,
                ease: "linear",
              }}
              exit={{ opacity: 0 }}
            >
              <svg
                width={leaf.size}
                height={leaf.size}
                viewBox="0 0 24 24"
                fill="hsl(117 17% 51%)"
              >
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
              </svg>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default FallingLeaves;