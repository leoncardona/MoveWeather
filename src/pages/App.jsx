import LocationAutocomplete from "@/components/LocationAutocomplete";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Options from "../components/Options";
import { CALENDAR_MODES } from "@/lib/const";

const App = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [currentMode, setCurrentMode] = useState(CALENDAR_MODES[0]); // Paddle Surf
  const [loading, setLoading] = useState(true);

  const { getStoredValue } = useLocalStorage();

  useEffect(() => {
    const storedCoordinates = getStoredValue("coordinates");
    if (storedCoordinates) {
      setCoordinates(storedCoordinates);
    }
    setLoading(false);
  }, []);

  const sectionWidth = coordinates.latitude && coordinates.longitude ? "w-[30rem]" : "w-[25rem]";
  const sectionMarginTop = coordinates.latitude && coordinates.longitude ? "mt-28" : "mt-1";

  return (
    <main>
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-pulse text-center text-gray-500">Loading...</div>
        </div>
      ) : (
        <>
          {!coordinates.latitude && !coordinates.longitude && (
            <div className="flex flex-col items-center gap-4">
              <img src="/logo.png" alt="logo" width={200} />
              <h1 className="opacity-85 text-lg">Activity aimed weather.</h1>
            </div>
          )}

          <section className={`flex flex-col gap-4 ${sectionWidth} ${sectionMarginTop}`}>
            <LocationAutocomplete coordinateSetter={setCoordinates} />
            {coordinates.latitude && coordinates.longitude && (
              <>
                <Options modeSetter={setCurrentMode} currentMode={currentMode} />
                <Calendar mode={currentMode} coordinates={coordinates} />
              </>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default App;
