import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { LandingPage } from "../pages/landing/LandingPage";
import { FavoritesPage } from "../pages/favorites/FavoritesPage";
import { AboutPage } from "../pages/about/AboutPage";
import { FaqPage } from "../pages/faq/FaqPage";
import { ImageModal } from "../components/image-modal/ImageModal";
import { getImageById } from "../data/images";
import { loadFavorites, saveFavorites, toggleFavorite } from "../state/favorites-store";
import { SelectionProvider } from "../state/selection-context";
import { revokeObjectUrl } from "../utils/uploaded-image-source";

function ImageModalRoute({ uploadedImage, onReplaceUploadedImage, onClearUploadedImage }) {
  const location = useLocation();
  const imageId = location.pathname.split("/").pop();
  const image = imageId === "uploaded" ? uploadedImage : getImageById(imageId);

  if (!image) return null;

  return (
    <ImageModal
      image={image}
      onReplaceUploadedImage={onReplaceUploadedImage}
      onClearUploadedImage={onClearUploadedImage}
    />
  );
}

export function AppRouter() {
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state && state.backgroundLocation;

  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [uploadedImage, setUploadedImage] = useState(null);

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.imageId)), [favorites]);

  const onToggleFavorite = (imageId) => {
    setFavorites((current) => saveFavorites(toggleFavorite(current, imageId)));
  };

  const setUploadedImageSession = (nextUploadedImage) => {
    setUploadedImage((current) => {
      if (current?.objectUrl && current.objectUrl !== nextUploadedImage?.objectUrl) {
        revokeObjectUrl(current.objectUrl);
      }
      return nextUploadedImage;
    });
  };

  const clearUploadedImageSession = () => {
    setUploadedImage((current) => {
      if (current?.objectUrl) {
        revokeObjectUrl(current.objectUrl);
      }
      return null;
    });
  };

  useEffect(() => {
    if (!location.pathname.startsWith("/image/uploaded") && uploadedImage?.objectUrl) {
      clearUploadedImageSession();
    }
  }, [location.pathname, uploadedImage?.objectUrl]);

  useEffect(() => {
    return () => {
      if (uploadedImage?.objectUrl) {
        revokeObjectUrl(uploadedImage.objectUrl);
      }
    };
  }, [uploadedImage?.objectUrl]);

  return (
    <SelectionProvider>
      <AppLayout>
        <Routes location={backgroundLocation || location}>
          <Route
            path="/"
            element={(
              <LandingPage
                favoriteIds={favoriteIds}
                onToggleFavorite={onToggleFavorite}
                onOpenUploadedImage={setUploadedImageSession}
              />
            )}
          />
          <Route
            path="/favorites"
            element={<FavoritesPage favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route
            path="/image/:imageId"
            element={(
              <ImageModalRoute
                uploadedImage={uploadedImage}
                onReplaceUploadedImage={setUploadedImageSession}
                onClearUploadedImage={clearUploadedImageSession}
              />
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {backgroundLocation ? (
          <Routes>
            <Route
              path="/image/:imageId"
              element={(
                <ImageModalRoute
                  uploadedImage={uploadedImage}
                  onReplaceUploadedImage={setUploadedImageSession}
                  onClearUploadedImage={clearUploadedImageSession}
                />
              )}
            />
          </Routes>
        ) : null}
      </AppLayout>
    </SelectionProvider>
  );
}
