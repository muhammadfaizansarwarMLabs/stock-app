export const filterImagesByTitle = (images, query) => {
  const needle = query.trim().toLowerCase();
  if (!needle) return images;
  return images.filter((image) => image.title.toLowerCase().includes(needle));
};
