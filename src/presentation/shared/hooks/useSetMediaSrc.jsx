import React, { useEffect } from "react";

const useSetMediaSrc = ({ setSrc, file }) => {
  useEffect(() => {
    // clean previous object URL if any
    let currentUrl = null;

    if (!file) {
      setSrc(null);
      return;
    }

    if (file instanceof File) {
      currentUrl = URL.createObjectURL(file);
      setSrc(currentUrl);

      return () => {
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        setSrc(null);
      };
    }

    if (typeof file === "string") {
      setSrc(file);

      return () => setSrc(null);
    }

    // unknown shape
    setSrc(null);
    return () => {};
  }, [file]);
};

export default useSetMediaSrc;
