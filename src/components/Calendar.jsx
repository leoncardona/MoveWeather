import useWeather from "@/hooks/useWeather";
import { getColorForScore } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const today = new Date();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Short version for mobile
  const daysOfWeekShort = ["M", "T", "W", "T", "F", "S", "S"];

  const modeKey = typeof mode === "object" ? mode.key : mode;
  const modeLabel =
    typeof mode === "object" ? mode.label : modeKey === "paddleSurf" ? "Paddle Surf" : "Hiking";

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    getWeatherData(coordinates);
  }, [getWeatherData, coordinates]);

  // Determine if we're on mobile view
  const isMobile = windowWidth < 768;

  // For mobile, we'll show fewer days
  const daysToShow = isMobile ? 7 : 16;

  if (loading) {
    return (
      <div className="h-[300px] md:h-[400px] flex items-center justify-center">
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
      <div className="h-[300px] md:h-[400px] flex items-center justify-center">
        <span>No {modeLabel} information available</span>
      </div>
    );
  }

  // Create days array
  const days = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  // Mobile view - list format for days
  if (isMobile) {
    return (
      <div className="h-full overflow-hidden">
        <div className="grid grid-cols-1 gap-2">
          {days.map((date, index) => {
            const value = index < weatherData[modeKey].length ? weatherData[modeKey][index] : null;

            if (value === null) return null;

            // Get relevant weather factors based on activity
            const factorData = modes[modeKey].dataKeys.map((key) =>
              weatherData.rawData[key] && index < weatherData.rawData[key].length
                ? weatherData.rawData[key][index]
                : null
            );

            const dayName = daysOfWeek[(date.getDay() + 6) % 7];

            return (
              <div
                key={index}
                className="p-3 rounded-lg text-white font-semibold"
                style={{
                  backgroundColor: modes[modeKey].colorFunction(value),
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{dayName}</span>
                    <span>
                      {date.getDate()}/{date.getMonth() + 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">{value}/10</span>
                    <span className="text-xs">({modes[modeKey].getDescription(value)})</span>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
                  {modes[modeKey].factors.map((factor, idx) => (
                    <div key={idx} className="text-center">
                      <div className="font-medium">{factor}</div>
                      <div>
                        {factorData[idx] !== null ? factorData[idx] : "N/A"}{" "}
                        {modes[modeKey].units[idx]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop view - calendar format
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
              <th key={index} className="p-3 md:p-5 text-center">
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
                    className="p-2 md:p-5 text-center relative group text-white font-semibold text-sm md:text-base"
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
                  <td key={dayIndex} className="p-2 md:p-5 text-center">
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
