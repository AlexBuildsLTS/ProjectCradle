/**
 * PROJECT CRADLE: BIOMETRIC FORMATTER
 * Ensures consistent data display across ML/OZ and C/F
 */
export const formatTemperature = (value: string, toFahrenheit: boolean) => {
  const temp = parseFloat(value);
  if (isNaN(temp)) return "--";
  if (toFahrenheit) return ((temp * 9/5) + 32).toFixed(1) + "°F";
  return temp.toFixed(1) + "°C";
};

export const formatVolume = (ml: number, toOz: boolean) => {
  if (toOz) return (ml * 0.033814).toFixed(1) + " oz";
  return ml + " ml";
};

// CRITICAL FIX: Adding the default export
export default { formatTemperature, formatVolume };