import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const HomeButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on welcome page
  if (location.pathname === "/") return null;

  // On dashboard, show exit button
  const isDashboard = location.pathname === "/dashboard";

  const handleClick = () => {
    if (isDashboard) {
      localStorage.removeItem("username");
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <motion.button
      className="fixed top-6 right-6 z-50 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      animate={{
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{ duration: 0.2 }}
      aria-label={isDashboard ? "Exit" : "Home"}
    >
      {isDashboard ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )}
    </motion.button>
  );
};

export default HomeButton;