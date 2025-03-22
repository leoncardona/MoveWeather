import { useState, useCallback } from "react";
import citiesData from "../assets/cities.json";
import countriesData from "../assets/countries.json";

const useCities = () => {
  const [cities, setCities] = useState([]);

  const getCityData = useCallback((cityName) => {
    if (!cityName) return;

    const removeAccents = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    try {
      const filteredCities = citiesData
        .filter((city) =>
          removeAccents(city.name.toLowerCase()).includes(
            removeAccents(cityName.toLowerCase())
          )
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
