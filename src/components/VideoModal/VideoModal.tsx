// components/VideoModal.tsx
import { useEffect, useRef } from "react";

interface TVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function VideoModal({ isOpen, onClose }: TVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play(); // Play the video when the modal opens
    } else if (videoRef.current) {
      videoRef.current.pause(); // Pause the video when the modal closes
      videoRef.current.currentTime = 0; // Reset video to start
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 z-40"
        onClick={onClose} // Clicking outside the modal will also close it
      />

      {/* Modal Content */}
      <div className="relative bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl z-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white z-50"
        >
          ✕
        </button>

        {/* Video Container */}
        <div className="aspect-w-16 aspect-h-9">
          <video ref={videoRef} src="/demoVideo.mp4" controls className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default VideoModal;
