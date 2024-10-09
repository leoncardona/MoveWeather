import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getColorForTemperature = (temperature) => {
  if (temperature <= -10) return "#3b82f6";
  if (temperature <= -8) return "#4f90f7";
  if (temperature <= -6) return "#61a1f8";
  if (temperature <= -4) return "#72b1fa";
  if (temperature <= -2) return "#83c1fb";
  if (temperature <= 0) return "#0ea5e9";
  if (temperature <= 2) return "#29b0ed";
  if (temperature <= 4) return "#42bbf1";
  if (temperature <= 6) return "#5cc6f5";
  if (temperature <= 8) return "#75d1f9";
  if (temperature <= 10) return "#38bdf8";
  if (temperature <= 12) return "#4ade80";
  if (temperature <= 14) return "#6ee27b";
  if (temperature <= 16) return "#89e778";
  if (temperature <= 18) return "#a3ec75";
  if (temperature <= 20) return "#bef072";
  if (temperature <= 22) return "#d8f56e";
  if (temperature <= 24) return "#facc15";
  if (temperature <= 26) return "#faae09";
  if (temperature <= 28) return "#fa8f04";
  if (temperature <= 30) return "#f97316";
  if (temperature <= 32) return "#f05e22";
  if (temperature <= 34) return "#e8482d";
  if (temperature <= 36) return "#ef4444";
  return "";
};

export const getColorForWindSpeed = (windSpeed) => {
  if (windSpeed <= 5) return "#a7f3d0";
  if (windSpeed <= 10) return "#6ee7b7";
  if (windSpeed <= 15) return "#34d399";
  if (windSpeed <= 20) return "#10b981";
  if (windSpeed <= 25) return "#059669";
  if (windSpeed <= 30) return "#047857";
  return "";
};

export const getColorForWaveHeight = (height) => {
  if (height < 0.5) {
    return "#008B8B";
  } else if (height >= 0.5 && height < 1) {
    return "#0073CF";
  } else if (height >= 1 && height < 1.5) {
    return "#0061A7";
  } else if (height >= 1.5 && height < 2) {
    return "#004B8A";
  } else if (height >= 2 && height < 2.5) {
    return "#003366";
  } else if (height >= 2.5 && height < 3) {
    return "#002B5C";
  } else if (height >= 3 && height < 4) {
    return "#001B4D";
  } else if (height >= 4 && height < 5) {
    return "#001038";
  } else {
    return "";
  }
};
