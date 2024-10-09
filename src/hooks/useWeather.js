import { useEffect, useState, useCallback } from "react";

const useWeatherData = () => {
  const [data, setData] = useState({ temperature: [], wind: [], waves: [] });

  const getWeatherData = useCallback(
    async (coordinates) => {
      if (coordinates.latitude && coordinates.longitude) {
        try {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=temperature_2m_max,windspeed_10m_max&timezone=auto&forecast_days=16`,
          );
          const weatherData = await weatherResponse.json();

          const waveResponse = await fetch(
            `https://marine-api.open-meteo.com/v1/marine?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=wave_height_max&timezone=auto&forecast_days=16`,
          );
          const waveData = await waveResponse.json();

          setData({
            temperature: weatherData.daily.temperature_2m_max,
            wind: weatherData.daily.windspeed_10m_max,
            waves: waveData.daily.wave_height_max,
          });
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    },
    [],
  );

  return {
    weatherData: data,
    getWeatherData,
  };
};

export default useWeatherData;
