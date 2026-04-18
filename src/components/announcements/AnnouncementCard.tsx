"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface AnnouncementCardProps {
  user: {
    firstName: string;
    lastName: string;
    profileImage: string | null;
  };
  text: string;
  createdAt: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  reactionCounts: {
    fire: { count: number };
    heart: { count: number };
    like: { count: number };
    sad: { count: number };
    laugh: { count: number };
    wow: { count: number };
  };
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  user,
  text,
  createdAt,
  imageUrl,
  videoUrl,
  reactionCounts,
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleFullscreenChange = () => {
      if (document.fullscreenElement === video) {
        document.exitFullscreen();
        openVideoModal();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        openVideoModal();
      }
    };

    video.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="bg-primary rounded-lg p-3 sm:p-4 shadow-sm">
        {/* Header Section */}
        <div className="flex items-start mb-3 pb-3 gap-3 border-b-2 border-grayBorder">
          {/* Profile Picture/Logo */}
          <Image
            src={user.profileImage || "/assets/images/user-avatar.png"}
            alt={`${user.firstName} ${user.lastName} profile`}
            width={32}
            height={32}
            className="object-contain sm:w-10 sm:h-10"
          />

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-darkGray text-sm sm:text-[16px] truncate">{user.firstName} {user.lastName}</h3>
            <p className="text-lightGray text-xs">{new Date(createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Media Section */}
        {(imageUrl || videoUrl) && (
          <div className="mb-4">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={"Announcement image"}
                width={400}
                height={300}
                className="w-full h-[400px] rounded-[10px] object-cover"
              />
            ) : videoUrl ? (
              <div className="relative w-full h-[400px] rounded-[10px] overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : null}
          </div>
        )}

        {/* Content Section */}
        <div className="mb-3 sm:mb-4">
          <p className="text-darkGray text-sm sm:text-[15px] leading-relaxed font-medium">
            {text}
          </p>
        </div>

        {/* Footer - Reaction Buttons */}
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          <button className="flex items-center gap-1 px-1.5 sm:px-2 py-1 transition-colors bg-background rounded-[10px]">
            <span className="text-base sm:text-lg">🔥</span>
            <span className="text-xs sm:text-sm text-lightGray">{reactionCounts.fire.count}</span>
          </button>

          <button className="flex items-center gap-1 px-1.5 sm:px-2 py-1 transition-colors bg-background rounded-[10px]">
            <span className="text-base sm:text-lg">❤️</span>
            <span className="text-xs sm:text-sm text-lightGray">{reactionCounts.heart.count}</span>
          </button>

          <button className="flex items-center gap-1 px-1.5 sm:px-2 py-1 transition-colors bg-background rounded-[10px]">
            <span className="text-base sm:text-lg">👍</span>
            <span className="text-xs sm:text-sm text-lightGray">{reactionCounts.like.count}</span>
          </button>

          <button className="flex items-center gap-1 px-1.5 sm:px-2 py-1 transition-colors bg-background rounded-[10px]">
            <span className="text-base sm:text-lg">😢</span>
            <span className="text-xs sm:text-sm text-lightGray">{reactionCounts.sad.count}</span>
          </button>

          <button className="flex items-center gap-1 px-1.5 sm:px-2 py-1 transition-colors bg-background rounded-[10px]">
            <span className="text-base sm:text-lg">😂</span>
            <span className="text-xs sm:text-sm text-lightGray">{reactionCounts.laugh.count}</span>
          </button>

          <button className="flex items-center gap-1 px-1.5 sm:px-2 py-1 transition-colors bg-background rounded-[10px]">
            <span className="text-base sm:text-lg">😮</span>
            <span className="text-xs sm:text-sm text-lightGray">{reactionCounts.wow.count}</span>
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && videoUrl && (
        <div className="fixed inset-0 -top-4 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl max-h-[80vh]">
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-3 right-4 text-black z-10"
            >
              <X className="w-8 h-8" />
            </button>
            {/* Video Player */}
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default AnnouncementCard;
