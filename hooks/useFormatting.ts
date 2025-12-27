import { formatTemperature, formatVolume } from "../app/(app)/shared/Formatting";
import { useBabyContext } from "./useBabyContext";

/**
 * PROJECT CRADLE: UNIVERSAL FORMATTING HOOK
 * Automatically adapts units based on user preferences
 */
export const useFormatting = () => {
  const { data: baby } = useBabyContext();

  const isMetric = baby?.unit_preference !== "IMPERIAL";

  const displayTemp = (celsiusValue: string) => {
    return formatTemperature(celsiusValue, !isMetric);
  };

  const displayVolume = (mlValue: number) => {
    return formatVolume(mlValue, !isMetric);
  };

  return {
    displayTemp,
    displayVolume,
    isMetric,
    units: {
      temp: isMetric ? "°C" : "°F",
      volume: isMetric ? "ml" : "oz",
      weight: isMetric ? "kg" : "lb",
    },
  };
};

// Exporting as default hook
export default useFormatting;