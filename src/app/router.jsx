import { useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { LandingPage } from "../pages/landing/LandingPage";
import { FavoritesPage } from "../pages/favorites/FavoritesPage";
import { AboutPage } from "../pages/about/AboutPage";
import { FaqPage } from "../pages/faq/FaqPage";
import { ImageModal } from "../components/image-modal/ImageModal";
import { getImageById } from "../data/images";
import { loadFavorites, saveFavorites, toggleFavorite } from "../state/favorites-store";

function ImageModalRoute() {
  const location = useLocation();
  const imageId = location.pathname.split("/").pop();
  const image = getImageById(imageId);

  if (!image) return null;

  return <ImageModal image={image} />;
}

export function AppRouter() {
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state && state.backgroundLocation;

  const [favorites, setFavorites] = useState(() => loadFavorites());

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.imageId)), [favorites]);

  const onToggleFavorite = (imageId) => {
    setFavorites((current) => saveFavorites(toggleFavorite(current, imageId)));
  };

  return (
    <AppLayout>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<LandingPage favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} />} />
        <Route
          path="/favorites"
          element={<FavoritesPage favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/image/:imageId" element={<ImageModalRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {backgroundLocation ? (
        <Routes>
          <Route path="/image/:imageId" element={<ImageModalRoute />} />
        </Routes>
      ) : null}
    </AppLayout>
  );
}
