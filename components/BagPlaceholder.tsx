type Props = {
  alt: string;
  className?: string;
  aspect?: "square" | "portrait" | "landscape";
};

const aspectClass: Record<NonNullable<Props["aspect"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

export default function BagPlaceholder({ alt, className = "", aspect = "square" }: Props) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`${aspectClass[aspect]} w-full bg-gradient-to-br from-stone-200 to-stone-400 flex items-center justify-center text-stone-600 text-sm px-4 text-center ${className}`}
    >
      <span className="opacity-70">{alt}</span>
    </div>
  );
}
