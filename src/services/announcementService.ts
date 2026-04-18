import { 
  IAnnouncementsResponse, 
  ICreateAnnouncementRequest, 
  ICreateAnnouncementResponse,
  IAnnouncement 
} from "../lib/api/types";

const getAuthToken = (): string => {
  // Add logic if you need to get a token from cookies/localStorage
  return "";
};

// --- Helpers ---
const sanitizePlainText = (input: string): string => {
  if (!input) return "";
  // Remove any HTML tags and trim whitespace
  return input.replace(/<[^>]*>/g, "").trim();
};

const isValidAbsoluteUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return Boolean(url.protocol && url.host);
  } catch {
    return false;
  }
};

const deriveGetUrlFromPutUrl = (putUrl: string): string | null => {
  try {
    const u = new URL(putUrl);
    // Strip query to form a clean GET URL of the same object
    return `${u.origin}${u.pathname}`;
  } catch {
    return null;
  }
};

const normalizeToAbsoluteUrl = (maybeUrl: string, contextPutUrl?: string): string | null => {
  if (!maybeUrl) return null;
  const value = maybeUrl.trim();
  // Already absolute
  if (isValidAbsoluteUrl(value)) return value;
  // Protocol-relative
  if (value.startsWith('//')) {
    const abs = `https:${value}`;
    return isValidAbsoluteUrl(abs) ? abs : null;
  }
  // s3://bucket/key → https://bucket.s3.<region>.amazonaws.com/key (infer region from putUrl)
  if (value.startsWith('s3://')) {
    try {
      const withoutScheme = value.slice('s3://'.length);
      const firstSlash = withoutScheme.indexOf('/');
      const bucket = firstSlash === -1 ? withoutScheme : withoutScheme.slice(0, firstSlash);
      const key = firstSlash === -1 ? '' : withoutScheme.slice(firstSlash + 1);
      let region = 'us-west-1';
      if (contextPutUrl) {
        const u = new URL(contextPutUrl);
        const m = u.host.match(/\.s3\.(.+?)\.amazonaws\.com$/);
        if (m && m[1]) region = m[1];
      }
      const abs = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
      return isValidAbsoluteUrl(abs) ? abs : null;
    } catch {
      // ignore
    }
  }
  // Relative path → resolve against putUrl origin if provided
  if (contextPutUrl && (value.startsWith('/') || !value.includes('://'))) {
    try {
      const base = new URL(contextPutUrl);
      const abs = value.startsWith('/') ? `${base.origin}${value}` : `${base.origin}/${value}`;
      return isValidAbsoluteUrl(abs) ? abs : null;
    } catch {
      // ignore
    }
  }
  return null;
};

export class AnnouncementService {
  static async getAnnouncements(userId: string): Promise<IAnnouncement[]> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || "{{API_BASE_URL_TEST}}"}/announcements?userId=${userId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Uncomment if you need auth:
          // Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: IAnnouncementsResponse = await response.json();
      if (result && result.success) {
        return result.data || [];
      } else {
        throw new Error("Invalid response structure from API");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw new Error("Failed to fetch announcements");
    }
  }

  static async createAnnouncement(data: ICreateAnnouncementRequest): Promise<ICreateAnnouncementResponse> {
    try {
      const authToken = getAuthToken();
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || "{{API_BASE_URL_TEST}}"}/announcements`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Uncomment if you need auth:
          // Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: ICreateAnnouncementResponse = await response.json();
      if (result && result.success) {
        return result;
      } else {
        throw new Error("Invalid response structure from API");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      throw new Error("Failed to create announcement");
    }
  }

  static async getAnnouncementUploadUrl(
    announcementId: string,
    userId: string,
    file: File
  ): Promise<{ putUrl: string; getUrl: string }> {
    try {
      const assetType = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";
      const fileType = file.type;
      const fileName = file.name;

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || "{{API_BASE_URL_TEST}}"}/announcements/generate-presigned-url/${announcementId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName,
          fileType,
          assetType,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result && result.success) {
        return result.data;
      } else {
        throw new Error("Invalid response from upload URL API");
      }
    } catch (error) {
      console.error("Error getting upload URL:", error);
      throw new Error("Failed to get upload URL");
    }
  }

  static async uploadToS3(putUrl: string, file: File): Promise<boolean> {
    try {
      const response = await fetch(putUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
            console.log("🔄 before update announcement with media URL: uploadToS3");
            return true;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Failed to upload file to S3");
    }
  }

  static async updateAnnouncementMedia(
    
    announcementId: string,
    userId: string,
    mediaUrl: string,
    mediaType: "videoUrl" | "imageUrl"
  ): Promise<boolean> {
    try {
      console.log("🔧 Updating announcement media:", { announcementId, userId, mediaUrl, mediaType });
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || "{{API_BASE_URL_TEST}}"}/announcements/${announcementId}`;
      console.log("🔧 PATCH URL:", url);
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          [mediaType]: mediaUrl,
        }),
      });
      console.log("🔧 PATCH Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("🔧 PATCH Response:", result);
      if (result && result.success) {
        console.log("✅ Announcement media updated successfully");
        return true;
      } else {
        throw new Error("Invalid response from update API");
      }
    } catch (error) {
      console.error("❌ Error updating announcement media:", error);
      throw new Error("Failed to update announcement media");
    }
  }

  static async createAnnouncementWithMedia(
    text: string,
    userId: string,
    file?: File
  ): Promise<{ announcement: ICreateAnnouncementResponse; mediaUrl?: string }> {
    try {
      console.log("🚀 Starting createAnnouncementWithMedia:", { userId, hasFile: !!file });
      const sanitizedText = sanitizePlainText(text);
      
      // 1. Create announcement first
      const announcementData = { text: sanitizedText, userId } as ICreateAnnouncementRequest;
      const announcementResponse = await this.createAnnouncement(announcementData);
      console.log("✅ Announcement created:", announcementResponse.data._id);

      // 2. If there's media, upload it
      if (file && announcementResponse.data._id) {
        try {
          console.log("📁 Getting upload URL for file:", file.name);
          const { putUrl, getUrl } = await this.getAnnouncementUploadUrl(
            announcementResponse.data._id,
            userId,
            file
          );
          console.log("✅ Got upload URLs:", { putUrl: putUrl.substring(0, 50) + "...", getUrl });
          
          console.log("📤 Uploading to S3...");
          await this.uploadToS3(putUrl, file);
          console.log("✅ S3 upload successful");
          console.log("🔄 Preparing media URL for announcement update");
          // Normalize and validate media URL for backend validation (e.g., Joi uri())
          let finalGetUrl = normalizeToAbsoluteUrl(sanitizePlainText(getUrl), putUrl)
            || deriveGetUrlFromPutUrl(putUrl)
            || normalizeToAbsoluteUrl(getUrl)
            || null;
          if (!finalGetUrl || !isValidAbsoluteUrl(finalGetUrl)) {
            throw new Error("Upload returned invalid media URL");
          }
          
          // 3. Update announcement with the media URL
          const mediaType = file.type.startsWith("video/") ? "videoUrl" : "imageUrl";
          console.log("🔄 Updating announcement with media URL:", { mediaType, url: finalGetUrl });
          await this.updateAnnouncementMedia(
            announcementResponse.data._id,
            userId,
            finalGetUrl,
            mediaType
          );
          console.log("✅ Announcement updated with media URL");
          
          return {
            announcement: announcementResponse,
            mediaUrl: finalGetUrl
          };
        } catch (mediaError) {
          console.error("❌ Error in media upload flow:", mediaError);
          // Return announcement even if media upload fails
          return { announcement: announcementResponse };
        }
      }

      return { announcement: announcementResponse };
    } catch (error) {
      console.error("❌ Error creating announcement with media:", error);
      throw new Error("Failed to create announcement with media");
    }
  }
}