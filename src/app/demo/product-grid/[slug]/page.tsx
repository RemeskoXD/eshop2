import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductSubpageSkeleton from "@/components/product-subpage-skeleton";
import { mockProducts } from "@/lib/mocks/products";

type ProductDemoSubpageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductDemoSubpageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);
  if (!product) return { title: "Demo produkt | QAPI", robots: { index: false, follow: false } };

  return {
    title: `${product.title} (demo) | QAPI`,
    description: product.shortDescription,
    robots: { index: false, follow: false },
  };
}

export default async function ProductDemoSubpage({ params }: ProductDemoSubpageProps) {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <ProductSubpageSkeleton
      title={product.title}
      description={product.description}
      model3dUrl={product.model3dUrl}
      specs={product.specifications}
    />
  );
}
