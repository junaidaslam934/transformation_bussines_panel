"use client";
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import RichTextEditor from "../ui/rich-text-editor";
import { X } from "lucide-react";
import Image from "next/image";
import ICONS from "@/assets/icons";
import { AnnouncementService } from "../../services/announcementService";

interface MediaFile {
  file: File;
  type: "image" | "video";
}

export default function AddAnnouncement() {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please upload an image or video file");
      return;
    }

    setMediaFile({
      file,
      type: isImage ? "image" : "video",
    });
  };

  const removeMedia = () => {
    setMediaFile(null);
  };

  const handleImageUpload = () => {
    // Trigger file input click
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*,video/*";
    fileInput.onchange = (e) => handleFileUpload(e as any);
    fileInput.click();
  };

  const getUserId = (): string => {
    const userStr = localStorage.getItem("user-storage");
    try {
      if (userStr) {
        const userObj = JSON.parse(userStr);
        return userObj?.state?.user?._id;
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
    return "";
  };

  const handleUpload = async () => {
    if (!content.trim() && !mediaFile) {
      alert("Please write some content or add media");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      // Create announcement with media in one call
      const result = await AnnouncementService.createAnnouncementWithMedia(
        content,
        userId,
        mediaFile?.file
      );
      
      console.log("Announcement created:", result.announcement);
      if (result.mediaUrl) {
        console.log("Media uploaded:", result.mediaUrl);
      }

      // Reset form
      setContent("");
      removeMedia();
      alert("Announcement created successfully!");
      
      // Optionally refresh the announcements list
      // You might want to emit an event or use a callback to refresh the parent component
      
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid (has content or media)
  const hasTextContent = content && content.replace(/<[^>]*>/g, '').trim().length > 0;
  const isFormValid = hasTextContent || mediaFile !== null;

  return (
    <div className="bg-white h-full rounded-lg p-3 sm:p-4 lg:p-5 flex flex-col">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-bold text-darkGray mb-4 sm:mb-6">
        Add Announcement
      </h2>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Rich Text Editor */}
        <div className="mb-4">
          <RichTextEditor
            content={content}
            onChange={setContent}
            onImageUpload={mediaFile ? undefined : handleImageUpload}
            placeholder="Write here..."
          />
        </div>

        {/* File Details Section - No Preview */}
        {mediaFile && (
          <div className="mb-4 sm:mb-6">
            <div className="bg-gray-50 p-2 sm:p-3 rounded-[10px]">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {mediaFile.type === "image" ? (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                      <Image
                        src={ICONS.imageveiw}
                        width={16}
                        height={16}
                        className="sm:w-5 sm:h-5"
                        alt="image"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                      <Image
                        src={ICONS.vaggeis}
                        width={16}
                        height={16}
                        className="sm:w-5 sm:h-5"
                        alt="video"
                      />
                    </div>
                  )}
                </div>

                {/* File Info - Takes remaining space */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-darkGray truncate">
                      {mediaFile.file.name}
                    </span>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-lightGray">
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">Uploaded</span>
                    </div>
                  </div>
                </div>

                {/* File Size and Delete Button */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="text-xs sm:text-sm text-darkGray">
                    {(mediaFile.file.size / (1024 * 1024)).toFixed(1)}MB
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeMedia}
                    className="text-gray-500 p-1 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <X className="h-4 w-4 sm:h-6 sm:w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Button - Fixed at Bottom */}
      <div className="flex justify-center mt-4">
        <Button
          onClick={handleUpload}
          disabled={!isFormValid || loading}
          className="bg-lightBrown text-darkGray font-bold w-full rounded-[10px] text-sm sm:text-base lg:text-lg hover:bg-lightBrown py-2 sm:py-3 disabled:bg-gray-100 disabled:text-darkGray"
        >
          {loading ? "Creating..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}
