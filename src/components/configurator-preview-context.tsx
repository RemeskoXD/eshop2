"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ConfiguratorPreviewContextValue = {
  previewValues: Record<string, string>;
  setPreviewValues: (values: Record<string, string>) => void;
};

const ConfiguratorPreviewContext = createContext<ConfiguratorPreviewContextValue | null>(null);

export function ConfiguratorPreviewProvider({ children }: { children: ReactNode }) {
  const [previewValues, setPreviewValuesState] = useState<Record<string, string>>({});
  const setPreviewValues = useCallback((values: Record<string, string>) => {
    setPreviewValuesState(values);
  }, []);

  const value = useMemo(
    () => ({
      previewValues,
      setPreviewValues,
    }),
    [previewValues, setPreviewValues],
  );

  return <ConfiguratorPreviewContext.Provider value={value}>{children}</ConfiguratorPreviewContext.Provider>;
}

export function useConfiguratorPreview(): ConfiguratorPreviewContextValue | null {
  return useContext(ConfiguratorPreviewContext);
}
