import { motion } from "framer-motion";

interface SwayingTreeProps {
  className?: string;
  delay?: number;
}

const SwayingTree = ({ className = "", delay = 0 }: SwayingTreeProps) => {
  return (
    <motion.div
      className={`absolute bottom-8 ${className}`}
      style={{ 
        transformOrigin: "bottom center",
      }}
      animate={{
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    >
      <svg viewBox="0 0 120 350" className="h-full w-auto">
        {/* Main trunk */}
        <path
          d="M60 350 Q58 300 60 250 Q62 200 58 150 Q60 100 60 50"
          stroke="hsl(117 17% 41%)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Main branches */}
        <path
          d="M60 240 Q35 220 15 210"
          stroke="hsl(117 17% 41%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 240 Q85 220 105 210"
          stroke="hsl(117 17% 41%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 190 Q30 170 10 160"
          stroke="hsl(117 17% 41%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 190 Q90 170 110 160"
          stroke="hsl(117 17% 41%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 140 Q25 120 5 110"
          stroke="hsl(117 17% 41%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 140 Q95 120 115 110"
          stroke="hsl(117 17% 41%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 90 Q35 70 20 55"
          stroke="hsl(117 17% 41%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 90 Q85 70 100 55"
          stroke="hsl(117 17% 41%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 50 Q50 30 45 15"
          stroke="hsl(117 17% 41%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 50 Q70 30 75 15"
          stroke="hsl(117 17% 41%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Secondary branches - more detail */}
        <path d="M15 210 Q5 205 0 195" stroke="hsl(117 17% 41%)" strokeWidth="1" fill="none" />
        <path d="M15 210 Q10 220 5 225" stroke="hsl(117 17% 41%)" strokeWidth="1" fill="none" />
        <path d="M105 210 Q115 205 120 195" stroke="hsl(117 17% 41%)" strokeWidth="1" fill="none" />
        <path d="M105 210 Q110 220 115 225" stroke="hsl(117 17% 41%)" strokeWidth="1" fill="none" />
        <path d="M10 160 Q0 155 -5 145" stroke="hsl(117 17% 41%)" strokeWidth="1" fill="none" />
        <path d="M110 160 Q118 155 123 145" stroke="hsl(117 17% 41%)" strokeWidth="1" fill="none" />
        <path d="M5 110 Q-5 105 -10 95" stroke="hsl(117 17% 41%)" strokeWidth="1" fill="none" />
        <path d="M115 110 Q123 105 128 95" stroke="hsl(117 17% 41%)" strokeWidth="1" fill="none" />
        
        {/* Foliage clusters - squiggly leaf groups */}
        <g fill="hsl(117 17% 51%)" opacity="0.9">
          {/* Top */}
          <circle cx="45" cy="12" r="8" />
          <circle cx="60" cy="5" r="10" />
          <circle cx="75" cy="12" r="8" />
          <circle cx="52" cy="18" r="6" />
          <circle cx="68" cy="18" r="6" />
          
          {/* Upper branches */}
          <circle cx="20" cy="50" r="12" />
          <circle cx="35" cy="45" r="10" />
          <circle cx="100" cy="50" r="12" />
          <circle cx="85" cy="45" r="10" />
          
          {/* Middle upper */}
          <circle cx="5" cy="105" r="14" />
          <circle cx="20" cy="95" r="12" />
          <circle cx="115" cy="105" r="14" />
          <circle cx="100" cy="95" r="12" />
          
          {/* Middle */}
          <circle cx="10" cy="155" r="15" />
          <circle cx="25" cy="145" r="12" />
          <circle cx="110" cy="155" r="15" />
          <circle cx="95" cy="145" r="12" />
          
          {/* Lower */}
          <circle cx="15" cy="205" r="13" />
          <circle cx="30" cy="195" r="10" />
          <circle cx="105" cy="205" r="13" />
          <circle cx="90" cy="195" r="10" />
        </g>
      </svg>
    </motion.div>
  );
};

export default SwayingTree;
