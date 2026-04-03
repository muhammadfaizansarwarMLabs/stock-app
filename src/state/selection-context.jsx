import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { downloadZip } from "../utils/download-zip";

const SelectionContext = createContext(undefined);

const IDLE_ZIP_JOB = { status: "idle" };

export function SelectionProvider({ children }) {
  const { pathname } = useLocation();
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [zipJob, setZipJob] = useState(IDLE_ZIP_JOB);

  const toggleSelect = (imageId) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(imageId)) {
        next.delete(imageId);
      } else {
        next.add(imageId);
      }

      return next;
    });
  };

  const selectAll = (imageIds) => {
    setSelectedIds(new Set(imageIds));
  };

  const clearAll = () => {
    setSelectedIds(new Set());
  };

  const dismissError = () => {
    setZipJob(IDLE_ZIP_JOB);
  };

  const downloadSelected = async (images) => {
    if (!images.length || zipJob.status === "loading") {
      return;
    }

    setZipJob({ status: "loading" });

    try {
      const result = await downloadZip(images);

      if (!result.ok || result.failedCount > 0) {
        setZipJob({
          status: "error",
          failedCount: result.failedCount,
          failedTitles: result.failedTitles
        });
        return;
      }

      setZipJob(IDLE_ZIP_JOB);
    } catch {
      setZipJob({
        status: "error",
        failedCount: images.length,
        failedTitles: images.map((image) => image.title)
      });
    }
  };

  useEffect(() => {
    if (pathname !== "/" && !pathname.startsWith("/image/")) {
      clearAll();
      setZipJob(IDLE_ZIP_JOB);
    }
  }, [pathname]);

  const value = useMemo(
    () => ({
      selectedIds,
      toggleSelect,
      selectAll,
      clearAll,
      zipJob,
      downloadSelected,
      dismissError
    }),
    [selectedIds, zipJob]
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }

  return context;
}
