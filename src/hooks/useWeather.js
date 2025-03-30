import { useCallback, useState } from "react";
import {
  calculatePaddleSurfScores,
  calculateHikingScores,
  calculateFishingScores,
  calculateBeachScores,
} from "../lib/utils";

const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState({
    paddleSurf: [],
    hiking: [],
    fishing: [],
    beach: [],
    rawData: {
      temperature: [],
      wind: [],
      precipitation: [],
      waves: [],
      dates: [],
    },
  });
  const [loading, setLoading] = useState(false);

  const getWeatherData = useCallback(
    async (coordinates) => {
      if (coordinates.latitude && coordinates.longitude) {
        setLoading(true);
        try {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=temperature_2m_max,windspeed_10m_max,precipitation_sum&timezone=auto&forecast_days=14`
          );
          const weatherData = await weatherResponse.json();

          const waveResponse = await fetch(
            `https://marine-api.open-meteo.com/v1/marine?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=wave_height_max&timezone=auto&forecast_days=14`
          );
          const waveData = await waveResponse.json();

          const temperatureData = weatherData.daily.temperature_2m_max;
          const windData = weatherData.daily.windspeed_10m_max;
          const precipitationData = weatherData.daily.precipitation_sum;
          const wavesData = waveData.daily.wave_height_max;
          const datesData = weatherData.daily.time;

          const paddleSurfScores = calculatePaddleSurfScores(temperatureData, windData, wavesData);
          const hikingScores = calculateHikingScores(temperatureData, windData, precipitationData);
          const fishingScores = calculateFishingScores(temperatureData, windData, precipitationData, wavesData);
          const beachScores = calculateBeachScores(temperatureData, windData, precipitationData, wavesData);

          setWeatherData({
            paddleSurf: paddleSurfScores,
            hiking: hikingScores,
            fishing: fishingScores,
            beach: beachScores,
            rawData: {
              temperature: temperatureData,
              wind: windData,
              precipitation: precipitationData,
              waves: wavesData,
              dates: datesData,
            },
          });
        } catch (error) {
          console.error("Error fetching weather data:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    []
  );

  return {
    weatherData,
    loading,
    getWeatherData,
  };
};

export default useWeatherData;
