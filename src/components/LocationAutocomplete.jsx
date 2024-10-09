import { useEffect, useState } from "react";
import useCities from "../hooks/useCities";
import useLocalStorage from "../hooks/useLocalStorage";

const LocationAutocomplete = ({ minChars = 3, coordinateSetter }) => {
  const [input, setInput] = useState("");
  const { cities, getCityData } = useCities();

  const { getStoredValue, setStoredValue } = useLocalStorage();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleCitySelection = (city) => {
    setInput(city.name);
    const coordinates = { latitude: city.lat, longitude: city.lon };
    coordinateSetter(coordinates);
    setStoredValue("coordinates", coordinates);
    setStoredValue("city", city.name);
  }

  const handleClearInput = () => {
    setInput("");
    document.getElementById("location-input").focus();
  }
  
  useEffect(() => {
    if (input.length >= minChars) {
      getCityData(input);
    }
  }, [input, minChars, getCityData]);

  useEffect(() => {
    const storedCityName = getStoredValue("city");
    if (storedCityName) {
      setInput(storedCityName);
    }
  }, []);

  return (
    <section className="relative">
      <div className="flex gap-2">
        <input
          id="location-input"
          className="p-2 border rounded w-full text-black"
          type="text"
          placeholder="Search for a city"
          value={input}
          onChange={handleInputChange}
        />
        {input.length > 0 && (
          <button className="p-2 rounded bg-black bg-opacity-85" onClick={() => handleClearInput()}>
            Clear
          </button>
        )}
      </div>

      {cities.length > 0 && input.length >= minChars && (
        <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded max-h-60 overflow-y-auto z-10">
          {cities.map((city, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200 text-black"
              onClick={() => handleCitySelection(city)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default LocationAutocomplete;
