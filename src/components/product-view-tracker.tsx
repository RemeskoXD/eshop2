"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

type ProductViewTrackerProps = {
  productId: string;
  productName: string;
};

export default function ProductViewTracker({
  productId,
  productName,
}: ProductViewTrackerProps) {
  useEffect(() => {
    trackEvent("view_product", { productId, productName });
  }, [productId, productName]);

  return null;
}
