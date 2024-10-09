import { useState, useCallback } from "react";
import citiesData from "../assets/cities.json";
import countriesData from "../assets/countries.json";

const useCities = () => {
  const [cities, setCities] = useState([]);

  const getCityData = useCallback((cityName) => {
    if (!cityName) return;

    try {
      const filteredCities = citiesData
        .filter((city) =>
          city.name.toLowerCase().includes(cityName.toLowerCase())
        )
        .map((city) => {
          const cityName = city.name;
          const country = countriesData.find(
            (country) => country.code === city.country
          ).name;

          return {
            name: `${cityName}, ${country}`,
            lat: city.lat,
            lon: city.lon,
          };
        });

      setCities(filteredCities);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  }, []);

  return {
    cities,
    getCityData,
  };
};

export default useCities;
