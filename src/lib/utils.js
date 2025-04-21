import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const calculateSurfingScores = (tempData, windData, precipData, waveData) => {
  if (!tempData || !windData || !precipData || !waveData) {
    return [];
  }
  return tempData.map((temp, index) => {
    const windSpeed = windData[index];
    const precipitation = precipData[index];
    const waveHeight = waveData[index];
    if (temp === null || windSpeed === null || precipitation === null || waveHeight === null) {
      return null;
    }
    let score = 10;
    // Temperature scoring (15-28°C optimal)
    if (temp < 12) {
      score -= 2;
    } else if (temp > 32) {
      score -= 2;
    }
    // Wind scoring (low wind best)
    if (windSpeed > 25) {
      score -= 4;
    } else if (windSpeed > 15) {
      score -= 2;
    } else if (windSpeed > 10) {
      score -= 1;
    }
    // Wave height scoring (1-2.5m optimal, <0.5m poor, >3m dangerous)
    if (waveHeight > 3) {
      score -= 6;
    } else if (waveHeight > 2.5) {
      score -= 3;
    } else if (waveHeight >= 1) {
      // optimal
    } else if (waveHeight < 0.5) {
      score -= 4;
    }
    // Precipitation scoring
    if (precipitation > 10) {
      score -= 4;
    } else if (precipitation > 5) {
      score -= 2;
    } else if (precipitation > 1) {
      score -= 1;
    }
    return Math.max(0, Math.min(10, score));
  });
};

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

export const calculatePaddleSurfScores = (tempData, windData, waveData) => {
  if (!tempData || !windData || !waveData) {
    return [];
  }

  return tempData.map((temp, index) => {
    const windSpeed = windData[index];
    const waveHeight = waveData[index];

    if (temp === null || windSpeed === null || waveHeight === null) {
      return null;
    }

    let score = 10;

    if (temp < 15) {
      score -= 3;
    } else if (temp < 20) {
      score -= 1;
    } else if (temp > 35) {
      score -= 2;
    }

    if (windSpeed > 25) {
      score -= 5;
    } else if (windSpeed > 15) {
      score -= 3;
    } else if (windSpeed > 10) {
      score -= 1;
    }

    if (waveHeight > 1.5) {
      score -= 4;
    } else if (waveHeight > 1.2) {
      score -= 2;
    } else if (waveHeight < 0.2) {
      score -= 1;
    }

    return Math.max(0, Math.min(10, score));
  });
};

export const calculateHikingScores = (tempData, windData, precipData) => {
  if (!tempData || !windData || !precipData) {
    return [];
  }

  return tempData.map((temp, index) => {
    const windSpeed = windData[index];
    const precipitation = precipData[index];

    if (temp === null || windSpeed === null || precipitation === null) {
      return null;
    }

    let score = 10;

    // Temperature scoring
    if (temp < 5) {
      score -= 4; // Too cold
    } else if (temp < 10) {
      score -= 2; // Chilly
    } else if (temp > 30) {
      score -= 3; // Too hot
    } else if (temp > 25) {
      score -= 1; // Warm
    }

    // Wind scoring
    if (windSpeed > 40) {
      score -= 5; // Dangerous wind
    } else if (windSpeed > 30) {
      score -= 4; // Very strong wind
    } else if (windSpeed > 20) {
      score -= 2; // Strong wind
    } else if (windSpeed > 15) {
      score -= 1; // Moderate wind
    }

    // Precipitation scoring
    if (precipitation > 10) {
      score -= 5; // Heavy rain
    } else if (precipitation > 5) {
      score -= 3; // Moderate rain
    } else if (precipitation > 2) {
      score -= 2; // Light rain
    } else if (precipitation > 0.5) {
      score -= 1; // Drizzle
    }

    return Math.max(0, Math.min(10, score));
  });
};

export const calculateFishingScores = (tempData, windData, precipData, waveData) => {
  if (!tempData || !windData || !precipData || !waveData) {
    return [];
  }

  return tempData.map((temp, index) => {
    const windSpeed = windData[index];
    const precipitation = precipData[index];
    const waveHeight = waveData[index];

    if (temp === null || windSpeed === null || precipitation === null || waveHeight === null) {
      return null;
    }

    let score = 10;

    // Temperature scoring - fish are more active in moderate temperatures
    if (temp < 5) {
      score -= 4; // Too cold, fish less active
    } else if (temp < 10) {
      score -= 2; // Cool, reduced activity
    } else if (temp > 30) {
      score -= 3; // Too hot, fish seek deeper water
    } else if (temp > 25) {
      score -= 1; // Warm but manageable
    }

    // Wind scoring - affects casting and boat stability
    if (windSpeed > 35) {
      score -= 5; // Dangerous conditions
    } else if (windSpeed > 25) {
      score -= 4; // Very difficult to fish
    } else if (windSpeed > 15) {
      score -= 2; // Challenging conditions
    } else if (windSpeed > 10) {
      score -= 1; // Slight impact
    }

    // Wave height scoring - affects boat stability and fishing conditions
    if (waveHeight > 2.5) {
      score -= 5; // Dangerous for boats
    } else if (waveHeight > 2) {
      score -= 4; // Very rough, difficult fishing
    } else if (waveHeight > 1.5) {
      score -= 3; // Challenging boat conditions
    } else if (waveHeight > 1) {
      score -= 1; // Moderate waves, manageable
    }

    // Precipitation scoring - can affect visibility and fish behavior
    if (precipitation > 15) {
      score -= 4; // Heavy rain, poor conditions
    } else if (precipitation > 10) {
      score -= 2; // Moderate rain
    } else if (precipitation > 5) {
      score -= 1; // Light rain, can be good for fishing
    }

    return Math.max(0, Math.min(10, score));
  });
};

export const calculateBeachScores = (tempData, windData, precipData, waveData) => {
  if (!tempData || !windData || !precipData || !waveData) {
    return [];
  }

  return tempData.map((temp, index) => {
    const windSpeed = windData[index];
    const precipitation = precipData[index];
    const waveHeight = waveData[index];

    if (temp === null || windSpeed === null || precipitation === null || waveHeight === null) {
      return null;
    }

    let score = 10;

    // Temperature scoring - ideal beach weather
    if (temp < 20) {
      score -= 4; // Too cold for beach
    } else if (temp < 23) {
      score -= 2; // A bit cool for beach
    } else if (temp > 35) {
      score -= 2; // Too hot, risk of sunburn
    } else if (temp > 32) {
      score -= 1; // Very hot but manageable
    }

    // Wind scoring - affects comfort and sand
    if (windSpeed > 30) {
      score -= 5; // Very unpleasant, blowing sand
    } else if (windSpeed > 25) {
      score -= 4; // Strong wind, uncomfortable
    } else if (windSpeed > 20) {
      score -= 3; // Moderate wind, some sand
    } else if (windSpeed > 15) {
      score -= 1; // Light breeze, pleasant
    }

    // Wave height scoring - affects swimming safety and enjoyment
    if (waveHeight > 2) {
      score -= 5; // Dangerous for swimming
    } else if (waveHeight > 1.5) {
      score -= 3; // Rough for casual swimmers
    } else if (waveHeight > 1) {
      score -= 2; // Challenging for some
    } else if (waveHeight < 0.2) {
      score -= 1; // Very calm, less fun
    }

    // Precipitation scoring - nobody likes a rainy beach day
    if (precipitation > 5) {
      score -= 5; // Significant rain
    } else if (precipitation > 2) {
      score -= 4; // Moderate rain
    } else if (precipitation > 0.5) {
      score -= 3; // Light rain
    } else if (precipitation > 0.1) {
      score -= 2; // Drizzle
    }

    return Math.max(0, Math.min(10, score));
  });
};
