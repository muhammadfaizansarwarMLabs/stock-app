import { renderImageWithEffects } from "./render-image-with-effects";

// T038 — Default values for all 9 effect controls
const DEFAULTS = {
  zoom: 100,
  opacity: 100,
  brightness: 100,
  contrast: 100,
  blur: 0,
  grayscale: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
};

// T038 — Check all 9 controls against defaults
function isEffectsActive(effects = {}) {
  return Object.entries(DEFAULTS).some(
    ([key, defaultVal]) => effects[key] !== undefined && effects[key] !== defaultVal
  );
}

function slugify(title) {
  return title.replace(/\s+/g, "-").toLowerCase();
}

function getFileExtension(image, blob) {
  if (image?.fileName && image.fileName.includes(".")) {
    return image.fileName.slice(image.fileName.lastIndexOf(".")).toLowerCase();
  }

  const type = blob?.type || image?.mimeType || "";
  if (type.includes("png")) return ".png";
  if (type.includes("webp")) return ".webp";
  if (type.includes("gif")) return ".gif";
  if (type.includes("bmp")) return ".bmp";
  if (type.includes("svg")) return ".svg";
  return ".jpg";
}

function triggerDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Downloads an image, optionally applying zoom/opacity effects via canvas export.
 *
 * @param {object} image - Image data object with at least `downloadUrl` and `title`
 * @param {{ zoom: number, opacity: number } | null} effects - Current preview effects, or null for original
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function downloadImage(image, effects = null) {
  try {
    if (effects && isEffectsActive(effects)) {
      const result = await renderImageWithEffects(
        image.downloadUrl,
        effects,
        slugify(image.title)
      );
      if (!result.ok) return { ok: false, message: result.message };
      const blobUrl = URL.createObjectURL(result.blob);
      triggerDownload(blobUrl, result.filename);
      URL.revokeObjectURL(blobUrl);
      return { ok: true };
    }

    const response = await fetch(image.downloadUrl);
    if (!response.ok) {
      return { ok: false, message: "Download failed. Please try again." };
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const extension = getFileExtension(image, blob);
    triggerDownload(blobUrl, `${slugify(image.title)}${extension}`);
    URL.revokeObjectURL(blobUrl);
    return { ok: true };
  } catch {
    return { ok: false, message: "Unable to download image right now." };
  }
}
