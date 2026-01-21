import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://127.0.0.1:8000";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text:
        "Hi there! 🌱 I'm your Growth Garden assistant. How can I help you today? You can also type a page name to navigate there!",
      isUser: false,
    },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const navigationPages: Record<string, string> = {
    home: "/dashboard",
    dashboard: "/dashboard",
    welcome: "/",
    mood: "/mood-tracker",
    "mood tracker": "/mood-tracker",
    garden: "/garden",
    calm: "/calm-session",
    "calm session": "/calm-session",
    calming: "/calm-session",
    emergency: "/emergency-contacts",
    "emergency contacts": "/emergency-contacts",
    contacts: "/emergency-contacts",
    login: "/login",
    signin: "/login",
    "sign in": "/login",
    signup: "/signup",
    "sign up": "/signup",
    register: "/signup",
    "self-help": "/self-help",
    selfhelp: "/self-help",
    "self help": "/self-help",
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);

    const lowerInput = input.toLowerCase().trim();
    let response = "";
    let shouldNavigate = false;
    let targetPath = "";

    // 🔍 Navigation detection
    for (const [keyword, path] of Object.entries(navigationPages)) {
      if (lowerInput.includes(keyword)) {
        response = `Taking you to ${keyword}! 🌿`;
        shouldNavigate = true;
        targetPath = path;
        break;
      }
    }

    // 🤖 Backend chatbot call
    if (!shouldNavigate) {
      try {
        const res = await fetch(`${BACKEND_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
            user_id: 1, // later replace with real user id
          }),
        });

        const data = await res.json();
        response = data.reply;
      } catch (error) {
        response =
          "I'm here with you. Something went wrong, but you can keep talking to me.";
      }
    }

    // ⏱ Bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (shouldNavigate) {
        setTimeout(() => {
          setIsOpen(false);
          setIsMaximized(false);
          navigate(targetPath);
        }, 1000);
      }
    }, 500);

    setInput("");
  };

  const panelClasses = isMaximized
    ? "fixed inset-4 z-50 bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-primary/20"
    : "fixed bottom-24 right-6 z-50 w-80 h-96 bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-primary/20";

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsOpen(!isOpen)}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
      </motion.button>

      {/* Chatbot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={panelClasses}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <span className="font-semibold">Garden Assistant</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Maximize */}
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="hover:bg-primary-foreground/20 rounded-full p-1.5 transition-colors"
                >
                  {isMaximized ? "🗗" : "🗖"}
                </button>

                {/* Close */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsMaximized(false);
                  }}
                  className="hover:bg-primary-foreground/20 rounded-full p-1.5 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.isUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="What's on your mind?"
                  className="flex-1 bg-input rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />

                <button
                  onClick={handleSend}
                  className="bg-primary text-primary-foreground rounded-xl px-4 py-2 hover:bg-primary/90 transition-colors"
                >
                  ➤
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
