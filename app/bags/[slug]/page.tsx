import { notFound } from "next/navigation";
import { bags, getBagBySlug } from "@/data/bags";
import BagDetail from "@/components/BagDetail";

export function generateStaticParams() {
  return bags.map((b) => ({ slug: b.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const bag = getBagBySlug(slug);
  if (!bag) return { title: "Not found — bgd" };
  return { title: `${bag.name} — bgd`, description: bag.tagline };
}

export default async function BagPage({ params }: Props) {
  const { slug } = await params;
  const bag = getBagBySlug(slug);
  if (!bag) notFound();
  return <BagDetail bag={bag} />;
}
