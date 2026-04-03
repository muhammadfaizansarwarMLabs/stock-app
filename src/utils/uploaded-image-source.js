function stripExtension(fileName) {
  return fileName.replace(/\.[^.]+$/, "");
}

function toTitleCase(source) {
  return source
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function isSupportedImageFile(file) {
  return Boolean(file && typeof file.type === "string" && file.type.startsWith("image/"));
}

export function revokeObjectUrl(url) {
  if (!url || typeof url !== "string") {
    return;
  }

  if (!url.startsWith("blob:")) {
    return;
  }

  URL.revokeObjectURL(url);
}

export function createUploadedImageSource(file) {
  const objectUrl = URL.createObjectURL(file);
  const baseName = stripExtension(file.name || "uploaded-image");
  const title = toTitleCase(baseName || "Uploaded Image");

  return {
    id: `uploaded-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    altText: `${title} (uploaded image)`,
    tags: ["Uploaded"],
    fileName: file.name || `${baseName || "uploaded-image"}.png`,
    mimeType: file.type || "image/png",
    objectUrl,
    thumbnailUrl: objectUrl,
    fullImageUrl: objectUrl,
    downloadUrl: objectUrl,
    isUploaded: true,
  };
}
