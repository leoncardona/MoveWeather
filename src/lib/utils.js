import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getColorForScore = (value) => {
  if (value === 10) return "#166534"; // Dark green
  if (value === 9) return "#15803d"; // Medium dark green
  if (value === 8) return "#22c55e"; // Green
  if (value === 7) return "#4ade80"; // Light green
  if (value === 6) return "#fde047"; // Yellow
  if (value === 5) return "#facc15"; // Dark yellow
  if (value === 4) return "#f97316"; // Orange
  if (value === 3) return "#ea580c"; // Dark orange
  if (value === 2) return "#dc2626"; // Red
  if (value === 1) return "#b91c1c"; // Dark red
  return "#991b1b"; // Very dark red (for 0)
};
