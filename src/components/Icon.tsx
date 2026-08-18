import type { CSSProperties } from "react";

export function Icon({
  path,
  size = 24,
  className,
  style,
}: {
  path: string;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}
