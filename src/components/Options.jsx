import { capitalizeFirstLetter } from "@/lib/utils";
import { CalendarModes } from "@/lib/const";
import useWeather from "@/hooks/useWeather";

const Options = ({ modeSetter, currentMode }) => {

  const { weatherData } = useWeather();

  return (
    <div>
      {Object.values(CalendarModes).map((mode) => (
        <button
          key={mode}
          className={`p-2 mr-2 rounded ${currentMode === mode ? "underline" : ""}`}
          onClick={() => modeSetter(mode)}
        >
          {capitalizeFirstLetter(mode)}
        </button>
      ))}
    </div>
  );
};

export default Options;
