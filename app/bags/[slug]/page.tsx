import { notFound } from "next/navigation";
import { getAllBags, getBagBySlug } from "@/data/bags";
import BagDetail from "@/components/BagDetail";

export async function generateStaticParams() {
  const bags = await getAllBags();
  return bags.map((b) => ({ slug: b.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const bag = await getBagBySlug(slug);
  if (!bag) return { title: "Not found — bgd" };
  return { title: `${bag.name} — bgd`, description: bag.tagline };
}

export default async function BagPage({ params }: Props) {
  const { slug } = await params;
  const bag = await getBagBySlug(slug);
  if (!bag) notFound();
  return <BagDetail bag={bag} />;
}
