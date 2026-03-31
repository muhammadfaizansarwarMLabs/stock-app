export async function downloadImage(image) {
  try {
    const response = await fetch(image.downloadUrl);
    if (!response.ok) {
      return { ok: false, message: "Download failed. Please try again." };
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${image.title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);

    return { ok: true };
  } catch {
    return { ok: false, message: "Unable to download image right now." };
  }
}
