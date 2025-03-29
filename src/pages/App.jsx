import LocationAutocomplete from "@/components/LocationAutocomplete";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CALENDAR_MODES } from "@/lib/const";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Options from "../components/Options";
import { Cloud, CloudRain, Sun } from "lucide-react";

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

  const hasStoredPlace = coordinates.latitude && coordinates.longitude;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#000712] to-[#001845] text-white relative overflow-hidden flex items-center justify-center">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 text-blue-400/20">
        <Cloud size={64} />
      </div>
      <div className="absolute top-40 right-20 text-yellow-400/20">
        <Sun size={80} />
      </div>
      <div className="absolute bottom-20 left-1/4 text-blue-300/20">
        <CloudRain size={48} />
      </div>

      <div className="px-4 flex flex-col items-center w-full max-w-3xl relative">
        {loading ? (
          <div className="flex flex-col items-center gap-6">
            <div className="h-10 w-10 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            {!hasStoredPlace && (
              <div className="flex flex-col items-center">
                <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 tracking-tight">
                  MoveWeather
                </h1>
                <h2 className="text-blue-200 text-lg md:text-xl mt-3 text-center max-w-md">
                  Find the perfect day for your outdoor activities
                </h2>
              </div>
            )}

            <section
              className={`flex flex-col gap-6 relative ${hasStoredPlace ? "mt-8" : "mt-4 w-2/3"}`}
            >
              <div
                className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10 shadow-xl relative"
                style={{ zIndex: 30 }}
              >
                <LocationAutocomplete coordinateSetter={setCoordinates} />
              </div>

              {hasStoredPlace && (
                <div className="space-y-6 animate-fade-in w-full relative" style={{ zIndex: 20 }}>
                  <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10 shadow-xl">
                    <Options modeSetter={setCurrentMode} currentMode={currentMode} />
                  </div>

                  <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10 shadow-xl">
                    <Calendar mode={currentMode} coordinates={coordinates} />
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default App;
