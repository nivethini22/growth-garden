import { motion } from "framer-motion";

const OpeningBook = () => {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Bookshelf */}
      <motion.div
        className="absolute bottom-2 w-18 h-2 bg-primary/60 rounded-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Book 1 - leftmost, tall */}
      <motion.div
        className="absolute bottom-4 left-1 w-3 h-12 bg-primary rounded-sm origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.3, delay: 0 }}
      />
      
      {/* Book 2 - medium height, different color shade */}
      <motion.div
        className="absolute bottom-4 left-5 w-3 h-10 bg-primary/80 rounded-sm origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      
      {/* Book 3 - tallest */}
      <motion.div
        className="absolute bottom-4 left-9 w-3.5 h-14 bg-primary rounded-sm origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      
      {/* Book 4 - short */}
      <motion.div
        className="absolute bottom-4 right-5 w-3 h-8 bg-primary/70 rounded-sm origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
      
      {/* Book 5 - medium */}
      <motion.div
        className="absolute bottom-4 right-1 w-3 h-11 bg-primary/90 rounded-sm origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
      
      {/* Shelf support */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-primary/40 rounded-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      />
    </div>
  );
};

export default OpeningBook;