import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
};

export function AppImage({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: Props) {
  const isSvg = src.endsWith(".svg");

  // SVG files: use native img (Next.js Image blocks SVG by default)
  if (isSvg) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full object-cover", className)}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width ?? 800}
        height={height ?? 500}
        className={cn("h-auto w-full object-cover", className)}
      />
    );
  }

  if (fill) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 500}
      priority={priority}
      sizes={sizes}
      className={cn("h-auto w-full object-cover", className)}
    />
  );
}
