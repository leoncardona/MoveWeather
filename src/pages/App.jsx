import LocationAutocomplete from "@/components/LocationAutocomplete";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CALENDAR_MODES } from "@/lib/const";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Options from "../components/Options";
import { Cloud, CloudRain, Sun } from "lucide-react";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { TranslationProvider } from "../i18n/TranslationContext";
import { useTranslation } from "../i18n/TranslationContext";

const AppContent = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [currentMode, setCurrentMode] = useState(CALENDAR_MODES[1]); // Hiking
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
      {/* Language Switcher */}
      <div className="absolute top-4 right-4" style={{ zIndex: 40 }}>
        <LanguageSwitcher />
      </div>

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

      <div className="px-4 flex flex-col items-center w-full max-w-xl relative">
        {loading ? (
          <div className="flex flex-col items-center gap-6">
            <div className="h-10 w-10 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
            <p>{t('common.loading')}</p>
          </div>
        ) : (
          <>
            {!hasStoredPlace && (
              <div className="flex flex-col items-center">
                <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 tracking-tight">
                  MoveWeather
                </h1>
                <p className="text-xl text-gray-400 mt-4 text-center">
                  {t('common.activityForecast')}
                </p>
              </div>
            )}

            <section
              className={`flex flex-col gap-6 w-full ${hasStoredPlace ? "mt-8" : "mt-4 w-2/3"}`}
            >
              <div
                className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10 shadow-xl relative"
                style={{ zIndex: 30 }}
              >
                <LocationAutocomplete coordinateSetter={setCoordinates} />
              </div>

              {hasStoredPlace && (
                <div className="space-y-6 animate-fade-in w-full relative">
                  <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10 shadow-xl relative z-50">
                    <Options modeSetter={setCurrentMode} currentMode={currentMode} />
                  </div>

                  <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10 shadow-xl relative z-40">
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

const App = () => {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  );
};

export default App;
