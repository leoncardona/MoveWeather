import { useCallback, useState } from "react";

const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState({
    paddleSurf: [],
    hiking: [],
  });
  const [loading, setLoading] = useState(false);

  const calculatePaddleSurfScores = useCallback((tempData, windData, waveData) => {
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
  }, []);

  const calculateHikingScores = useCallback((tempData, windData, precipData) => {
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
  }, []);

  const getWeatherData = useCallback(
    async (coordinates) => {
      if (coordinates.latitude && coordinates.longitude) {
        setLoading(true);
        try {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=temperature_2m_max,windspeed_10m_max,precipitation_sum&timezone=auto&forecast_days=16`
          );
          const weatherData = await weatherResponse.json();

          const waveResponse = await fetch(
            `https://marine-api.open-meteo.com/v1/marine?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=wave_height_max&timezone=auto&forecast_days=16`
          );
          const waveData = await waveResponse.json();

          const temperatureData = weatherData.daily.temperature_2m_max;
          const windData = weatherData.daily.windspeed_10m_max;
          const precipitationData = weatherData.daily.precipitation_sum;
          const wavesData = waveData.daily.wave_height_max;

          const paddleSurfScores = calculatePaddleSurfScores(temperatureData, windData, wavesData);
          const hikingScores = calculateHikingScores(temperatureData, windData, precipitationData);

          setWeatherData({
            paddleSurf: paddleSurfScores,
            hiking: hikingScores,
          });
        } catch (error) {
          console.error("Error fetching weather data:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    [calculatePaddleSurfScores, calculateHikingScores]
  );

  return {
    weatherData,
    loading,
    getWeatherData,
  };
};

export default useWeatherData;
