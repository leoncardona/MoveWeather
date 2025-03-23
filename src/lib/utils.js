import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getColorForPaddleSurf = (score) => {
  if (score >= 8) {
    return "#00b894";
  } else if (score >= 6) {
    return "#00cec9";
  } else if (score >= 4) {
    return "#fdcb6e";
  } else if (score >= 2) {
    return "#e17055";
  } else {
    return "#d63031";
  }
};

export const getColorForHiking = (value) => {
  if (value >= 8) return "#059669";
  if (value >= 6) return "#10b981";
  if (value >= 4) return "#f59e0b";
  if (value >= 2) return "#d97706";
  return "#dc2626";
};
