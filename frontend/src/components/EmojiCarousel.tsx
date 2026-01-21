import { motion } from "framer-motion";

const emojis = ["😊", "😢", "😴", "😤", "🥰", "😌", "😰", "🤗", "😊", "😢", "😴", "😤", "🥰", "😌", "😰", "🤗"];

const EmojiCarousel = () => {
  return (
    <div className="overflow-hidden w-full h-full flex items-center">
      <motion.div
        className="flex gap-2 whitespace-nowrap"
        animate={{
          x: [0, -200],
        }}
        transition={{
          duration: 3,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {emojis.map((emoji, i) => (
          <span key={i} className="text-2xl">
            {emoji}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default EmojiCarousel;
