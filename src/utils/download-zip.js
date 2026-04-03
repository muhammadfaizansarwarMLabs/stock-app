import JSZip from "jszip";

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function getTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const sec = String(now.getSeconds()).padStart(2, "0");

  return `${yyyy}${mm}${dd}-${hh}${min}${sec}`;
}

function triggerBlobDownload(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(blobUrl);
}

export async function downloadZip(images) {
  const zip = new JSZip();

  const settled = await Promise.allSettled(
    images.map(async (image) => {
      const response = await fetch(image.downloadUrl);
      if (!response.ok) {
        throw new Error("Fetch failed");
      }

      const data = await response.arrayBuffer();
      const name = `${slugifyTitle(image.title)}.jpg`;

      return { name, data, title: image.title };
    })
  );

  const failedTitles = [];
  let successCount = 0;

  settled.forEach((result, index) => {
    if (result.status === "fulfilled") {
      zip.file(result.value.name, result.value.data);
      successCount += 1;
      return;
    }

    failedTitles.push(images[index].title);
  });

  if (successCount === 0) {
    return {
      ok: false,
      failedCount: failedTitles.length,
      failedTitles
    };
  }

  const archiveBlob = await zip.generateAsync({ type: "blob" });
  triggerBlobDownload(archiveBlob, `stock-images-${getTimestamp()}.zip`);

  return {
    ok: true,
    failedCount: failedTitles.length,
    failedTitles
  };
}
