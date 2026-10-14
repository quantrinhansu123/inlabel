// Chuyển link Google Drive / link ảnh thành URL preview hiển thị được trong <img>
export function extractDriveFileId(link: string): string | null {
  if (!link) return null;
  const trimmed = link.trim();
  // Dạng /file/d/FILE_ID/
  let m = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  // Dạng ?id=FILE_ID hoặc &id=FILE_ID
  m = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  // Dạng docs.google.com/.../d/FILE_ID/
  m = trimmed.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  return null;
}

export function isDirectImageUrl(link: string): boolean {
  if (!link) return false;
  const t = link.trim().split("?")[0].toLowerCase();
  return (
    t.endsWith(".jpg") ||
    t.endsWith(".jpeg") ||
    t.endsWith(".png") ||
    t.endsWith(".gif") ||
    t.endsWith(".webp") ||
    t.endsWith(".bmp")
  );
}

// Ưu tiên: ảnh upload tay > link ảnh trực tiếp > thumbnail Drive > rỗng
export function resolveDesignPreview(input: {
  driveLink?: string;
  uploadedImageUrl?: string;
}): string {
  if (input.uploadedImageUrl) return input.uploadedImageUrl;
  const link = (input.driveLink || "").trim();
  if (!link) return "";
  if (isDirectImageUrl(link)) return link;
  const fileId = extractDriveFileId(link);
  if (fileId) {
    // Endpoint thumbnail public của Drive (cần file share "Anyone with the link")
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  return "";
}

export function drivePreviewPageUrl(driveLink: string): string {
  return driveLink;
}
