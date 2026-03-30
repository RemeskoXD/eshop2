"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export type ModelViewerFrameHandle = {
  activateAR: () => void;
};

type ModelViewerFrameProps = {
  src?: string | null;
  iosSrc?: string | null;
  alt: string;
  height?: number;
  fallbackText?: string;
  analytics?: {
    context: string;
    slug?: string;
  };
  onArStatus?: (status: string) => void;
};

const ModelViewerFrame = forwardRef<ModelViewerFrameHandle, ModelViewerFrameProps>(function ModelViewerFrameInner(
  { src, iosSrc, alt, height = 320, fallbackText = "3D model zatím není dostupný. Pokračujte prosím na detail produktu.", analytics, onArStatus },
  ref,
) {
  const hasModel = Boolean(src);
  const bridgeRef = useRef<ModelViewerFrameHandle>({ activateAR: () => {} });

  useImperativeHandle(
    ref,
    () => ({
      activateAR: () => bridgeRef.current.activateAR(),
    }),
    [],
  );

  if (!hasModel) {
    return (
      <div className="flex items-center justify-center p-6 text-center text-sm text-black/55" style={{ height }}>
        {fallbackText}
      </div>
    );
  }

  return (
    <ModelViewerLoaded
      bridgeRef={bridgeRef}
      src={src!}
      iosSrc={iosSrc}
      alt={alt}
      height={height}
      analytics={analytics}
      onArStatus={onArStatus}
    />
  );
});

ModelViewerFrame.displayName = "ModelViewerFrame";

export default ModelViewerFrame;

function ModelViewerLoaded({
  bridgeRef,
  src,
  iosSrc,
  alt,
  height,
  analytics,
  onArStatus,
}: {
  bridgeRef: React.MutableRefObject<ModelViewerFrameHandle>;
  src: string;
  iosSrc?: string | null;
  alt: string;
  height: number;
  analytics?: {
    context: string;
    slug?: string;
  };
  onArStatus?: (status: string) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const trackedLoaded = useRef(false);
  const trackedInteract = useRef(false);
  const trackedArAttempt = useRef(false);

  useEffect(() => {
    bridgeRef.current = {
      activateAR: () => {
        const el = ref.current as unknown as { activateAR?: () => void } | null;
        el?.activateAR?.();
      },
    };
    return () => {
      bridgeRef.current = { activateAR: () => {} };
    };
  }, [bridgeRef]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleLoad() {
      setIsLoading(false);
      if (!trackedLoaded.current) {
        trackedLoaded.current = true;
        if (analytics) {
          trackEvent("ar_model_view", { context: analytics.context, slug: analytics.slug ?? null });
        }
      }
    }

    function handleError() {
      setIsLoading(false);
      setHasError(true);
    }

    function handleCameraChange() {
      if (trackedInteract.current) return;
      trackedInteract.current = true;
      if (analytics) {
        trackEvent("ar_model_interact", { context: analytics.context, slug: analytics.slug ?? null });
      }
    }

    function handleArStatus(event: Event) {
      const status = (event as CustomEvent<{ status?: string }>).detail?.status ?? "unknown";
      onArStatus?.(status);
      if (trackedArAttempt.current) return;
      trackedArAttempt.current = true;
      if (analytics) {
        trackEvent("ar_attempt", { context: analytics.context, slug: analytics.slug ?? null, status });
      }
    }

    el.addEventListener("load", handleLoad as EventListener);
    el.addEventListener("error", handleError as EventListener);
    el.addEventListener("camera-change", handleCameraChange as EventListener);
    el.addEventListener("ar-status", handleArStatus as EventListener);
    return () => {
      el.removeEventListener("load", handleLoad as EventListener);
      el.removeEventListener("error", handleError as EventListener);
      el.removeEventListener("camera-change", handleCameraChange as EventListener);
      el.removeEventListener("ar-status", handleArStatus as EventListener);
    };
  }, [analytics, onArStatus]);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-center" style={{ height }}>
        <AlertTriangle className="h-5 w-5 text-primary" />
        <p className="text-sm text-black/65">
          Nepodařilo se načíst 3D model. Zkuste obnovit stránku nebo otevřít detail produktu.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {React.createElement("model-viewer", {
        ref,
        src,
        "ios-src": iosSrc || undefined,
        alt,
        ar: true,
        "ar-modes": "scene-viewer webxr quick-look",
        "camera-controls": true,
        "auto-rotate": true,
        exposure: "1",
        "shadow-intensity": "1",
        style: { width: "100%", height, backgroundColor: "#f8fbff" },
      })}

      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-[1px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black/65 shadow-sm">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin text-primary" />
            Načítám 3D model...
          </div>
        </div>
      ) : null}
    </div>
  );
}
