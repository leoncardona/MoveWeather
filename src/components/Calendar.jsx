import useWeather from "@/hooks/useWeather";
import { getColorForPaddleSurf, getColorForHiking } from "@/lib/utils";
import { useEffect } from "react";

const modes = {
  paddleSurf: {
    colorFunction: getColorForPaddleSurf,
    unit: "score",
    getDescription: (value) => {
      if (value >= 8) return "Excellent";
      if (value >= 6) return "Good";
      if (value >= 4) return "Fair";
      if (value >= 2) return "Poor";
      return "Avoid";
    },
  },
  hiking: {
    colorFunction: getColorForHiking,
    unit: "score",
    getDescription: (value) => {
      if (value >= 8) return "Perfect Day";
      if (value >= 6) return "Good Conditions";
      if (value >= 4) return "Acceptable";
      if (value >= 2) return "Challenging";
      return "Not Recommended";
    },
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
    currentWeek[dayOfWeek] = {
      date,
      value: index < weatherData[modeKey].length ? weatherData[modeKey][index] : null,
    };

    if (dayOfWeek === 6 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }
  });

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
                    <span className="text-xs absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#131313] text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.value}/10 {modes[modeKey].getDescription(day.value)}
                    </span>
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
