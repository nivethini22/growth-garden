import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <motion.button
      className="fixed top-6 right-24 z-50 bg-transparent text-primary rounded-2xl p-3 flex items-center gap-2"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleLogout}
      animate={{
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{ duration: 0.2 }}
      aria-label="Logout"
    >
      {/* Hand-drawn minimalistic door exit icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        {/* Door frame */}
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        {/* Arrow pointing out */}
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </motion.button>
  );
};

export default LogoutButton;
