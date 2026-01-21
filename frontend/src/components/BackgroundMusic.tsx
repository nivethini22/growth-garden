import { useEffect, useRef, useState } from "react";

const BackgroundMusic = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("musicMuted") === "true";
  });
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Handle first interaction to enable audio
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
    };

    if (!hasInteracted) {
      document.addEventListener("click", handleInteraction, { once: true });
      document.addEventListener("keydown", handleInteraction, { once: true });
    }

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [hasInteracted]);

  // Listen for mute toggle events from MuteButton
  useEffect(() => {
    const handleMuteChange = (event: CustomEvent<{ muted: boolean }>) => {
      setIsMuted(event.detail.muted);
      
      // Send mute/unmute command to YouTube player
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const command = event.detail.muted ? "mute" : "unMute";
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: command, args: [] }),
          "*"
        );
      }
    };

    window.addEventListener("muteChange", handleMuteChange as EventListener);
    return () => {
      window.removeEventListener("muteChange", handleMuteChange as EventListener);
    };
  }, []);

  // Send initial mute state when iframe loads
  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow && isMuted) {
      // Small delay to ensure player is ready
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "mute", args: [] }),
          "*"
        );
      }, 500);
    }
  };

  if (!hasInteracted) return null;

  // YouTube embed with loop, autoplay, and JS API enabled
  // Video ID: MnqnQHcfnno
  const youtubeUrl = `https://www.youtube.com/embed/MnqnQHcfnno?autoplay=1&loop=1&playlist=MnqnQHcfnno&controls=0&showinfo=0&enablejsapi=1&origin=${window.location.origin}`;

  return (
    <div className="fixed -top-[9999px] -left-[9999px] w-1 h-1 overflow-hidden pointer-events-none" aria-hidden="true">
      <iframe
        ref={iframeRef}
        width="1"
        height="1"
        src={youtubeUrl}
        title="Background Music"
        allow="autoplay; encrypted-media"
        onLoad={handleIframeLoad}
        style={{ border: "none" }}
      />
    </div>
  );
};

export default BackgroundMusic;