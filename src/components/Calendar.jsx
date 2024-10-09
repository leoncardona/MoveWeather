import useWeather from "@/hooks/useWeather";
import {
  getColorForTemperature,
  getColorForWaveHeight,
  getColorForWindSpeed,
} from "@/lib/utils";
import { useEffect } from "react";

const modes = {
  temperature: {
    endpoint: "temperature_2m_max",
    colorFunction: getColorForTemperature,
    unit: "°C",
  },
  wind: {
    endpoint: "windspeed_10m_max",
    colorFunction: getColorForWindSpeed,
    unit: "m/s",
  },
  waves: {
    endpoint: "wave_height_max",
    colorFunction: getColorForWaveHeight,
    unit: "m",
    api: "marine",
  },
};

const Calendar = ({ mode = "temperature", coordinates }) => {
  const { weatherData, getWeatherData } = useWeather();

  const today = new Date();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    getWeatherData(coordinates);
  }, [getWeatherData, coordinates]);

  const isWeatherDataUnavailable =
    !weatherData ||
    !weatherData[mode] ||
    weatherData[mode].every((value) => value === null);

  if (isWeatherDataUnavailable) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <span>No information available</span>
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
    currentWeek[dayOfWeek] = { date, value: weatherData[mode][index] };

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
                      backgroundColor: modes[mode].colorFunction(day.value),
                    }}
                  >
                    {day.date.getDate()}
                    <span className="text-xs absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#131313] text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.value} {modes[mode].unit}
                    </span>
                  </td>
                ) : (
                  <td key={dayIndex} className="p-5 text-center">
                    {/* Empty cell */}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
