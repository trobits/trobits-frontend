// components/VideoModal.tsx
import { useEffect, useRef } from "react";

interface TVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function OtherVideoModal({ isOpen, onClose }: TVideoModalProps) {
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
      <div className="relative rounded-lg shadow-lg w-full max-w-3xl z-50 p-20 lg:p-40 md:p-40">
        {/* Close Button */}

        {/* Video Container */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute flex justify-center items-center font-bold top-3 right-3 size-10 p-2 bg-black text-white rounded-full hover:text-gray-200 z-50"
          >
            ✕
          </button>
          <video
            ref={videoRef}
            src="/otherVideo.mp4"
            controls
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default OtherVideoModal;
