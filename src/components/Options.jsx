import { CALENDAR_MODES } from "@/lib/const";
import { useTranslation } from "../i18n/TranslationContext";

const Options = ({ modeSetter, currentMode }) => {
  const currentModeKey = typeof currentMode === "object" ? currentMode.key : currentMode;
  const { t } = useTranslation();

  return (
    <div>
      {CALENDAR_MODES.map((mode) => (
        <button
          key={mode.key}
          className={`p-2 mr-2 rounded ${currentModeKey === mode.key ? "text-white" : "text-white/50"}`}
          onClick={() => modeSetter(mode)}
        >
          {t(`activities.${mode.key}.title`)}
        </button>
      ))}
    </div>
  );
};

export default Options;
