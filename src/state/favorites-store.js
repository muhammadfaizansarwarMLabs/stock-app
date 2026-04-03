const FAVORITES_KEY = "modern-stock-gallery:favorites";

const parseFavorites = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const loadFavorites = () => parseFavorites(localStorage.getItem(FAVORITES_KEY));

export const saveFavorites = (favorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
};

export const addFavorite = (favorites, imageId) => {
  if (favorites.some((item) => item.imageId === imageId)) return favorites;
  return [
    ...favorites,
    {
      imageId,
      favoritedAt: new Date().toISOString()
    }
  ];
};

export const removeFavorite = (favorites, imageId) => favorites.filter((item) => item.imageId !== imageId);

export const toggleFavorite = (favorites, imageId) =>
  favorites.some((item) => item.imageId === imageId)
    ? removeFavorite(favorites, imageId)
    : addFavorite(favorites, imageId);
