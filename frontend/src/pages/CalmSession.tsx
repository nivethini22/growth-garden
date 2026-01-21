import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "@/components/Chatbot";
import HomeButton from "@/components/HomeButton";
import MuteButton from "@/components/MuteButton";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";
import breatheInAudio from "@/assets/breathe_in.mp3";
import breatheOutAudio from "@/assets/breathe_out.mp3";
import holdAudio from "@/assets/hold.mp3";
import affirmationAudio from "@/assets/affirmation.mp3";

const CalmSession = () => {
  const [sessionState, setSessionState] = useState<"setup" | "active" | "paused" | "break" | "complete">("setup");
  const [customMinutes, setCustomMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(300);
  const [totalTime, setTotalTime] = useState(300);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breakTimeLeft, setBreakTimeLeft] = useState(10);
  const [hasPlayedAffirmation, setHasPlayedAffirmation] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [elapsedBeforePause, setElapsedBeforePause] = useState<number>(0);
  
  const breatheInRef = useRef<HTMLAudioElement | null>(null);
  const breatheOutRef = useRef<HTMLAudioElement | null>(null);
  const holdRef = useRef<HTMLAudioElement | null>(null);
  const affirmationRef = useRef<HTMLAudioElement | null>(null);
  const breatheCycleRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exhaleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useKeyboardNavigation();

  // Initialize audio elements with higher volume for whispers
  useEffect(() => {
    breatheInRef.current = new Audio(breatheInAudio);
    breatheOutRef.current = new Audio(breatheOutAudio);
    holdRef.current = new Audio(holdAudio);
    affirmationRef.current = new Audio(affirmationAudio);
    
    // Higher volume for whisper audio so it's not overpowered by background
    breatheInRef.current.volume = 1.0;
    breatheOutRef.current.volume = 1.0;
    holdRef.current.volume = 1.0;
    affirmationRef.current.volume = 1.0;
    
    return () => {
      breatheInRef.current?.pause();
      breatheOutRef.current?.pause();
      holdRef.current?.pause();
      affirmationRef.current?.pause();
      if (breatheCycleRef.current) clearInterval(breatheCycleRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      if (exhaleTimeoutRef.current) clearTimeout(exhaleTimeoutRef.current);
    };
  }, []);

  // Handle custom time input
  const handleTimeChange = (value: string) => {
    const mins = parseInt(value) || 1;
    const clampedMins = Math.max(1, Math.min(60, mins));
    setCustomMinutes(clampedMins);
    if (sessionState === "setup") {
      setTimeLeft(clampedMins * 60);
      setTotalTime(clampedMins * 60);
    }
  };

  // Start session
  const startSession = () => {
    const time = customMinutes * 60;
    setTimeLeft(time);
    setTotalTime(time);
    setHasPlayedAffirmation(false);
    setSessionStartTime(Date.now());
    setElapsedBeforePause(0);
    setPhase("inhale");
    setSessionState("active");
  };

  // Pause session
  const pauseSession = () => {
    // Save elapsed time before pause
    setElapsedBeforePause(prev => prev + (Date.now() - sessionStartTime));
    setSessionState("paused");
    // Clear breathing cycle when paused
    if (breatheCycleRef.current) {
      clearInterval(breatheCycleRef.current);
      breatheCycleRef.current = null;
    }
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
    if (exhaleTimeoutRef.current) {
      clearTimeout(exhaleTimeoutRef.current);
      exhaleTimeoutRef.current = null;
    }
    // Pause any playing audio
    breatheInRef.current?.pause();
    breatheOutRef.current?.pause();
    holdRef.current?.pause();
  };

  // Resume session
  const resumeSession = () => {
    setSessionStartTime(Date.now());
    setSessionState("active");
  };

  // End session - save progress to garden
  const endSession = () => {
    // Calculate completion percentage based on time elapsed
    const totalElapsed = elapsedBeforePause + (sessionState === "active" ? Date.now() - sessionStartTime : 0);
    const totalDurationMs = totalTime * 1000;
    const completionPercent = Math.min(100, (totalElapsed / totalDurationMs) * 100);
    
    // Save session to localStorage for garden growth
    const sessions = JSON.parse(localStorage.getItem("calmSessions") || "[]");
    sessions.push({ 
      date: new Date().toISOString(), 
      completionPercent: Math.round(completionPercent) 
    });
    localStorage.setItem("calmSessions", JSON.stringify(sessions));
    
    // Reset state
    setSessionState("setup");
    setTimeLeft(customMinutes * 60);
    setTotalTime(customMinutes * 60);
    setPhase("inhale");
    setHasPlayedAffirmation(false);
    setElapsedBeforePause(0);
    if (breatheCycleRef.current) {
      clearInterval(breatheCycleRef.current);
      breatheCycleRef.current = null;
    }
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    if (exhaleTimeoutRef.current) clearTimeout(exhaleTimeoutRef.current);
    
    // Pause any playing audio
    breatheInRef.current?.pause();
    breatheOutRef.current?.pause();
    holdRef.current?.pause();
    affirmationRef.current?.pause();
  };

  // Reset session (for complete state)
  const resetSession = () => {
    setSessionState("setup");
    setTimeLeft(customMinutes * 60);
    setTotalTime(customMinutes * 60);
    setPhase("inhale");
    setHasPlayedAffirmation(false);
    setElapsedBeforePause(0);
  };

  // Main timer
  useEffect(() => {
    if (sessionState !== "active") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Session complete - save with 100% completion
          const sessions = JSON.parse(localStorage.getItem("calmSessions") || "[]");
          sessions.push({ date: new Date().toISOString(), completionPercent: 100 });
          localStorage.setItem("calmSessions", JSON.stringify(sessions));
          setSessionState("complete");
          return 0;
        }
        
        // Check for half point to trigger break
        const halfPoint = Math.floor(totalTime / 2);
        if (prev === halfPoint && !hasPlayedAffirmation) {
          setSessionState("break");
          setBreakTimeLeft(10);
          setHasPlayedAffirmation(true);
          // Play affirmation audio
          if (affirmationRef.current) {
            affirmationRef.current.currentTime = 0;
            affirmationRef.current.play().catch(() => {});
          }
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionState, totalTime, hasPlayedAffirmation]);

  // Break timer
  useEffect(() => {
    if (sessionState !== "break") return;

    const breakTimer = setInterval(() => {
      setBreakTimeLeft(prev => {
        if (prev <= 1) {
          setSessionState("active");
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breakTimer);
  }, [sessionState]);

  // Breathing cycle with audio cues
  useEffect(() => {
    if (sessionState !== "active") {
      if (breatheCycleRef.current) {
        clearInterval(breatheCycleRef.current);
        breatheCycleRef.current = null;
      }
      return;
    }

    const breathCycle = () => {
      // Inhale phase (circle minimizes)
      setPhase("inhale");
      if (breatheInRef.current) {
        breatheInRef.current.currentTime = 0;
        breatheInRef.current.play().catch(() => {});
      }
      
      // Hold phase after 4 seconds
      phaseTimeoutRef.current = setTimeout(() => {
        if (sessionState !== "active") return;
        setPhase("hold");
        if (holdRef.current) {
          holdRef.current.currentTime = 0;
          holdRef.current.play().catch(() => {});
        }
      }, 4000);
      
      // Exhale phase after 7 seconds (circle expands)
      exhaleTimeoutRef.current = setTimeout(() => {
        if (sessionState !== "active") return;
        setPhase("exhale");
        if (breatheOutRef.current) {
          breatheOutRef.current.currentTime = 0;
          breatheOutRef.current.play().catch(() => {});
        }
      }, 7000);
    };

    breathCycle();
    breatheCycleRef.current = setInterval(breathCycle, 11000);
    
    return () => {
      if (breatheCycleRef.current) {
        clearInterval(breatheCycleRef.current);
      }
    };
  }, [sessionState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseText = () => {
    if (sessionState === "break") return "Take a moment...";
    if (sessionState === "complete") return "Well done! 🌟";
    if (sessionState === "paused") return "Paused";
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
    }
  };

  const isSessionRunning = sessionState === "active" || sessionState === "break";

  return (
    <div className="min-h-screen bg-calm-bg flex flex-col items-center justify-center p-6">
      <Chatbot />
      <HomeButton />
      <MuteButton />
      
      <motion.div
        className="text-center w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {sessionState === "setup" ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl font-bold text-card-foreground mb-2">
                Calm Session 🧘
              </h1>
              <p className="text-muted-foreground mb-12">
                Take a moment to breathe and relax
              </p>

              {/* Custom Time Input */}
              <div className="mb-8 flex items-center justify-center gap-3">
                <label className="text-card-foreground font-medium">Session length:</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customMinutes}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-20 px-3 py-2 rounded-xl bg-card text-card-foreground border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 text-center font-semibold"
                />
                <span className="text-card-foreground">minutes</span>
              </div>

              {/* Quick Time Selection */}
              <div className="mb-8 flex gap-4 justify-center flex-wrap">
                {[1, 3, 5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setCustomMinutes(mins);
                      setTimeLeft(mins * 60);
                      setTotalTime(mins * 60);
                    }}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      customMinutes === mins
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground hover:bg-secondary"
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>

              <motion.button
                onClick={startSession}
                className="bg-primary text-primary-foreground font-semibold text-lg px-12 py-4 rounded-2xl shadow-lg transition-all hover:bg-primary/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Session
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Breathing Circle */}
              <div className="relative flex items-center justify-center mb-12">
                <motion.div
                  className="w-48 h-48 rounded-full bg-calm-circle flex items-center justify-center"
                  animate={{
                    scale: isSessionRunning && sessionState !== "break"
                      ? (phase === "exhale" ? 1.3 : phase === "hold" ? 1 : 0.8) 
                      : 1,
                    boxShadow: isSessionRunning
                      ? [
                          "0 0 20px hsl(162 29% 62% / 0.4), 0 0 40px hsl(162 29% 62% / 0.2)",
                          "0 0 40px hsl(162 29% 62% / 0.6), 0 0 80px hsl(162 29% 62% / 0.4)",
                          "0 0 20px hsl(162 29% 62% / 0.4), 0 0 40px hsl(162 29% 62% / 0.2)",
                        ]
                      : "0 0 20px hsl(162 29% 62% / 0.3)",
                  }}
                  transition={{
                    scale: { duration: phase === "inhale" ? 4 : phase === "hold" ? 3 : 4 },
                    boxShadow: { duration: 2, repeat: isSessionRunning ? Infinity : 0 },
                  }}
                >
                  <div className="text-center text-primary-foreground">
                    <p className="text-xl font-semibold">
                      {getPhaseText()}
                    </p>
                    <p className="text-4xl font-bold mt-2">
                      {sessionState === "break" ? breakTimeLeft : formatTime(timeLeft)}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="flex gap-4 justify-center">
                {sessionState === "active" && (
                  <>
                    <motion.button
                      onClick={pauseSession}
                      className="bg-secondary text-secondary-foreground font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all hover:bg-secondary/80"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Pause
                    </motion.button>
                    <motion.button
                      onClick={endSession}
                      className="bg-destructive text-destructive-foreground font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all hover:bg-destructive/90"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      End Session
                    </motion.button>
                  </>
                )}
                
                {sessionState === "paused" && (
                  <>
                    <motion.button
                      onClick={resumeSession}
                      className="bg-primary text-primary-foreground font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all hover:bg-primary/90"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Resume
                    </motion.button>
                    <motion.button
                      onClick={endSession}
                      className="bg-destructive text-destructive-foreground font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all hover:bg-destructive/90"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      End Session
                    </motion.button>
                  </>
                )}
                
                {sessionState === "complete" && (
                  <motion.button
                    onClick={resetSession}
                    className="bg-primary text-primary-foreground font-semibold text-lg px-12 py-4 rounded-2xl shadow-lg transition-all hover:bg-primary/90"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    Start New Session
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CalmSession;