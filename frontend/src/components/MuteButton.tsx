import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const MuteButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("musicMuted") === "true";
  });
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTimeRef = useRef<number>(0);

  // Determine position based on current page
  const isWelcome = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // Handle mute toggle with instant effect
  const handleToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem("musicMuted", String(newMuted));
    
    // Dispatch custom event with current time for resume capability
    window.dispatchEvent(new CustomEvent("muteChange", { 
      detail: { 
        muted: newMuted,
        currentTime: currentTimeRef.current 
      } 
    }));
  };

  // Listen for time updates from BackgroundMusic
  useEffect(() => {
    const handleTimeUpdate = (event: CustomEvent<{ currentTime: number }>) => {
      currentTimeRef.current = event.detail.currentTime;
    };

    window.addEventListener("musicTimeUpdate", handleTimeUpdate as EventListener);
    return () => {
      window.removeEventListener("musicTimeUpdate", handleTimeUpdate as EventListener);
    };
  }, []);

  // Position: on welcome/auth pages it's alone, on other pages it's left of home button
  const positionClass = isWelcome || isAuthPage
    ? "right-6"
    : "right-24"; // Left of home button

  return (
    <motion.button
      className={`fixed top-6 ${positionClass} z-50 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleToggle}
      animate={{
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{ duration: 0.2 }}
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </motion.button>
  );
};

export default MuteButton;
