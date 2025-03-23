import useWeather from "@/hooks/useWeather";
import { getColorForScore } from "@/lib/utils";
import { useEffect } from "react";

const modes = {
  paddleSurf: {
    colorFunction: getColorForScore,
    unit: "score",
    getDescription: (value) => {
      if (value >= 8) return "Excellent";
      if (value >= 6) return "Good";
      if (value >= 4) return "Fair";
      if (value >= 2) return "Poor";
      return "Avoid";
    },
    factors: ["Temperature", "Wind Speed", "Wave Height"],
    dataKeys: ["temperature", "wind", "waves"],
    units: ["°C", "km/h", "m"],
  },
  hiking: {
    colorFunction: getColorForScore,
    unit: "score",
    getDescription: (value) => {
      if (value >= 8) return "Perfect Day";
      if (value >= 6) return "Good Conditions";
      if (value >= 4) return "Acceptable";
      if (value >= 2) return "Challenging";
      return "Not Recommended";
    },
    factors: ["Temperature", "Wind Speed", "Precipitation"],
    dataKeys: ["temperature", "wind", "precipitation"],
    units: ["°C", "km/h", "mm"],
  },
};

const Calendar = ({ mode, coordinates }) => {
  const { weatherData, loading, getWeatherData } = useWeather();

  const today = new Date();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const modeKey = typeof mode === "object" ? mode.key : mode;
  const modeLabel =
    typeof mode === "object" ? mode.label : modeKey === "paddleSurf" ? "Paddle Surf" : "Hiking";

  useEffect(() => {
    getWeatherData(coordinates);
  }, [getWeatherData, coordinates]);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  const isDataAvailable =
    weatherData &&
    weatherData[modeKey] &&
    weatherData[modeKey].length > 0 &&
    !weatherData[modeKey].every((value) => value === null);

  if (!isDataAvailable) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <span>No {modeLabel} information available</span>
      </div>
    );
  }

  const days = Array.from({ length: 16 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const weeks = [];
  let currentWeek = new Array(7).fill(null);
  let startDayOfWeek = (days[0].getDay() + 6) % 7;

  days.forEach((date, index) => {
    const dayOfWeek = (startDayOfWeek + index) % 7;

    // Get relevant weather factors based on activity
    const factorData = modes[modeKey].dataKeys.map((key) =>
      weatherData.rawData[key] && index < weatherData.rawData[key].length
        ? weatherData.rawData[key][index]
        : null
    );

    currentWeek[dayOfWeek] = {
      date,
      value: index < weatherData[modeKey].length ? weatherData[modeKey][index] : null,
      factorData: factorData,
    };

    if (dayOfWeek === 6 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }
  });

  // Format date to get day and month
  const formatDate = (date) => {
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="h-[400px]">
      <table className="w-full">
        <thead>
          <tr>
            {daysOfWeek.map((day, index) => (
              <th key={index} className="p-5 text-center">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) =>
                day && day.value !== null ? (
                  <td
                    key={dayIndex}
                    className="p-5 text-center relative group text-white font-semibold"
                    style={{
                      backgroundColor: modes[modeKey].colorFunction(day.value),
                    }}
                  >
                    {day.date.getDate()}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-90 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 text-xs">
                      <div className="font-bold text-center">
                        {formatDate(day.date)} - {day.value}/10
                      </div>
                      <div className="text-center text-xs mb-1">
                        {modes[modeKey].getDescription(day.value)}
                      </div>
                      <hr className="my-1 opacity-50" />
                      {modes[modeKey].factors.map((factor, idx) => (
                        <div key={idx} className="text-xs my-0.5">
                          <span className="font-medium">{factor}:</span>{" "}
                          {day.factorData[idx] !== null ? day.factorData[idx] : "N/A"}{" "}
                          {modes[modeKey].units[idx]}
                        </div>
                      ))}
                    </div>
                  </td>
                ) : (
                  <td key={dayIndex} className="p-5 text-center">
                    {/* Empty cell */}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
