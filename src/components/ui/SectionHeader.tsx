import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
};

export function SectionHeader({
  label,
  title,
  subtitle,
  align = "left",
  dark = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        align === "center" && subtitle && "mx-auto",
        className
      )}
    >
      {label && (
        <span className={cn("section-label", dark && "bg-white/10 text-emerald-300")}>
          {label}
        </span>
      )}
      <h2
        className={cn(
          "section-title",
          dark && "text-white",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "section-subtitle",
            dark && "text-slate-400",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
