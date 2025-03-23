import { CALENDAR_MODES } from "@/lib/const";

const Options = ({ modeSetter, currentMode }) => {
  const currentModeKey = typeof currentMode === "object" ? currentMode.key : currentMode;

  return (
    <div>
      {CALENDAR_MODES.map((mode) => (
        <button
          key={mode.key}
          className={`p-2 mr-2 rounded ${currentModeKey === mode.key ? "underline" : ""}`}
          onClick={() => modeSetter(mode)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default Options;
