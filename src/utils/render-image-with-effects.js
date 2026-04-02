/**
 * Renders an image with all preview effects applied to a canvas, then returns a PNG blob.
 *
 * Operation order (FR-025):
 *   1. CSS filters: brightness, contrast, blur, grayscale, opacity (via ctx.filter)
 *   2. Transforms: center-anchored zoom scale, rotate first, then flip
 *
 * Output canvas dimensions always match the original image dimensions (FR-009).
 *
 * @param {string} imageUrl - URL of the source image (must be CORS-accessible)
 * @param {{
 *   zoom: number, opacity: number,
 *   brightness: number, contrast: number, blur: number, grayscale: number,
 *   rotation: number, flipH: boolean, flipV: boolean
 * }} effects
 * @param {string} baseFilename - Base filename without extension
 * @returns {Promise<{ ok: boolean, blob?: Blob, filename?: string, message?: string }>}
 */
export async function renderImageWithEffects(imageUrl, effects, baseFilename) {
  try {
    const img = await loadImage(imageUrl);

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Step 1 — Apply CSS filters (brightness, contrast, blur, grayscale, opacity)
    ctx.filter = [
      `brightness(${effects.brightness ?? 100}%)`,
      `contrast(${effects.contrast ?? 100}%)`,
      `blur(${effects.blur ?? 0}px)`,
      `grayscale(${effects.grayscale ?? 0}%)`,
      `opacity(${effects.opacity ?? 100}%)`,
    ].join(" ");

    // Step 2 — Apply transforms: translate to center, rotate (FR-025: rotate first),
    //          then flip (scaleX/scaleY), then scale for zoom, then draw centered
    const zoomScale = (effects.zoom ?? 100) / 100;
    const scaleX = effects.flipH ? -zoomScale : zoomScale;
    const scaleY = effects.flipV ? -zoomScale : zoomScale;
    const angleRad = (((effects.rotation ?? 0) % 360) * Math.PI) / 180;

    ctx.translate(cx, cy);
    ctx.rotate(angleRad);
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    const blob = await canvasToBlob(canvas, "image/png");
    return { ok: true, blob, filename: `${baseFilename}-effects.png` };
  } catch {
    return { ok: false, message: "Unable to render effects for download." };
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

function canvasToBlob(canvas, type) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      type
    );
  });
}
