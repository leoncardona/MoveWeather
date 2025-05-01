import { CALENDAR_MODES } from "@/lib/const";
import { useTranslation } from "../i18n/TranslationContext";
import { useState, useRef, useEffect } from "react";

const Options = ({ modeSetter, currentMode }) => {
  const currentModeKey = typeof currentMode === "object" ? currentMode.key : currentMode;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filter activities based on search term
  const filteredActivities = CALENDAR_MODES.filter(mode => {
    const activityName = t(`activities.${mode.key}.title`).toLowerCase();
    return activityName.includes(searchTerm.toLowerCase());
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get current activity name
  const currentActivityName = t(`activities.${currentModeKey}.title`);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Select button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 flex justify-between items-center bg-white/10 hover:bg-white/15 rounded-md text-white border border-white/20"
      >
        <span>{currentActivityName}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-gray-800/95 border border-white/20 shadow-lg">
          {/* Search input */}
          <div className="p-2">
            <input
              type="text"
              placeholder={t("common.selectActivity")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Activity options */}
          <div className="max-h-60 overflow-auto">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((mode) => (
                <button
                  key={mode.key}
                  className={`w-full text-left p-2 hover:bg-white/10 ${currentModeKey === mode.key ? "bg-blue-600/50" : ""}`}
                  onClick={() => {
                    modeSetter(mode);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {t(`activities.${mode.key}.title`)}
                </button>
              ))
            ) : (
              <div className="p-2 text-white/50">{t("common.noActivitiesFound")}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Options;
